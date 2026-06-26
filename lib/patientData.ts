// Synthetic longitudinal patient dataset — for prototype use only.
// All records are fictional and must never be interpreted as real patient information.

export type ActivityEventType = 'viewed' | 'work-item' | 'filed' | 'appointment' | 'task';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: { initials: string; color: string };
  datetime: string;
  meta?: { label: string; value: string };
}

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
  problemsDiagnoses: Array<{ condition: string; status: string; diagnosed: string; priority?: 1 | 2 | 3; notes?: string; reviewedBy?: string; reviewedDate?: string }>;
  allergies: Array<{ substance: string; reaction: string; type?: string; recordedDate?: string; severity?: string; status?: string; recordedBy?: string }>;
  currentMedications: Array<{ name: string; dose: string; frequency: string; prescriber: string; prescribedDate: string; prescriptionType?: string }>;
  encounters: Array<{
    date: string;
    time: string;
    clinician: string;
    type: string;
    observations?: Record<string, string | number>;
    presentingComplaint?: string;
    summaryNotes: string;
    diagnosis?: string[];
    outcome: string[];
    treatmentPlan: string[];
  }>;
  observations: {
    bloodPressure?: Array<{ date: string; value: string }>;
    weight?: Array<{ date: string; value: string }>;
  };
  metricHistory?: Record<string, Array<{ date: string; value: string }>>;
  lifestyleMetrics?: Array<{
    label: string;
    value: string;
    unit: string;
    date: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
  investigations: Array<{ test: string; result: string; flag?: string; date?: string; category?: string; requestGroup?: string; requestContext?: string }>;
  carePlans?: Array<{ area: string; plan: string }>;
  recentActivityFeed?: ActivityEvent[];
  aiSummary: {
    keyThemes: string[];
    recentActivity: string;
    longitudinalSummary: string;
  };
  patientTracker?: {
    outstandingTasks: number;
    openReferrals: number;
    medicationReviewsDue: number;
    nextAppointment: string | null;
    lastAppointment: string | null;
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
    allergies: 'No known allergies',
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
  allergies: [],
  currentMedications: [
    { name: 'Cetirizine', dose: '10 mg', frequency: 'PRN', prescriber: 'Dr Priya Nair', prescribedDate: '22 May 2025', prescriptionType: 'Acute' },
    { name: 'Propranolol', dose: '10 mg', frequency: 'PRN for anxiety', prescriber: 'Dr Samuel Reeves', prescribedDate: '18 Mar 2025', prescriptionType: 'Acute' },
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
      diagnosis: ['Mild situational anxiety disorder'],
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
      diagnosis: ['Generalised anxiety disorder — mild to moderate'],
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
      diagnosis: ['Seasonal allergic rhinitis — acute flare'],
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
  lifestyleMetrics: [
    { label: 'Weight', value: '82', unit: 'kg', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'Height', value: '181', unit: 'cm', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'BMI', value: '25.0', unit: 'kg/m²', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'BP', value: '126/80', unit: 'mmHg', date: '18 Mar 2025', trend: 'up' },
    { label: 'Pulse', value: '76', unit: 'bpm', date: '18 Mar 2025', trend: 'neutral' },
    { label: 'Respiratory rate', value: '15', unit: 'brpm', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'Peak flow', value: '580', unit: 'L/min', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'Postural drop', value: 'None', unit: '', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'Smoking status', value: 'Never', unit: '', date: '10 Jan 2025', trend: 'neutral' },
    { label: 'Alcohol', value: 'Social', unit: '', date: '10 Jan 2025', trend: 'neutral' },
  ],
  investigations: [
    { test: 'HbA1c',          result: '5.2%',              flag: 'Normal', date: '10 Jan 2025', category: 'Blood',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
    { test: 'Total cholesterol', result: '4.4 mmol/L',     flag: 'Normal', date: '10 Jan 2025', category: 'Blood',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
    { test: 'eGFR',           result: '88 mL/min/1.73m²',  flag: 'Normal', date: '10 Jan 2025', category: 'Blood',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
    { test: 'FBC',            result: 'Normal',             flag: 'Normal', date: '10 Jan 2025', category: 'Blood',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
    { test: 'LFTs',           result: 'Normal',             flag: 'Normal', date: '10 Jan 2025', category: 'Blood',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
    { test: 'TSH',            result: '2.1 mIU/L',          flag: 'Normal', date: '10 Jan 2025', category: 'Blood',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
    { test: 'Urine dipstick', result: 'No abnormality',     flag: 'Normal', date: '10 Jan 2025', category: 'Urine',  requestGroup: '10 Jan 2025', requestContext: 'GP Registration — Bloods' },
  ],
  recentActivityFeed: [
    { id: 'h1', type: 'viewed',      actor: { initials: 'OP', color: '#5E7F5C' }, datetime: '22 May 2025, 11:10' },
    { id: 'h2', type: 'work-item',   actor: { initials: 'OP', color: '#5E7F5C' }, datetime: '22 May 2025, 11:08' },
    { id: 'h3', type: 'filed',       actor: { initials: 'PN', color: '#B67A3C' }, datetime: '22 May 2025, 11:15', meta: { label: 'Filed to', value: 'Allergic Rhinitis' } },
    { id: 'h4', type: 'appointment', actor: { initials: 'SR', color: '#724E91' }, datetime: '18 Mar 2025, 16:40', meta: { label: 'Appointment', value: 'GP Anxiety Review' } },
    { id: 'h5', type: 'viewed',      actor: { initials: 'AF', color: '#B24E45' }, datetime: '10 Jan 2025, 09:20' },
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
  patientTracker: {
    outstandingTasks: 1,
    openReferrals: 0,
    medicationReviewsDue: 0,
    nextAppointment: '14 Aug 2025',
    lastAppointment: '22 May 2025',
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
    allergies: 'Penicillin — Rash',
  },
  lifestyleAndRiskFactors: {
    'Falls Risk': 'Moderate',
    Diet: 'Poor appetite during COPD flare-ups',
    'Social Isolation': 'Reports loneliness',
    'Cognitive Screening': 'Mild short-term memory concerns',
    'Exercise Tolerance': 'Breathless after short distances',
  },
  problemsDiagnoses: [
    { condition: 'COPD', status: 'Active', diagnosed: '2016', priority: 1, notes: 'Moderate severity (MRC Grade 3). Recent exacerbation requiring hospital admission Feb 2025. On maximum inhaled therapy. Pulmonology review recommended.', reviewedBy: 'Dr Helen Murray', reviewedDate: '11 Feb 2025' },
    { condition: 'Chronic Kidney Disease Stage 2', status: 'Active', diagnosed: '2022', priority: 1, notes: 'eGFR stable at 68 ml/min. Requires 6-monthly renal function monitoring given concurrent ramipril and metformin use. Nephrology involvement not yet required.', reviewedBy: 'Dr Helen Murray', reviewedDate: '11 Feb 2025' },
    { condition: 'Type 2 Diabetes', status: 'Active', diagnosed: '2018', priority: 1, notes: 'HbA1c 58 mmol/mol at last check — borderline controlled. Annual diabetic review overdue. Metformin dose at maximum tolerated. Consider SGLT2 inhibitor given CKD and cardiovascular risk profile.', reviewedBy: 'Dr Helen Murray', reviewedDate: '11 Feb 2025' },
    { condition: 'Hypertension', status: 'Active', diagnosed: '2012', priority: 2, notes: 'BP well controlled on ramipril 10mg. Last reading 132/78 mmHg.' },
    { condition: 'Osteoarthritis', status: 'Active', diagnosed: '2014', priority: 2, notes: 'Primarily affecting knees and hips. Managed with paracetamol PRN. Physio referral considered.' },
  ],
  allergies: [{ substance: 'Penicillin', reaction: 'Rash', type: 'Drug', recordedDate: '14 Feb 2024', severity: 'Mild', status: 'Active', recordedBy: 'Dr Amelia Foster' }],
  currentMedications: [
    { name: 'Salbutamol Inhaler', dose: '100 mcg', frequency: 'PRN', prescriber: 'Dr Helen Murray', prescribedDate: '11 Feb 2025', prescriptionType: 'Repeat' },
    { name: 'Tiotropium', dose: '18 mcg', frequency: 'Daily', prescriber: 'Dr Helen Murray', prescribedDate: '11 Feb 2025', prescriptionType: 'Repeat' },
    { name: 'Ramipril', dose: '5 mg', frequency: 'Daily', prescriber: 'Dr Rebecca Collins', prescribedDate: '01 Sep 2025', prescriptionType: 'Repeat' },
    { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', prescriber: 'Dr Helen Murray', prescribedDate: '14 Jun 2025', prescriptionType: 'Repeat' },
    { name: 'Atorvastatin', dose: '20 mg', frequency: 'Nightly', prescriber: 'Dr Marcus Allen', prescribedDate: '26 Apr 2025', prescriptionType: 'Repeat' },
    { name: 'Paracetamol', dose: '1 g', frequency: 'PRN', prescriber: 'Dr Rebecca Collins', prescribedDate: '01 Sep 2025', prescriptionType: 'Acute' },
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
      diagnosis: ['COPD — moderate, progressive'],
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
      diagnosis: ['Acute exacerbation of COPD'],
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
      diagnosis: ['Type 2 diabetes mellitus — suboptimal control', 'Suspected early diabetic peripheral neuropathy'],
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
      diagnosis: ['Mechanical fall — frailty and lower limb deconditioning', 'Increased falls risk'],
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
  lifestyleMetrics: [
    { label: 'Weight', value: '70', unit: 'kg', date: '01 Sep 2025', trend: 'down' },
    { label: 'Height', value: '159', unit: 'cm', date: '11 Feb 2025', trend: 'neutral' },
    { label: 'BMI', value: '28.1', unit: 'kg/m²', date: '11 Feb 2025', trend: 'down' },
    { label: 'BP', value: '150/90', unit: 'mmHg', date: '01 Sep 2025', trend: 'up' },
    { label: 'Pulse', value: '88', unit: 'bpm', date: '01 Sep 2025', trend: 'up' },
    { label: 'SpO₂', value: '93', unit: '%', date: '11 Feb 2025', trend: 'down' },
    { label: 'Respiratory rate', value: '22', unit: 'brpm', date: '11 Feb 2025', trend: 'up' },
    { label: 'Peak flow', value: '210', unit: 'L/min', date: '11 Feb 2025', trend: 'down' },
    { label: 'Postural drop', value: '18/10', unit: 'mmHg', date: '01 Sep 2025', trend: 'neutral' },
    { label: 'Smoking status', value: 'Ex-smoker', unit: '', date: '11 Feb 2025', trend: 'neutral' },
    { label: 'Alcohol', value: 'Rare', unit: '', date: '11 Feb 2025', trend: 'neutral' },
  ],
  metricHistory: {
    'BP': [
      { date: 'Jan 2026', value: '148/90' },
      { date: 'Feb 2026', value: '152/92' },
      { date: 'Mar 2026', value: '144/88' },
      { date: 'Apr 2026', value: '146/86' },
      { date: 'May 2026', value: '150/90' },
      { date: 'Jun 2026', value: '150/90' },
    ],
    'Weight': [
      { date: 'Jan 2026', value: '70' },
      { date: 'Feb 2026', value: '69' },
      { date: 'Mar 2026', value: '69' },
      { date: 'Apr 2026', value: '68' },
      { date: 'May 2026', value: '68' },
      { date: 'Jun 2026', value: '68' },
    ],
    'BMI': [
      { date: 'Jan 2026', value: '27.7' },
      { date: 'Feb 2026', value: '27.3' },
      { date: 'Mar 2026', value: '27.3' },
      { date: 'Apr 2026', value: '26.9' },
      { date: 'May 2026', value: '26.9' },
      { date: 'Jun 2026', value: '26.9' },
    ],
    'Pulse': [
      { date: 'Jan 2026', value: '90' },
      { date: 'Feb 2026', value: '86' },
      { date: 'Mar 2026', value: '88' },
      { date: 'Apr 2026', value: '84' },
      { date: 'May 2026', value: '87' },
      { date: 'Jun 2026', value: '88' },
    ],
    'SpO₂': [
      { date: 'Jan 2026', value: '93' },
      { date: 'Feb 2026', value: '92' },
      { date: 'Mar 2026', value: '94' },
      { date: 'Apr 2026', value: '93' },
      { date: 'May 2026', value: '91' },
      { date: 'Jun 2026', value: '93' },
    ],
    'Peak flow': [
      { date: 'Jan 2026', value: '215' },
      { date: 'Feb 2026', value: '205' },
      { date: 'Mar 2026', value: '220' },
      { date: 'Apr 2026', value: '210' },
      { date: 'May 2026', value: '200' },
      { date: 'Jun 2026', value: '210' },
    ],
    'Respiratory rate': [
      { date: 'Jan 2026', value: '21' },
      { date: 'Feb 2026', value: '23' },
      { date: 'Mar 2026', value: '20' },
      { date: 'Apr 2026', value: '22' },
      { date: 'May 2026', value: '24' },
      { date: 'Jun 2026', value: '22' },
    ],
  },
  investigations: [
    { test: 'FBC',               result: 'Normal',                              flag: 'Normal',          date: '11 Feb 2025', category: 'Blood',       requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'U&Es',              result: 'Na 140, K 4.3, Cr 98 µmol/L',        flag: 'Normal',          date: '11 Feb 2025', category: 'Blood',       requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'ECG',               result: 'Sinus rhythm',                        flag: 'Normal',          date: '11 Feb 2025', category: 'Imaging',     requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'Spirometry',        result: 'FEV1/FVC 0.58 — moderate obstruction', flag: 'Abnormal',       date: '11 Feb 2025', category: 'Respiratory', requestGroup: '11 Feb 2025', requestContext: 'Annual COPD Review — Bloods' },
    { test: 'CRP',               result: 'Mildly elevated',                     flag: 'Abnormal',        date: '26 Apr 2025', category: 'Blood',       requestGroup: '26 Apr 2025', requestContext: 'A&E Admission — Bloods' },
    { test: 'FBC',               result: 'WBC 11.2 — mildly raised',            flag: 'Abnormal',        date: '26 Apr 2025', category: 'Blood',       requestGroup: '26 Apr 2025', requestContext: 'A&E Admission — Bloods' },
    { test: 'Chest X-ray',       result: 'Hyperinflation consistent with COPD', flag: 'Abnormal',        date: '26 Apr 2025', category: 'Imaging',     requestGroup: '26 Apr 2025', requestContext: 'A&E Admission — Bloods' },
    { test: 'HbA1c',             result: '7.4%',                                flag: 'Borderline high', date: '14 Jun 2025', category: 'Blood',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'Total cholesterol', result: '5.1 mmol/L',                          flag: 'Borderline high', date: '14 Jun 2025', category: 'Blood',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'eGFR',              result: '68 mL/min/1.73m²',                    flag: 'Normal',          date: '14 Jun 2025', category: 'Blood',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'Urine dipstick',    result: 'Trace protein',                       flag: 'Abnormal',        date: '14 Jun 2025', category: 'Urine',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
    { test: 'Urine ACR',         result: '3.2 mg/mmol',                         flag: 'Normal',          date: '14 Jun 2025', category: 'Urine',       requestGroup: '14 Jun 2025', requestContext: 'Diabetes Review — Bloods' },
  ],
  carePlans: [
    { area: 'Respiratory', plan: 'Pulmonary rehabilitation referral' },
    { area: 'Falls Prevention', plan: 'Home safety assessment' },
    { area: 'Diabetes', plan: 'Dietary intervention and repeat HbA1c' },
    { area: 'Social', plan: 'Community wellbeing referral' },
  ],
  recentActivityFeed: [
    { id: 'e1', type: 'viewed',      actor: { initials: 'RC', color: '#B24E45' }, datetime: '01 Sep 2025, 15:20' },
    { id: 'e2', type: 'work-item',   actor: { initials: 'RC', color: '#B24E45' }, datetime: '01 Sep 2025, 15:22', meta: { label: 'Work item', value: 'Physiotherapy Referral' } },
    { id: 'e3', type: 'filed',       actor: { initials: 'HM', color: '#5E7F5C' }, datetime: '14 Jun 2025, 14:35', meta: { label: 'Filed to', value: 'Diabetes Review' } },
    { id: 'e4', type: 'filed',       actor: { initials: 'MA', color: '#724E91' }, datetime: '26 Apr 2025, 02:20', meta: { label: 'Filed to', value: 'COPD Exacerbation' } },
    { id: 'e5', type: 'appointment', actor: { initials: 'HM', color: '#5E7F5C' }, datetime: '11 Feb 2025, 10:00', meta: { label: 'Appointment', value: 'Annual COPD Review' } },
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
  patientTracker: {
    outstandingTasks: 3,
    openReferrals: 2,
    medicationReviewsDue: 1,
    nextAppointment: '22 Oct 2025',
    lastAppointment: '01 Sep 2025',
  },
};

// Default patient used in the summary view (high complexity)
export const ACTIVE_PATIENT = PATIENT_ELLISON;

// ─── Mock widget summaries (used when no API key is configured) ───────────────

export const MOCK_SUMMARIES: Record<string, string> = {
  Summary:
    '**Medical History**\n• COPD (diagnosed 2016) — moderate obstructive pattern, progressive decline\n• Hypertension — suboptimally controlled, currently on ramipril\n• Type 2 Diabetes — HbA1c 7.4%, early peripheral neuropathy suspected\n• Osteoarthritis and CKD Stage 2\n• Moderate frailty indicators with increasing falls risk\n\n**Clinical Summary**\n• Four GP/hospital contacts in 2025 driven by respiratory, metabolic, and falls concerns\n• April 2025: 3-day emergency admission for acute COPD exacerbation — nebulisers, steroids, antibiotics\n• September 2025: mechanical fall at home — physiotherapy and home safety referrals initiated\n• Overall trajectory reflects high-complexity multi-morbidity with rising healthcare dependency',

  'Recent encounters':
    '• Feb 2025 — Annual COPD review: worsening exertional breathlessness, pulmonary rehabilitation referral initiated\n• Apr 2025 — Emergency A&E admission: acute COPD exacerbation treated with nebulisers, steroids, and antibiotics; 3-day stay\n• Jun 2025 — Diabetes review: HbA1c 7.4%, early peripheral neuropathy suspected in left foot, dietary referral arranged\n• Sep 2025 — Falls assessment: mechanical fall at home, physiotherapy and home safety assessment referrals made',

  'Recent activity':
    'Ms Ellison has had four clinical contacts in 2025, driven primarily by COPD-related deterioration and multimorbidity monitoring. The pattern reflects escalating healthcare utilisation, including an unplanned hospital admission. Contact frequency and the breadth of services involved indicate a patient transitioning towards higher-dependency community care.',

  'Lifestyle & examinations':
    'Ms Ellison is an ex-smoker with a 40 pack-year history and drinks alcohol rarely. She reports social isolation, poor appetite during flare-ups, and significant reduction in mobility due to dyspnoea — she is breathless after short distances and uses a walking stick. Mild short-term memory concerns have been noted on cognitive screening. Recent examination findings include persistent hypertension (150/90 on last visit), oxygen saturations of 93% at rest, and mildly reduced plantar sensation in the left forefoot.',

  'Recent tests':
    '• HbA1c (Jun 2025) — 7.4%; moderately suboptimal, dietary intervention arranged\n• Chest X-ray (Apr 2025) — Hyperinflation consistent with COPD; no pneumonia\n• CRP — Mildly elevated; consistent with recent exacerbation\n• Total cholesterol — 5.1 mmol/L; borderline elevated, currently on atorvastatin\n• eGFR — 68 mL/min/1.73m²; CKD Stage 2, within safe range for current medications',

  'Current medications':
    'Ms Ellison is prescribed six regular medications across four therapeutic categories: respiratory (salbutamol PRN, tiotropium daily), cardiovascular (ramipril, atorvastatin), metabolic (metformin), and analgesic (paracetamol PRN). The combination of ramipril and metformin in the context of CKD Stage 2 requires routine renal function monitoring. No new medications were added at the most recent encounter; medication burden is moderate but appropriate to her condition complexity.',
};
