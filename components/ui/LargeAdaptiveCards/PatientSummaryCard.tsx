/**
 * PatientSummaryCard Component
 *
 * Large data view showing patient summary with enhanced patient header and widget grid.
 * Widget content is populated by the AI summarization agent via /api/summarize-patient.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { PatientIcon, MoreVerticalIcon, ArrowRightIcon, TaskListIcon, ReferralIcon, PillIcon, CalendarIcon } from '@/components/icons';
import { ChevronRightIcon } from '@/components/ui/ChevronRightIcon';
import { ACTIVE_PATIENT, PATIENT_HARPER, PATIENT_ELLISON, type Patient } from '@/lib/patientData';
import { calcComplexity, calcRisk } from '@/lib/clinicalCalculators';
import { PatientEntryTile } from '@/components/ui/PatientEntryTile';
import { AllergyChip, type AllergyStatus } from '@/components/ui/AllergyChip';
import { RiskStatusChip, type RiskLevel } from '@/components/ui/RiskStatusChip';
import { LifestyleMetricTile } from '@/components/ui/LifestyleMetricTile';
import { TestGroupTile } from '@/components/ui/RecentTestTile';

function getAllergyStatus(allergyText: string): AllergyStatus {
  const lower = allergyText.toLowerCase();
  if (lower.includes('unavailable') || lower.includes('unknown')) return 'unavailable';
  if (lower.includes('not recorded') || lower.includes('no record')) return 'not-recorded';
  if (lower.includes('no known')) return 'none';
  return 'known';
}

const PATIENT_REGISTRY: Record<string, Patient> = {
  'PT-10001': PATIENT_HARPER,
  'PT-10002': PATIENT_ELLISON,
};

interface PatientSummaryCardProps {
  patientName?: string;
  dateOfBirth?: string;
  patientId?: string;
  sex?: string;
  allergyStatus?: string;
  onWidgetClick?: (widgetTitle: string) => void;
  showWidgets?: boolean;
  className?: string;
  activePatientId?: string;
}

const SUMMARY_WIDGET = { id: 'summary', title: 'Summary' };
const STACK_WIDGETS = [
  { id: 'encounters', title: 'Recent encounters' },
  { id: 'medications', title: 'Current medications' },
  { id: 'tests', title: 'Recent tests' },
];

// Separate Patient Header component for reuse
export function PatientHeader({
  patientName = ACTIVE_PATIENT.demographics.displayName,
  dateOfBirth = ACTIVE_PATIENT.demographics.dateOfBirth,
  patientId = ACTIVE_PATIENT.demographics.patientId,
  sex = ACTIVE_PATIENT.demographics.sex,
  allergyStatus = ACTIVE_PATIENT.demographics.allergies,
  className = '',
  activePatientId,
}: Omit<PatientSummaryCardProps, 'onWidgetClick' | 'showWidgets'>) {
  // If an activePatientId is provided, use that patient's data instead of the defaults
  const resolved = activePatientId ? PATIENT_REGISTRY[activePatientId] : null;
  if (resolved) {
    patientName = resolved.demographics.displayName;
    dateOfBirth = resolved.demographics.dateOfBirth;
    patientId = resolved.demographics.patientId;
    sex = resolved.demographics.sex;
    allergyStatus = resolved.demographics.allergies;
  }
  return (
    <div className={`border border-border bg-background-soft rounded-lg p-4 flex items-center gap-4 ${className}`}>
      {/* Patient Icon */}
      <div className="w-10 h-10 flex items-center justify-center bg-primary-contrast border border-border rounded flex-shrink-0">
        <PatientIcon size={24} className="text-primary-main" />
      </div>

      {/* Patient Information */}
      <div className="flex-1 min-w-0">
        {/* Patient Name */}
        <div className="text-base font-semibold text-text-primary mb-1">
          {patientName}
        </div>

        {/* Demographics - Single line with separators */}
        <div className="text-sm text-text-secondary flex items-center gap-2 flex-wrap">
          <span>Born: {dateOfBirth}</span>
          <span className="opacity-50">•</span>
          <span>Patient identifier: {patientId}</span>
          <span className="opacity-50">•</span>
          <span>Sex: {sex}</span>
        </div>
      </div>

      {/* Allergy Chip */}
      <AllergyChip status={getAllergyStatus(allergyStatus ?? '')} />

      {/* More Actions Button */}
      <button
        className="w-10 h-10 flex items-center justify-center text-primary-main hover:text-text-primary transition-colors flex-shrink-0 cursor-pointer"
        aria-label="More actions"
      >
        <MoreVerticalIcon size={20} />
      </button>
    </div>
  );
}

// Skeleton shimmer line
function SkeletonLine({ width = 'full' }: { width?: string }) {
  return (
    <motion.div
      className={`h-3 w-${width} bg-primary-light rounded`}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function WidgetContent({ title, patientId }: { title: string; patientId: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Prevent duplicate fetches in React Strict Mode
  const fetched = useRef(false);

  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const complexity = calcComplexity(patient).level;
  const risk = calcRisk(patient).level;

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch('/api/summarize-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgetTitle: title, patientId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [title]);

  if (loading) {
    return (
      <div className="space-y-3">
        {title === 'Summary' && (
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-28 bg-primary-light rounded-full opacity-40" />
            <div className="h-6 w-20 bg-primary-light rounded-full opacity-40" />
          </div>
        )}
        <SkeletonLine width="3/4" />
        <SkeletonLine width="full" />
        <SkeletonLine width="2/3" />
        <SkeletonLine width="5/6" />
        <SkeletonLine width="1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-text-tertiary italic">
        Unable to load summary. Check your API key.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {title === 'Summary' ? (
        <SummaryContent
          text={summary!}
          complexity={complexity}
          risk={risk}
        />
      ) : (
        <BulletOrParagraph text={summary!} />
      )}
    </motion.div>
  );
}

// Renders **bold** markdown inline within a text string
function RichText({ text, className = '', boldColor }: { text: string; className?: string; boldColor?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold" style={boldColor ? { color: boldColor } : undefined}>{part}</strong>
          : part
      )}
    </span>
  );
}

// Parses sectioned summary text: **Heading** lines introduce bullet groups
function parseSummarySections(text: string): Array<{ heading: string | null; bullets: string[] }> {
  const sections: Array<{ heading: string | null; bullets: string[] }> = [];
  let current: { heading: string | null; bullets: string[] } = { heading: null, bullets: [] };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const headingMatch = line.match(/^\*\*(.+?)\*\*$/);
    if (headingMatch) {
      if (current.bullets.length > 0 || current.heading !== null) {
        sections.push(current);
      }
      current = { heading: headingMatch[1], bullets: [] };
    } else if (line.startsWith('•')) {
      current.bullets.push(line.slice(1).trim());
    } else {
      current.bullets.push(line);
    }
  }
  if (current.bullets.length > 0 || current.heading !== null) {
    sections.push(current);
  }
  return sections;
}

// Summary widget: Complexity/Risk chips, then sectioned bullet content
function SummaryContent({ text, complexity, risk }: { text: string; complexity?: RiskLevel; risk?: RiskLevel }) {
  const sections = parseSummarySections(text);

  return (
    <div className="space-y-3">
      {/* Complexity / Risk chips */}
      {(complexity || risk) && (
        <div className="flex items-center gap-3 flex-wrap">
          {complexity && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">Complexity</span>
              <span className="text-sm text-text-secondary">:</span>
              <RiskStatusChip level={complexity} />
            </div>
          )}
          {risk && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-text-primary">Risk</span>
              <span className="text-sm text-text-secondary">:</span>
              <RiskStatusChip level={risk} />
            </div>
          )}
        </div>
      )}

      {/* Sectioned content */}
      {sections.map((section, si) => (
        <div key={si} className="space-y-1.5">
          {section.heading && (
            <p className="text-sm font-semibold text-text-primary">{section.heading}</p>
          )}
          {section.bullets.length > 0 && (
            <ul className="space-y-1">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-2 w-1 h-1 rounded-full bg-text-secondary flex-shrink-0" />
                  <RichText text={b} className="text-sm text-text-primary leading-relaxed" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// Other widgets: bullet list or plain paragraph
function BulletOrParagraph({ text }: { text: string }) {
  const hasBullets = text.startsWith('•') || text.includes('\n•');
  if (hasBullets) {
    return (
      <ul className="space-y-1.5">
        {text.split('\n').filter(Boolean).map((line, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-text-secondary flex-shrink-0" />
            <RichText
              text={line.startsWith('•') ? line.slice(1).trim() : line}
              className="text-sm text-text-primary leading-relaxed"
            />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-sm text-text-primary leading-relaxed">
      <RichText text={text} />
    </p>
  );
}

// Maps encounter type strings to a display label
function encounterLabel(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes('telephone') || lower.includes('phone')) return 'Telephone call';
  if (lower.includes('a&e') || lower.includes('emergency') || lower.includes('admission')) return 'Emergency admission';
  if (lower.includes('review') || lower.includes('annual') || lower.includes('diabetes') || lower.includes('falls') || lower.includes('copd')) return 'Consultation';
  if (lower.includes('registration')) return 'Consultation';
  if (lower.includes('acute')) return 'Acute appointment';
  return 'Consultation';
}

function EncounterTile({ enc }: { enc: NonNullable<Patient['encounters'][number]> }) {
  const [expanded, setExpanded] = useState(false);
  const { bg: avatarBg, text: avatarText } = (() => {
    const AVATAR_TOKENS = [
      { bg: 'var(--accent-main)',   text: 'var(--accent-contrast)'  },
      { bg: 'var(--accent1-main)',  text: 'var(--accent1-contrast)' },
      { bg: 'var(--accent2-main)',  text: 'var(--accent2-contrast)' },
      { bg: 'var(--accent3-main)',  text: 'var(--accent3-contrast)' },
      { bg: 'var(--success-main)',  text: 'var(--success-contrast)' },
    ];
    let hash = 0;
    for (let i = 0; i < enc.clinician.length; i++) hash = enc.clinician.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_TOKENS[Math.abs(hash) % AVATAR_TOKENS.length];
  })();
  const initials = enc.clinician.replace(/^Dr\s+/i, '').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-text-primary">{encounterLabel(enc.type)}</span>
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
          <span className="mr-1">Date</span>{enc.date}
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: avatarBg, color: avatarText }}
        >
          {initials}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Notes */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-text-primary leading-relaxed">{enc.summaryNotes}</p>
          </div>

          {/* Observations */}
          {enc.observations && Object.keys(enc.observations).length > 0 && (
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Observations</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {Object.entries(enc.observations).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs text-text-secondary">{key}</span>
                    <span className="text-sm font-medium text-text-primary">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnosis */}
          {enc.diagnosis && enc.diagnosis.length > 0 && (
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Diagnosis</p>
              <ul className="space-y-1">
                {enc.diagnosis.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="mt-2 w-1 h-1 rounded-full bg-text-secondary flex-shrink-0" />
                    <span className="text-sm text-text-primary">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EncountersContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const encounters = [...patient.encounters].reverse();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {encounters.map((enc, i) => (
        <EncounterTile key={i} enc={enc} />
      ))}
    </motion.div>
  );
}

function LifestyleContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const metrics = patient.lifestyleMetrics ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '8px' }}
    >
      {metrics.map((m, i) => (
        <LifestyleMetricTile
          key={i}
          label={m.label}
          value={m.value}
          unit={m.unit}
          date={m.date}
          trend={m.trend}
        />
      ))}
    </motion.div>
  );
}

function TestsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;

  const groups: { date: string; context: string; items: typeof patient.investigations }[] = [];
  const seen = new Map<string, number>();
  for (const inv of patient.investigations) {
    const key = inv.requestGroup ?? inv.date ?? 'Unknown';
    if (!seen.has(key)) {
      seen.set(key, groups.length);
      groups.push({ date: key, context: inv.requestContext ?? key, items: [] });
    }
    groups[seen.get(key)!].items.push(inv);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {groups.map((g, i) => (
        <TestGroupTile key={i} date={g.date} context={g.context} items={g.items} />
      ))}
    </motion.div>
  );
}

function ActivityContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const events = patient.recentActivityFeed ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ActivityTimeline events={events} />
    </motion.div>
  );
}

function MedicationTile({ med }: { med: Patient['currentMedications'][number] }) {
  const [expanded, setExpanded] = useState(false);
  const { bg: avatarBg, text: avatarText } = (() => {
    const AVATAR_TOKENS = [
      { bg: 'var(--accent-main)',   text: 'var(--accent-contrast)'  },
      { bg: 'var(--accent1-main)',  text: 'var(--accent1-contrast)' },
      { bg: 'var(--accent2-main)',  text: 'var(--accent2-contrast)' },
      { bg: 'var(--accent3-main)',  text: 'var(--accent3-contrast)' },
      { bg: 'var(--success-main)',  text: 'var(--success-contrast)' },
    ];
    let hash = 0;
    for (let i = 0; i < med.prescriber.length; i++) hash = med.prescriber.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_TOKENS[Math.abs(hash) % AVATAR_TOKENS.length];
  })();
  const initials = med.prescriber.replace(/^Dr\s+/i, '').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const chipColors: Record<string, { bg: string; text: string }> = {
    Repeat: { bg: 'var(--primary-main)', text: 'var(--primary-contrast)' },
    Acute:  { bg: 'var(--accent-main)',  text: 'var(--accent-contrast)'  },
  };
  const chip = med.prescriptionType ? (chipColors[med.prescriptionType] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' }) : null;

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{med.name}</span>
        <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
          <span className="mr-1">Prescribed</span>{med.prescribedDate}
        </span>
        {chip && med.prescriptionType && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: chip.bg, color: chip.text }}
          >
            {med.prescriptionType}
          </span>
        )}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: avatarBg, color: avatarText }}
        >
          {initials}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Dosage & frequency */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Dosage & frequency</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Dose</span>
                <span className="text-sm font-medium text-text-primary">{med.dose}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Frequency</span>
                <span className="text-sm font-medium text-text-primary">{med.frequency}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Prescriber</span>
                <span className="text-sm font-medium text-text-primary">{med.prescriber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-text-secondary">Prescribed</span>
                <span className="text-sm font-medium text-text-primary">{med.prescribedDate}</span>
              </div>
              {med.prescriptionType && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Type</span>
                  <span className="text-sm font-medium text-text-primary">{med.prescriptionType}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MedicationsContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {patient.currentMedications.map((med, i) => (
        <MedicationTile key={i} med={med} />
      ))}
    </motion.div>
  );
}

function AllergyTile({ a }: { a: Patient['allergies'][number] }) {
  const [expanded, setExpanded] = useState(false);

  const chipColors: Record<string, { bg: string; text: string }> = {
    Drug:  { bg: 'var(--primary-main)', text: 'var(--primary-contrast)' },
    Food:  { bg: 'var(--accent-main)',  text: 'var(--accent-contrast)'  },
    Other: { bg: 'var(--accent3-main)', text: 'var(--accent3-contrast)' },
  };
  const chip = a.type ? (chipColors[a.type] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' }) : null;

  const severityColors: Record<string, { bg: string; text: string }> = {
    Mild:     { bg: 'var(--success-main)',  text: 'var(--success-contrast)'  },
    Moderate: { bg: 'var(--accent-main)',   text: 'var(--accent-contrast)'   },
    Severe:   { bg: 'var(--error-main)',    text: 'var(--error-contrast)'    },
  };
  const severityChip = a.severity ? (severityColors[a.severity] ?? { bg: 'var(--accent2-main)', text: 'var(--accent2-contrast)' }) : null;

  return (
    <div className="bg-primary-contrast border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-3 min-h-[52px] hover:bg-hover transition-colors text-left"
      >
        <span
          className="text-primary-main flex-shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRightIcon size={16} />
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-text-primary truncate">{a.substance}</span>
        {a.recordedDate && (
          <span className="text-xs text-text-primary flex-shrink-0 whitespace-nowrap">
            <span className="mr-1">Recorded</span>{a.recordedDate}
          </span>
        )}
        {chip && a.type && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: chip.bg, color: chip.text }}
          >
            {a.type}
          </span>
        )}
        {severityChip && a.severity && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: severityChip.bg, color: severityChip.text }}
          >
            {a.severity}
          </span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Reaction</p>
            <p className="text-sm text-text-primary">{a.reaction}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Details</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {a.severity && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Severity</span>
                  <span className="text-sm font-medium text-text-primary">{a.severity}</span>
                </div>
              )}
              {a.status && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Status</span>
                  <span className="text-sm font-medium text-text-primary">{a.status}</span>
                </div>
              )}
              {a.recordedDate && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Recorded</span>
                  <span className="text-sm font-medium text-text-primary">{a.recordedDate}</span>
                </div>
              )}
              {a.recordedBy && (
                <div className="flex flex-col">
                  <span className="text-xs text-text-secondary">Recorded by</span>
                  <span className="text-sm font-medium text-text-primary">{a.recordedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AllergiesContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const allergies = patient.allergies;

  if (allergies.length === 0) {
    return <p className="text-sm text-text-secondary italic">No known drug allergies</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {allergies.map((a, i) => (
        <AllergyTile key={i} a={a} />
      ))}
    </div>
  );
}

function SummaryWidgetContent({ patientId }: { patientId: string }) {
  function SectionHeading({ title }: { title: string }) {
    return (
      <div className="mt-8 mb-3">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <div className="border-t border-border mt-2" />
      </div>
    );
  }

  return (
    <div>
      <WidgetContent title="Summary" patientId={patientId} />

      <SectionHeading title="Allergies" />
      <AllergiesContent patientId={patientId} />

      <SectionHeading title="Lifestyle & examinations" />
      <LifestyleContent patientId={patientId} />
    </div>
  );
}

function TrackerIconButton({ icon: Icon, label, count }: { icon: React.FC<{ size?: number; className?: string }>; label: string; count: number }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setVisible(true);
  };

  const tooltip = visible && mounted ? createPortal(
    <div className="pointer-events-none fixed z-[9999]" style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -100%)' }}>
      <div className="bg-primary-dark text-primary-contrast text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
        {label}
        <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--primary-dark)' }} />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
        className="relative w-10 h-10 rounded-full border border-border bg-primary-contrast flex items-center justify-center hover:bg-hover transition-colors flex-shrink-0"
        aria-label={label}
      >
        <Icon size={18} className="text-text-secondary" />
        <span
          className="absolute -bottom-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold rounded-full leading-none px-1"
          style={{ backgroundColor: count > 0 ? 'var(--accent-dark)' : 'var(--grey-80)', color: 'var(--primary-contrast)' }}
        >
          {count}
        </span>
      </button>
      {tooltip}
    </>
  );
}

function PatientTracker({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const tracker = patient.patientTracker;
  if (!tracker) return null;

  return (
    <div className="inline-flex items-center gap-2 mb-4 self-start">
      {/* Icon buttons with badge counts */}
      <TrackerIconButton icon={TaskListIcon} label="Outstanding tasks" count={tracker.outstandingTasks} />
      <TrackerIconButton icon={ReferralIcon} label="Open referrals" count={tracker.openReferrals} />
      <TrackerIconButton icon={PillIcon} label="Medication reviews due" count={tracker.medicationReviewsDue} />

      {/* Divider */}
      <div className="w-px h-8 bg-border mx-1 flex-shrink-0" />

      {/* Appointment pills */}
      {[
        { label: 'Last appointment', value: tracker.lastAppointment },
        { label: 'Next appointment', value: tracker.nextAppointment },
      ].map(({ label, value }) => (
        <div key={label} className="h-10 flex items-center gap-2 border border-border rounded-full bg-primary-contrast px-3 flex-shrink-0">
          <CalendarIcon size={18} className="text-text-secondary flex-shrink-0" />
          <span className="text-xs text-text-secondary whitespace-nowrap">{label}:</span>
          <span className="text-xs font-semibold text-text-primary whitespace-nowrap">{value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}

export function PatientSummaryCard({
  onWidgetClick,
  showWidgets = true,
  className = '',
  activePatientId,
}: PatientSummaryCardProps) {
  const resolvedPatientId = activePatientId ?? ACTIVE_PATIENT.id;

  if (!showWidgets) {
    return null;
  }

  function WidgetShell({ widget, index, stretch, children }: { widget: { id: string; title: string }; index: number; stretch?: boolean; children: React.ReactNode }) {
    return (
      <motion.div
        key={widget.id}
        className={`border border-border bg-primary-contrast rounded-lg overflow-hidden flex flex-col${stretch ? ' flex-1' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary flex-1">{widget.title}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onWidgetClick?.(widget.title)}
              className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
              aria-label={`Open ${widget.title}`}
            >
              <ArrowRightIcon size={20} className="text-primary-main" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-hover transition-colors rounded cursor-pointer"
              aria-label={`${widget.title} options`}
            >
              <MoreVerticalIcon size={20} className="text-primary-main" />
            </button>
          </div>
        </div>
        <div className="border-t border-border" />
        <div className="p-4">{children}</div>
      </motion.div>
    );
  }

  return (
    <div className={`flex gap-6 items-stretch ${className}`}>
      {/* Left column — Summary (50%) */}
      <div className="flex-1 min-w-0 flex flex-col pb-10">
        <PatientTracker patientId={resolvedPatientId} />
        <WidgetShell widget={SUMMARY_WIDGET} index={0} stretch>
          <SummaryWidgetContent patientId={resolvedPatientId} />
        </WidgetShell>
      </div>

      {/* Right column — stacked widgets (50%) */}
      <div className="flex-1 min-w-0 flex flex-col gap-6 pb-10">
        {STACK_WIDGETS.map((widget, index) => (
          <WidgetShell key={widget.id} widget={widget} index={index + 1}>
            {widget.title === 'Recent encounters' ? (
              <EncountersContent patientId={resolvedPatientId} />
            ) : widget.title === 'Current medications' ? (
              <MedicationsContent patientId={resolvedPatientId} />
            ) : widget.title === 'Recent tests' ? (
              <TestsContent patientId={resolvedPatientId} />
            ) : null}
          </WidgetShell>
        ))}
      </div>
    </div>
  );
}
