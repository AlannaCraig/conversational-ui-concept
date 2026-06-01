import type { Patient } from './patientData';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ComplexityResult {
  score: number;
  level: RiskLevel;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  escalated: boolean;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some(t => lower.includes(t));
}

// Non-GP clinical settings that represent specialist involvement
function isNonGpEncounter(type: string): boolean {
  return containsAny(type, ['a&e', 'emergency', 'admission', 'hospital', 'inpatient']);
}

// Counts distinct specialties from non-GP encounters + care plan areas
function countSpecialties(patient: Patient): number {
  const specialties = new Set<string>();
  for (const enc of patient.encounters) {
    if (isNonGpEncounter(enc.type)) specialties.add('emergency');
  }
  for (const plan of patient.carePlans ?? []) {
    const area = plan.area.toLowerCase();
    if (!['lifestyle', 'general', 'gp'].includes(area)) {
      specialties.add(area);
    }
  }
  return specialties.size;
}

function countAbnormalInvestigations(patient: Patient): number {
  return patient.investigations.filter(
    i => i.flag && !i.flag.toLowerCase().startsWith('normal'),
  ).length;
}

// Clinical outcome phrases that indicate disease progression (checked against encounter outcomes)
const PROGRESSION_TERMS = [
  'progressing', 'suboptimal', 'deteriorat', 'declin', 'deconditioning', 'worsening',
  'reduced.*toleran', 'insuffici',
];

function hasProgressionInOutcomes(outcomes: string[]): boolean {
  const text = outcomes.join(' ').toLowerCase();
  return PROGRESSION_TERMS.some(t => new RegExp(t).test(text));
}

const MENTAL_HEALTH_TERMS = [
  'anxiety', 'depression', 'bipolar', 'schizophrenia', 'ptsd',
  'psychosis', 'eating disorder', 'ocd', 'mental illness',
];

const HIGH_RISK_DIAGNOSIS_TERMS = [
  'heart failure', 'cancer', 'ckd stage 4', 'ckd stage 5',
  'copd', 'dementia', 'frailty', 'severe mental illness',
];

// Escalation rule: hospital/emergency admission within the past N months
function hadEmergencyAdmissionWithinMonths(patient: Patient, months: number): boolean {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return patient.encounters.some(enc => {
    if (!isNonGpEncounter(enc.type)) return false;
    const d = new Date(enc.date);
    return !isNaN(d.getTime()) && d >= cutoff;
  });
}

// ─── Complexity Calculator ────────────────────────────────────────────────────

export function calcComplexity(patient: Patient): ComplexityResult {
  // 1. Chronic disease burden
  const n = patient.problemsDiagnoses.length;
  const chronicDisease = n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 5 ? 3 : 4;

  // 2. Medication complexity
  const m = patient.currentMedications.length;
  const medication = m <= 2 ? 0 : m <= 5 ? 1 : m <= 10 ? 2 : 3;

  // 3. Healthcare utilisation
  const e = patient.encounters.length;
  const utilisation = e <= 2 ? 0 : e <= 5 ? 1 : e <= 10 ? 2 : 3;

  // 4. Specialist involvement
  const s = countSpecialties(patient);
  const specialist = s === 0 ? 0 : s === 1 ? 1 : s <= 3 ? 2 : 3;

  // 5. Monitoring requirements — proxied from condition count and abnormal investigations
  const abnormal = countAbnormalInvestigations(patient);
  const carePlans = patient.carePlans?.length ?? 0;
  const monitoring = n >= 4 || (abnormal >= 2 && carePlans >= 2) ? 2
    : carePlans > 0 || abnormal > 0 ? 1
    : 0;

  const score = chronicDisease + medication + utilisation + specialist + monitoring;
  const level: RiskLevel = score <= 4 ? 'low' : score <= 9 ? 'medium' : 'high';

  return { score, level };
}

// ─── Risk Calculator ─────────────────────────────────────────────────────────

export function calcRisk(patient: Patient): RiskResult {
  // 1. Disease stability — assessed from clinical outcome language
  const progressingCount = patient.encounters.filter(enc =>
    hasProgressionInOutcomes(enc.outcome),
  ).length;
  const diseaseStability = progressingCount >= 3 ? 3
    : progressingCount === 2 ? 2
    : progressingCount === 1 ? 1
    : 0;

  // 2. Recent acute events
  const hasEmergencyAdmission = patient.encounters.some(enc => isNonGpEncounter(enc.type));
  const acuteGpCount = patient.encounters.filter(enc =>
    containsAny(enc.type, ['acute', 'urgent']) && !isNonGpEncounter(enc.type),
  ).length;
  const acuteEvents = hasEmergencyAdmission ? 3
    : acuteGpCount >= 2 ? 2
    : acuteGpCount === 1 ? 1
    : 0;

  // 3. Investigation findings
  const abnormal = countAbnormalInvestigations(patient);
  const hasCritical = patient.investigations.some(i =>
    containsAny(i.flag ?? '', ['critical', 'urgent']),
  );
  const investigationFindings = hasCritical ? 3 : abnormal >= 3 ? 2 : abnormal >= 1 ? 1 : 0;

  // 4. Mental health risk
  const hasMhCondition = patient.problemsDiagnoses.some(p =>
    containsAny(p.condition, MENTAL_HEALTH_TERMS),
  );
  const mhDeterioration = hasMhCondition && patient.encounters.some(enc =>
    hasProgressionInOutcomes(enc.outcome),
  );
  const mentalHealth = mhDeterioration ? 2 : hasMhCondition ? 1 : 0;

  // 5. High-risk diagnoses — COPD only qualifies if there has been an exacerbation/admission
  const hasCopd = patient.problemsDiagnoses.some(p => p.condition.toLowerCase().includes('copd'));
  const hasCopdExacerbation = hasCopd && patient.encounters.some(enc => isNonGpEncounter(enc.type));
  const highRiskCount = patient.problemsDiagnoses.filter(p =>
    containsAny(p.condition, HIGH_RISK_DIAGNOSIS_TERMS.filter(t => t !== 'copd')),
  ).length + (hasCopdExacerbation ? 1 : 0);
  const highRiskDiagnoses = highRiskCount === 0 ? 0 : highRiskCount === 1 ? 2 : 4;

  const rawScore = diseaseStability + acuteEvents + investigationFindings + mentalHealth + highRiskDiagnoses;
  let level: RiskLevel = rawScore <= 3 ? 'low' : rawScore <= 8 ? 'medium' : 'high';

  // Escalation: hospital admission within the last 6 months bumps level up by one
  const escalated = hadEmergencyAdmissionWithinMonths(patient, 6);
  if (escalated) {
    if (level === 'low') level = 'medium';
    else if (level === 'medium') level = 'high';
  }

  return { score: rawScore, level, escalated };
}
