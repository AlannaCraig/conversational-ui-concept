// Synthetic longitudinal patient dataset — for prototype use only.
// All records are fictional and must never be interpreted as real patient information.

export interface Patient {
  id: string;
  demographics: {
    name: string;
    displayName: string; // Format: SURNAME, Forename(s) (Title)
    age: number;
    sex: string;
    dateOfBirth: string;
    height: string;
    weight: string;
    bmi: string;
    occupation?: string;
    maritalStatus?: string;
    smokingStatus: string;
    smokingHistory?: string;
    alcohol: string;
    exercise?: string;
    livingSituation?: string;
    mobility?: string;
    nhsRegion?: string;
    patientId: string;
    allergies: string;
  };
  lifestyleAndRiskFactors: Record<string, string>;
  problemsDiagnoses: Array<{ condition: string; status: string; diagnosed: string }>;
  allergies: Array<{ substance: string; reaction: string }>;
  currentMedications: Array<{ name: string; dose: string; frequency: string }>;
  encounters: Array<{
    date: string;
    time: string;
    clinician: string;
    type: string;
    observations?: Record<string, string | number>;
    presentingComplaint?: string;
    summaryNotes: string;
    outcome: string[];
    treatmentPlan: string[];
  }>;
  observations: {
    bloodPressure?: Array<{ date: string; value: string }>;
    weight?: Array<{ date: string; value: string }>;
  };
  investigations: Array<{ test: string; result: string; flag?: string; date?: string; category?: string }>;
  carePlans?: Array<{ area: string; plan: string }>;
  aiSummary: {
    keyThemes: string[];
    recentActivity: string;
    longitudinalSummary: string;
  };
}

// ─── PT-10001: Daniel Harper — Low Complexity ────────────────────────────────

export const PATIENT_HARPER: Patient = {
  id: 'PT-10001',
  demographics: {
    name: 'Daniel Harper',
    displayName: 'HARPER, Daniel (Mr)',
    age: 29,
    sex: 'Male',
    dateOfBirth: '14 Feb 1997',
    height: '181 cm',
    weight: '82 kg',
    bmi: '25.0',
    occupation: 'Graphic Designer',
    maritalStatus: 'Single',
    smokingStatus: 'Never smoker',
    alcohol: 'Social',
    exercise: 'Gym 2× weekly',
    nhsRegion: 'Greater London',
    patientId: 'PT-10001',
    allergies: 'Penicillin — Rash',
  },
  lifestyleAndRiskFactors: {
    Diet: 'Moderate processed food intake',
    Sleep: 'Reports inconsistent sleep during deadlines',
    'Mental Health': 'Mild anxiety during work stress',
    Activity: 'Sedentary work but active evenings',
  },
  problemsDiagnoses: [
    { condition: 'Mild Generalised Anxiety', status: 'Active', diagnosed: '2024' },
    { condition: 'Seasonal Allergic Rhinitis', status: 'Active', diagnosed: 'Childhood' },
  ],
  allergies: [{ substance: 'Penicillin', reaction: 'Rash' }],
  currentMedications: [
    { name: 'Cetirizine', dose: '10 mg', frequency: 'PRN' },
    { name: 'Propranolol', dose: '10 mg', frequency: 'PRN for anxiety episodes' },
  ],
  encounters: [
    {
      date: '10 Jan 2025',
      time: '09:20',
      clinician: 'Dr Amelia Foster',
      type: 'GP Registration Appointment',
      observations: { BP: '124/78', Pulse: 72, Weight: '81 kg' },
      summaryNotes:
        'Patient attended for initial NHS registration and routine health review. Reports intermittent anxiety symptoms associated with workplace deadlines and high-pressure projects. No panic attacks, self-harm thoughts, or functional impairment reported. Sleep noted to be inconsistent during periods of occupational stress. General examination unremarkable. Baseline cardiovascular observations within normal limits.',
      outcome: [
        'Diagnosed with mild situational anxiety',
        'Baseline blood tests requested',
        'Advised on sleep hygiene and stress management strategies',
      ],
      treatmentPlan: [
        'Monitor symptoms conservatively',
        'Encourage regular exercise and sleep routine',
        'Review if symptoms worsen or become more frequent',
      ],
    },
    {
      date: '18 Mar 2025',
      time: '16:40',
      clinician: 'Dr Samuel Reeves',
      type: 'GP Review Appointment',
      observations: { BP: '126/80', Pulse: 76 },
      summaryNotes:
        'Patient requested follow-up review due to increasing work-related stress over previous two months. Reports racing thoughts, intermittent palpitations during presentations, and difficulty switching off after work. Symptoms occurring several times weekly but continues functioning well occupationally and socially. No depressive symptoms identified. No substance misuse concerns.',
      outcome: [
        'Anxiety symptoms remain mild-to-moderate',
        'No escalation to secondary mental health services required',
        'Trial of propranolol initiated for situational symptoms',
      ],
      treatmentPlan: [
        'Prescribed propranolol 10 mg PRN',
        'Continue lifestyle modification',
        'Reduce caffeine intake',
        'Follow-up if symptoms increase in severity or frequency',
      ],
    },
    {
      date: '22 May 2025',
      time: '11:10',
      clinician: 'Dr Priya Nair',
      type: 'GP Acute Appointment',
      summaryNotes:
        'Patient presented with worsening seasonal allergy symptoms including sneezing, nasal congestion, itchy eyes, and disturbed sleep over previous three weeks. Symptoms worse outdoors and during morning commute. No wheeze, chest tightness, or infective symptoms. Examination consistent with allergic rhinitis with no evidence of respiratory involvement.',
      outcome: [
        'Seasonal allergic rhinitis flare confirmed',
        'Symptoms managed conservatively',
      ],
      treatmentPlan: [
        'Cetirizine 10 mg PRN prescribed',
        'Advised allergen avoidance where practical',
        'Recommended saline nasal rinse and hydration',
        'Return if respiratory symptoms develop',
      ],
    },
  ],
  observations: {},
  investigations: [
    { test: 'HbA1c', result: '5.2%', flag: 'Normal', date: 'Jan 2025', category: 'Blood' },
    { test: 'Cholesterol', result: '4.4 mmol/L', flag: 'Normal', date: 'Jan 2025', category: 'Blood' },
    { test: 'eGFR', result: 'Normal', flag: 'Normal', date: 'Jan 2025', category: 'Blood' },
    { test: 'FBC', result: 'Normal', flag: 'Normal', date: 'Jan 2025', category: 'Blood' },
  ],
  aiSummary: {
    keyThemes: [
      'Mild generalised anxiety — occupational trigger',
      'Seasonal allergic rhinitis',
      'Low chronic disease burden',
      'All baseline investigations within normal limits',
    ],
    recentActivity:
      'Over the past year the patient has attended routine GP reviews primarily relating to episodic anxiety symptoms and seasonal allergy management. Recent encounters describe stress-related racing thoughts associated with occupational pressures, with initiation of low-dose propranolol alongside lifestyle advice. Baseline blood investigations and cardiovascular risk markers remain within normal limits.',
    longitudinalSummary:
      'The patient demonstrates low healthcare utilisation with minimal chronic disease burden. Current care remains focused on symptom management, preventative wellbeing measures, sleep consistency, and maintaining physical activity.',
  },
};

// ─── PT-10002: Margaret Ellison — High Complexity ────────────────────────────

export const PATIENT_ELLISON: Patient = {
  id: 'PT-10002',
  demographics: {
    name: 'Margaret Ellison',
    displayName: 'ELLISON, Margaret (Ms)',
    age: 74,
    sex: 'Female',
    dateOfBirth: '03 Sep 1951',
    height: '159 cm',
    weight: '71 kg',
    bmi: '28.1',
    smokingStatus: 'Ex-smoker',
    smokingHistory: '40 pack-year history',
    alcohol: 'Rare',
    livingSituation: 'Lives alone',
    mobility: 'Uses walking stick',
    patientId: 'PT-10002',
    allergies: 'No known drug allergies',
  },
  lifestyleAndRiskFactors: {
    'Falls Risk': 'Moderate',
    Diet: 'Poor appetite during COPD flare-ups',
    'Social Isolation': 'Reports loneliness',
    'Cognitive Screening': 'Mild short-term memory concerns',
    'Exercise Tolerance': 'Breathless after short distances',
  },
  problemsDiagnoses: [
    { condition: 'COPD', status: 'Active', diagnosed: '2016' },
    { condition: 'Hypertension', status: 'Active', diagnosed: '2012' },
    { condition: 'Type 2 Diabetes', status: 'Active', diagnosed: '2018' },
    { condition: 'Osteoarthritis', status: 'Active', diagnosed: '2014' },
    { condition: 'Chronic Kidney Disease Stage 2', status: 'Active', diagnosed: '2022' },
  ],
  allergies: [],
  currentMedications: [
    { name: 'Salbutamol Inhaler', dose: '100 mcg', frequency: 'PRN' },
    { name: 'Tiotropium', dose: '18 mcg', frequency: 'Daily' },
    { name: 'Ramipril', dose: '5 mg', frequency: 'Daily' },
    { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily' },
    { name: 'Atorvastatin', dose: '20 mg', frequency: 'Nightly' },
    { name: 'Paracetamol', dose: '1 g', frequency: 'PRN' },
  ],
  encounters: [
    {
      date: '11 Feb 2025',
      time: '10:00',
      clinician: 'Dr Helen Murray',
      type: 'GP Annual COPD Review',
      observations: { BP: '142/86', SpO2: '93%', Weight: '73 kg' },
      summaryNotes:
        'Patient attended annual COPD review reporting worsening breathlessness on exertion over previous six months. Increasing difficulty walking longer distances and climbing stairs. Intermittent productive cough without haemoptysis. Appetite reduced during recent flare periods. Respiratory examination demonstrated reduced air entry bilaterally with scattered expiratory wheeze. Spirometry consistent with moderate obstructive disease progression.',
      outcome: [
        'COPD symptoms progressing gradually',
        'Functional exercise tolerance reduced',
        'Pulmonary rehabilitation referral initiated',
      ],
      treatmentPlan: [
        'Continue tiotropium and salbutamol inhalers',
        'Pulmonary rehabilitation referral',
        'Safety-net advice regarding exacerbation symptoms',
      ],
    },
    {
      date: '26 Apr 2025',
      time: '02:15',
      clinician: 'Dr Marcus Allen',
      type: 'A&E Admission',
      observations: { Presentation: 'Acute COPD exacerbation', CXR: 'No pneumonia', 'Length of Stay': '3 days' },
      summaryNotes:
        'Patient admitted via emergency department following worsening shortness of breath, productive cough, and wheeze over five days. Oxygen saturations reduced on presentation with increased work of breathing. Chest X-ray excluded focal pneumonia. Treated with nebulised bronchodilators, oral steroids, and antibiotics with gradual symptomatic improvement over admission.',
      outcome: [
        'Acute COPD exacerbation managed successfully',
        'No invasive respiratory support required',
        'Discharged following clinical stabilisation',
      ],
      treatmentPlan: [
        'Complete oral steroid course',
        'Community respiratory follow-up arranged',
        'Continue inhaler regimen',
        'Return precautions discussed thoroughly',
      ],
    },
    {
      date: '14 Jun 2025',
      time: '14:30',
      clinician: 'Dr Helen Murray',
      type: 'GP Diabetes Review',
      observations: { HbA1c: '7.4%' },
      summaryNotes:
        'Routine diabetic monitoring appointment. Patient reports variable appetite and reduced activity levels since recent respiratory admission. Mild numbness affecting left foot reported intermittently over previous months. Foot examination demonstrated mildly reduced sensation over plantar surface of left forefoot. No ulceration or skin breakdown identified.',
      outcome: [
        'Diabetes control moderately suboptimal',
        'Early peripheral neuropathic changes suspected',
        'No acute diabetic complications identified',
      ],
      treatmentPlan: [
        'Continue metformin therapy',
        'Dietary review referral arranged',
        'Reinforce diabetic foot care education',
        'Repeat HbA1c monitoring in 3–4 months',
      ],
    },
    {
      date: '01 Sep 2025',
      time: '15:20',
      clinician: 'Dr Rebecca Collins',
      type: 'GP Falls Assessment',
      summaryNotes:
        'Patient reviewed following fall at home while mobilising between kitchen and hallway. Sustained minor bruising to left wrist without fracture symptoms. Reports increasing unsteadiness and reduced confidence mobilising outdoors over previous several months. Mobility assessment demonstrated poor balance and lower limb deconditioning. No syncope or acute neurological symptoms reported.',
      outcome: [
        'Mechanical fall likely related to frailty and deconditioning',
        'Increased falls risk identified',
        'Community support escalation recommended',
      ],
      treatmentPlan: [
        'Physiotherapy referral arranged',
        'Home safety assessment requested',
        'Encourage supervised mobility exercises',
        'Falls prevention advice discussed',
      ],
    },
  ],
  observations: {
    bloodPressure: [
      { date: 'Jan 2025', value: '146/88' },
      { date: 'Feb 2025', value: '142/86' },
      { date: 'Jun 2025', value: '138/82' },
      { date: 'Sep 2025', value: '150/90' },
    ],
    weight: [
      { date: 'Jan 2025', value: '74 kg' },
      { date: 'Apr 2025', value: '71 kg' },
      { date: 'Sep 2025', value: '70 kg' },
    ],
  },
  investigations: [
    { test: 'HbA1c', result: '7.4%', flag: 'Borderline high', category: 'Blood' },
    { test: 'eGFR', result: '68 mL/min/1.73m²', flag: 'Normal', category: 'Blood' },
    { test: 'CRP', result: 'Mildly elevated', flag: 'Abnormal', category: 'Blood' },
    { test: 'Total cholesterol', result: '5.1 mmol/L', flag: 'Borderline high', category: 'Blood' },
    { test: 'Chest X-ray', result: 'Hyperinflation consistent with COPD', flag: 'Abnormal', category: 'Imaging' },
    { test: 'ECG', result: 'Sinus rhythm', flag: 'Normal', category: 'Imaging' },
  ],
  carePlans: [
    { area: 'Respiratory', plan: 'Pulmonary rehabilitation referral' },
    { area: 'Falls Prevention', plan: 'Home safety assessment' },
    { area: 'Diabetes', plan: 'Dietary intervention and repeat HbA1c' },
    { area: 'Social', plan: 'Community wellbeing referral' },
  ],
  aiSummary: {
    keyThemes: [
      'COPD, hypertension, type 2 diabetes, osteoarthritis, and CKD Stage 2',
      'Progressive respiratory decline with recent hospital admission',
      'Increasing falls risk and lower limb deconditioning',
      'Moderate frailty indicators with rising healthcare dependency',
    ],
    recentActivity:
      'Over the past year the patient has required four clinical contacts relating to respiratory symptoms, diabetes monitoring, and functional decline. A COPD exacerbation resulted in a three-day hospital admission requiring nebuliser therapy, steroids, and antibiotics. Follow-up assessments demonstrate persistent breathlessness, suboptimal glycaemic control with early peripheral sensory changes, and a mechanical fall at home indicating progressive deconditioning.',
    longitudinalSummary:
      'The clinical record reflects progressive multi-morbidity with increasing frailty indicators and rising healthcare dependency. Respiratory disease remains the dominant driver of clinical risk, with ongoing focus on exacerbation prevention, falls reduction, rehabilitation support, and optimisation of long-term condition management.',
  },
};

// Default patient used in the summary view (high complexity)
export const ACTIVE_PATIENT = PATIENT_ELLISON;

// ─── Mock widget summaries (used when no API key is configured) ───────────────

export const MOCK_SUMMARIES: Record<string, string> = {
  Summary:
    '• History of **COPD**, **hypertension**, **type 2 diabetes**, **osteoarthritis**, and **CKD Stage 2**\n• Progressive functional decline — increasing falls risk and reduced exercise tolerance\n• Recent unplanned hospital admission; moderate frailty indicators\n\nOver the past year Ms Ellison has required four clinical contacts across respiratory, metabolic, and falls-related concerns. A **3-day hospital admission in April 2025** for acute COPD exacerbation was treated with nebulisers, steroids, and antibiotics. Subsequent reviews identified **suboptimal glycaemic control** (HbA1c 7.4%) with early peripheral neuropathic changes, and a **mechanical fall at home** in September 2025 attributed to progressive deconditioning.\n\nOverall, the clinical record reflects **high-complexity multi-morbidity** with rising healthcare dependency. Respiratory disease remains the dominant risk driver, with ongoing priorities across **exacerbation prevention**, **falls reduction**, and **long-term condition optimisation**.',

  'Recent encounters':
    '• Feb 2025 — Annual COPD review: worsening exertional breathlessness, pulmonary rehabilitation referral initiated\n• Apr 2025 — Emergency A&E admission: acute COPD exacerbation treated with nebulisers, steroids, and antibiotics; 3-day stay\n• Jun 2025 — Diabetes review: HbA1c 7.4%, early peripheral neuropathy suspected in left foot, dietary referral arranged\n• Sep 2025 — Falls assessment: mechanical fall at home, physiotherapy and home safety assessment referrals made',

  'Recent activity':
    'Ms Ellison has had four clinical contacts in 2025, driven primarily by COPD-related deterioration and multimorbidity monitoring. The pattern reflects escalating healthcare utilisation, including an unplanned hospital admission. Contact frequency and the breadth of services involved indicate a patient transitioning towards higher-dependency community care.',

  'Lifestyle & examinations':
    'Ms Ellison is an ex-smoker with a 40 pack-year history and drinks alcohol rarely. She reports social isolation, poor appetite during flare-ups, and significant reduction in mobility due to dyspnoea — she is breathless after short distances and uses a walking stick. Mild short-term memory concerns have been noted on cognitive screening. Recent examination findings include persistent hypertension (150/90 on last visit), oxygen saturations of 93% at rest, and mildly reduced plantar sensation in the left forefoot.',

  'Recent tests':
    '• HbA1c (Jun 2025) — 7.4%; moderately suboptimal, dietary intervention arranged\n• Chest X-ray (Apr 2025) — Hyperinflation consistent with COPD; no pneumonia\n• CRP — Mildly elevated; consistent with recent exacerbation\n• Total cholesterol — 5.1 mmol/L; borderline elevated, currently on atorvastatin\n• eGFR — 68 mL/min/1.73m²; CKD Stage 2, within safe range for current medications',

  Medications:
    'Ms Ellison is prescribed six regular medications across four therapeutic categories: respiratory (salbutamol PRN, tiotropium daily), cardiovascular (ramipril, atorvastatin), metabolic (metformin), and analgesic (paracetamol PRN). The combination of ramipril and metformin in the context of CKD Stage 2 requires routine renal function monitoring. No new medications were added at the most recent encounter; medication burden is moderate but appropriate to her condition complexity.',
};
