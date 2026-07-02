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
    patientIdType?: 'CHI' | 'NHS';
    allergies: string;
  };
  lifestyleAndRiskFactors: Record<string, string>;
  problemsDiagnoses: Array<{ condition: string; status: string; diagnosed: string; priority?: 1 | 2 | 3; notes?: string; reviewedBy?: string; reviewedDate?: string }>;
  allergies: Array<{ substance: string; reaction: string; type?: string; recordedDate?: string; severity?: string; status?: string; recordedBy?: string; drugForm?: string; strength?: string; source?: string }>;
  currentMedications: Array<{ name: string; dose: string; frequency: string; prescriber: string; prescribedDate: string; prescriptionType?: string; drugForm?: string; strength?: string }>;
  encounters: Array<{
    date: string;
    time: string;
    clinician: string;
    location?: string;
    type: string;
    observations?: Record<string, string | number>;
    presentingComplaint?: string;
    summaryNotes: string;
    diagnosis?: string[];
    outcome: string[];
    treatmentPlan: string[];
    source?: string;
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
  lifestyleEntries?: {
    occupation?: { date: string; term: string; value: string };
    smoking?: { date: string; term: string; status: string; consumption?: string };
    alcohol?: { date: string; term: string; consumption: string };
    exercise?: { date: string; term: string; type: string };
    contraception?: { date: string; term: string; iucdFitted?: string };
    diet?: { date: string; term: string; habit: string; type?: string };
    residence?: { date: string; term: string; type: string };
  };
  examinationEntries?: {
    weight?: { date: string; term: string; value: string; bmi?: string };
    bloodPressure?: { date: string; term: string; systolic: string; diastolic: string };
    waistCircumference?: { date: string; systolic: string; diastolic: string };
    pulse?: { date: string; term: string; value: string };
    oxygenSaturation?: { date: string; term: string; value: string; unit: string };
    temperature?: { date: string; term: string; value: string; unit: string; qualifier?: string };
  };
  investigations: Array<{ test: string; result: string; flag?: string; date?: string; category?: string; requestGroup?: string; requestContext?: string; source?: string }>;
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
  // Urgent care extensions
  specialNotes?: Array<{
    id: string;
    category: string;
    note: string;
    recordedDate: string;
    recordedBy: string;
    source?: string;
  }>;
  immunisations?: Array<{
    vaccine: string;
    date: string;
    dose?: string;
    site?: string;
    batchNumber?: string;
    administeredBy: string;
    source?: string;
  }>;
  problems?: Array<{
    groupTitle: string;
    source?: string;
    items: Array<{
      condition: string;
      status: string;
      onset: string;
      notes?: string;
      source?: string;
    }>;
  }>;
  outboundReferrals?: Array<{
    id: string;
    referralDate: string;
    referredTo: string;
    specialty: string;
    reason: string;
    status: string;
    urgency: string;
    referredBy: string;
    source?: string;
  }>;
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
    patientId: '140297 1423',
    patientIdType: 'CHI',
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
    { name: 'Cetirizine', dose: '10 mg', frequency: 'PRN', prescriber: 'Dr Priya Nair', prescribedDate: '22 May 2025', prescriptionType: 'Acute', drugForm: 'Tablet', strength: '10 mg' },
    { name: 'Propranolol', dose: '10 mg', frequency: 'PRN for anxiety', prescriber: 'Dr Samuel Reeves', prescribedDate: '18 Mar 2025', prescriptionType: 'Acute', drugForm: 'Tablet', strength: '10 mg' },
  ],
  encounters: [
    {
      date: '10 Jan 2025',
      time: '09:20',
      clinician: 'Dr Amelia Foster',
      location: 'In practice',
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
      location: 'In practice',
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
      location: 'In practice',
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
  lifestyleEntries: {
    occupation:  { date: '10 Jan 2025', term: 'Occupation',         value: 'Graphic Designer' },
    smoking:     { date: '10 Jan 2025', term: 'Smoking status',     status: 'Never smoker' },
    alcohol:     { date: '10 Jan 2025', term: 'Alcohol consumption', consumption: 'Social drinker' },
    exercise:    { date: '10 Jan 2025', term: 'Exercise',           type: 'Gym 2× weekly' },
    diet:        { date: '10 Jan 2025', term: 'Diet',               habit: 'Moderate', type: 'Moderate processed food intake' },
    residence:   { date: '10 Jan 2025', term: 'Residence',         type: 'Urban — Greater London' },
  },
  examinationEntries: {
    weight:          { date: '10 Jan 2025', term: 'Weight',            value: '82 kg',  bmi: '25.0 kg/m²' },
    bloodPressure:   { date: '18 Mar 2025', term: 'Blood pressure',    systolic: '126', diastolic: '80' },
    pulse:           { date: '18 Mar 2025', term: 'Pulse',             value: '76 bpm' },
    oxygenSaturation:{ date: '10 Jan 2025', term: 'Oxygen saturation', value: '99', unit: '%' },
  },
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
    patientId: '030951 8762',
    patientIdType: 'CHI',
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
  allergies: [{ substance: 'Penicillin', reaction: 'Rash', type: 'Drug', recordedDate: '14 Feb 2024', severity: 'Mild', status: 'Active', recordedBy: 'Dr Amelia Foster', drugForm: 'Tablet', strength: '500 mg' }],
  currentMedications: [
    { name: 'Salbutamol Inhaler', dose: '100 mcg', frequency: 'PRN', prescriber: 'Dr Helen Murray', prescribedDate: '11 Feb 2025', prescriptionType: 'Repeat', drugForm: 'Inhaler', strength: '100 mcg/actuation' },
    { name: 'Tiotropium', dose: '18 mcg', frequency: 'Daily', prescriber: 'Dr Helen Murray', prescribedDate: '11 Feb 2025', prescriptionType: 'Repeat', drugForm: 'Inhaler (capsule)', strength: '18 mcg' },
    { name: 'Ramipril', dose: '5 mg', frequency: 'Daily', prescriber: 'Dr Rebecca Collins', prescribedDate: '01 Sep 2025', prescriptionType: 'Repeat', drugForm: 'Capsule', strength: '5 mg' },
    { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', prescriber: 'Dr Helen Murray', prescribedDate: '14 Jun 2025', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '500 mg' },
    { name: 'Atorvastatin', dose: '20 mg', frequency: 'Nightly', prescriber: 'Dr Marcus Allen', prescribedDate: '26 Apr 2025', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '20 mg' },
    { name: 'Paracetamol', dose: '1 g', frequency: 'PRN', prescriber: 'Dr Rebecca Collins', prescribedDate: '01 Sep 2025', prescriptionType: 'Acute', drugForm: 'Tablet', strength: '500 mg' },
  ],
  encounters: [
    {
      date: '11 Feb 2025',
      time: '10:00',
      clinician: 'Dr Helen Murray',
      location: 'In practice',
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
      location: 'Emergency department',
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
      location: 'In practice',
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
      location: 'Home visit',
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
  lifestyleEntries: {
    occupation:  { date: '11 Feb 2025', term: 'Occupation',          value: 'Retired' },
    smoking:     { date: '11 Feb 2025', term: 'Smoking status',      status: 'Ex-smoker', consumption: '40 pack-year history' },
    alcohol:     { date: '11 Feb 2025', term: 'Alcohol consumption', consumption: 'Rare' },
    diet:        { date: '11 Feb 2025', term: 'Diet',                habit: 'Poor appetite during COPD flare-ups', type: 'Reduced oral intake' },
    residence:   { date: '11 Feb 2025', term: 'Residence',           type: 'Lives alone' },
  },
  examinationEntries: {
    weight:           { date: '01 Sep 2025', term: 'Weight',            value: '70 kg',  bmi: '28.1 kg/m²' },
    bloodPressure:    { date: '01 Sep 2025', term: 'Blood pressure',    systolic: '150', diastolic: '90' },
    pulse:            { date: '01 Sep 2025', term: 'Pulse',             value: '88 bpm' },
    oxygenSaturation: { date: '11 Feb 2025', term: 'Oxygen saturation', value: '93', unit: '%' },
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

// ─── PT-10003: Ryan Okafor — Urgent Care ─────────────────────────────────────

export const PATIENT_OKAFOR: Patient = {
  id: 'PT-10003',
  demographics: {
    name: 'Ryan Okafor',
    displayName: 'OKAFOR, Ryan (Mr)',
    age: 41,
    sex: 'Male',
    dateOfBirth: '03 May 1984',
    height: '178 cm',
    weight: '94 kg',
    bmi: '29.7',
    occupation: 'Warehouse supervisor',
    maritalStatus: 'Married',
    smokingStatus: 'Current smoker',
    smokingHistory: '15 pack-year history',
    alcohol: 'Regular',
    livingSituation: 'Lives with family',
    nhsRegion: 'West Midlands',
    patientId: '485 312 6790',
    patientIdType: 'NHS',
    allergies: 'Penicillin — Anaphylaxis',
  },
  lifestyleAndRiskFactors: {
    Smoking: '15 pack-year history, current smoker',
    Alcohol: 'Estimated 28 units/week',
    'Cardiovascular risk': 'Elevated — hypertension, smoker, overweight',
    'Interpreter required': 'Yoruba — patient prefers clinical discussions in Yoruba',
  },
  problemsDiagnoses: [
    { condition: 'Hypertension', status: 'Active', diagnosed: '2021', priority: 1, notes: 'Poorly controlled. Last recorded BP 168/104 mmHg. On amlodipine 10mg. Non-adherent at times.' },
    { condition: 'Type 2 Diabetes', status: 'Active', diagnosed: '2022', priority: 1, notes: 'HbA1c 74 mmol/mol at last check — poorly controlled. On metformin 1g BD.' },
    { condition: 'Obesity', status: 'Active', diagnosed: '2022', priority: 2, notes: 'BMI 29.7. Weight management advice given. Dietary review arranged.' },
    { condition: 'Anxiety disorder', status: 'Active', diagnosed: '2020', priority: 2, notes: 'Managed with sertraline. Occasional panic attacks reported.' },
  ],
  allergies: [
    { substance: 'Penicillin', reaction: 'Anaphylaxis', type: 'Drug', recordedDate: '15 Mar 2019', severity: 'Severe', status: 'Active', recordedBy: 'Dr James Adeyemi', drugForm: 'Tablet', strength: '500 mg', source: 'GPConnect' },
  ],
  currentMedications: [
    { name: 'Amlodipine',  dose: '10 mg', frequency: 'Daily',        prescriber: 'Dr James Adeyemi', prescribedDate: '12 Jan 2026', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '10 mg' },
    { name: 'Metformin',   dose: '1 g',   frequency: 'Twice daily',   prescriber: 'Dr James Adeyemi', prescribedDate: '08 Nov 2025', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '1 g'   },
    { name: 'Sertraline',  dose: '50 mg', frequency: 'Daily',         prescriber: 'Dr James Adeyemi', prescribedDate: '14 Aug 2025', prescriptionType: 'Repeat', drugForm: 'Tablet', strength: '50 mg' },
    { name: 'Aspirin',     dose: '75 mg', frequency: 'Daily',         prescriber: 'Dr James Adeyemi', prescribedDate: '12 Jan 2026', prescriptionType: 'Repeat', drugForm: 'Gastro-resistant tablet', strength: '75 mg' },
  ],
  encounters: [
    {
      date: '12 Jan 2026',
      time: '09:45',
      clinician: 'Dr James Adeyemi',
      location: 'In practice',
      type: 'GP Hypertension Review',
      observations: { BP: '168/104', Pulse: 88, Weight: '94 kg' },
      summaryNotes: 'Patient attended for hypertension review. BP remains significantly elevated despite amlodipine 10mg. Patient reports intermittent adherence due to shift work patterns. Discussed cardiovascular risk in context of concurrent diabetes and smoking. Cardiovascular risk score calculated at 14.2% over 10 years. Advised on smoking cessation and dietary modification.',
      diagnosis: ['Hypertension — poorly controlled'],
      outcome: ['BP significantly above target', 'Cardiovascular risk formally assessed', 'Smoking cessation referral made'],
      treatmentPlan: ['Add ramipril 2.5mg — titrate to 5mg at 4 weeks', 'Smoking cessation referral', 'Repeat BP check in 4 weeks', 'HbA1c recheck in 3 months'],
      source: 'GPConnect',
    },
    {
      date: '08 Nov 2025',
      time: '14:15',
      clinician: 'Dr James Adeyemi',
      location: 'In practice',
      type: 'GP Diabetes Annual Review',
      observations: { HbA1c: '74 mmol/mol', BP: '162/98', Weight: '96 kg' },
      summaryNotes: 'Annual diabetes review. HbA1c poorly controlled at 74 mmol/mol. Patient reports difficulty maintaining consistent mealtimes due to rotating shifts. Foot examination unremarkable. Retinal screening up to date — no diabetic retinopathy identified. Weight increased by 2kg since last visit.',
      diagnosis: ['Type 2 diabetes — suboptimal glycaemic control'],
      outcome: ['HbA1c elevated — dietary review arranged', 'No diabetic complications identified', 'Retinal screening normal'],
      treatmentPlan: ['Continue metformin 1g BD', 'Dietician referral arranged', 'Foot care education reinforced', 'Repeat HbA1c in 3 months'],
    },
    {
      date: '03 Jun 2025',
      time: '22:40',
      clinician: 'Dr Sarah Obi',
      location: 'Emergency department',
      type: 'A&E Attendance',
      observations: { BP: '182/112', Pulse: 102, 'GCS': '15/15', SpO2: '98%' },
      presentingComplaint: 'Severe headache and visual disturbance',
      summaryNotes: 'Patient self-presented to emergency department with 4-hour history of severe occipital headache and intermittent blurring of vision bilaterally. No focal neurology on examination. CT head unremarkable. Blood pressure critically elevated on admission at 182/112 mmHg. Urgent hypertensive urgency management initiated. No end-organ damage identified on initial workup. Discharged following BP reduction to 158/96 over 6 hours with oral labetalol.',
      diagnosis: ['Hypertensive urgency'],
      outcome: ['BP managed in department — no end-organ damage identified', 'Discharged with GP follow-up arranged'],
      treatmentPlan: ['GP follow-up within 5 days', 'Continue amlodipine', 'Consider ACE inhibitor addition', 'Reinforce medication adherence'],
      source: 'Secondary care discharge summary',
    },
  ],
  observations: {
    bloodPressure: [
      { date: 'Jun 2025', value: '182/112' },
      { date: 'Aug 2025', value: '174/106' },
      { date: 'Nov 2025', value: '162/98'  },
      { date: 'Jan 2026', value: '168/104' },
    ],
  },
  metricHistory: {
    'BP': [
      { date: 'Jun 2025', value: '182/112' },
      { date: 'Aug 2025', value: '174/106' },
      { date: 'Nov 2025', value: '162/98'  },
      { date: 'Jan 2026', value: '168/104' },
    ],
    'Weight': [
      { date: 'Jun 2025', value: '97' },
      { date: 'Nov 2025', value: '96' },
      { date: 'Jan 2026', value: '94' },
    ],
    'Pulse': [
      { date: 'Jun 2025', value: '102' },
      { date: 'Nov 2025', value: '90'  },
      { date: 'Jan 2026', value: '88'  },
    ],
  },
  lifestyleMetrics: [
    { label: 'Weight',     value: '94',   unit: 'kg',    date: '12 Jan 2026', trend: 'down'    },
    { label: 'BMI',        value: '29.7', unit: 'kg/m²', date: '12 Jan 2026', trend: 'down'    },
    { label: 'BP',         value: '168/104', unit: 'mmHg', date: '12 Jan 2026', trend: 'up'   },
    { label: 'Pulse',      value: '88',   unit: 'bpm',   date: '12 Jan 2026', trend: 'down'    },
    { label: 'HbA1c',      value: '74',   unit: 'mmol/mol', date: '08 Nov 2025', trend: 'up'  },
    { label: 'SpO₂',       value: '98',   unit: '%',     date: '03 Jun 2025', trend: 'neutral' },
  ],
  lifestyleEntries: {
    occupation: { date: '12 Jan 2026', term: 'Occupation',          value: 'Warehouse supervisor (rotating shifts)' },
    smoking:    { date: '12 Jan 2026', term: 'Smoking status',      status: 'Current smoker', consumption: '15 pack-years' },
    alcohol:    { date: '12 Jan 2026', term: 'Alcohol consumption', consumption: 'Regular — approx. 28 units/week' },
    residence:  { date: '12 Jan 2026', term: 'Residence',           type: 'Lives with family' },
    diet:       { date: '08 Nov 2025', term: 'Diet',                habit: 'Irregular mealtimes due to shift work', type: 'High processed food intake' },
  },
  examinationEntries: {
    weight:        { date: '12 Jan 2026', term: 'Weight',            value: '94 kg',  bmi: '29.7 kg/m²' },
    bloodPressure: { date: '12 Jan 2026', term: 'Blood pressure',    systolic: '168', diastolic: '104'   },
    pulse:         { date: '12 Jan 2026', term: 'Pulse',             value: '88 bpm'                     },
    oxygenSaturation: { date: '03 Jun 2025', term: 'Oxygen saturation', value: '98', unit: '%'           },
  },
  investigations: [
    { test: 'HbA1c',             result: '74 mmol/mol', flag: 'Abnormal',        date: '08 Nov 2025', category: 'Blood',   requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'                      },
    { test: 'FBC',               result: 'Normal',      flag: 'Normal',          date: '08 Nov 2025', category: 'Blood',   requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'                      },
    { test: 'U&Es',              result: 'Na 139, K 4.1, Cr 88 µmol/L', flag: 'Normal', date: '08 Nov 2025', category: 'Blood', requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'               },
    { test: 'LFTs',              result: 'Normal',      flag: 'Normal',          date: '08 Nov 2025', category: 'Blood',   requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'                      },
    { test: 'Total cholesterol', result: '5.8 mmol/L',  flag: 'Borderline high', date: '08 Nov 2025', category: 'Blood',   requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'                      },
    { test: 'eGFR',              result: '82 mL/min/1.73m²', flag: 'Normal',     date: '08 Nov 2025', category: 'Blood',   requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'                      },
    { test: 'Urine ACR',         result: '4.1 mg/mmol', flag: 'Borderline high', date: '08 Nov 2025', category: 'Urine',   requestGroup: '08 Nov 2025', requestContext: 'Diabetes Annual Review', source: 'GPConnect'                      },
    { test: 'CT Head',           result: 'No acute intracranial pathology', flag: 'Normal', date: '03 Jun 2025', category: 'Imaging', requestGroup: '03 Jun 2025', requestContext: 'A&E Attendance — Hypertensive urgency', source: 'Secondary care' },
    { test: 'ECG',               result: 'Sinus tachycardia — no ischaemic changes', flag: 'Normal', date: '03 Jun 2025', category: 'Imaging', requestGroup: '03 Jun 2025', requestContext: 'A&E Attendance — Hypertensive urgency', source: 'Secondary care' },
    { test: 'Troponin',          result: '<14 ng/L — negative', flag: 'Normal',   date: '03 Jun 2025', category: 'Blood',   requestGroup: '03 Jun 2025', requestContext: 'A&E Attendance — Hypertensive urgency', source: 'Secondary care' },
    { test: 'Retinal screening', result: 'No diabetic retinopathy',    flag: 'Normal', date: '15 Sep 2025', category: 'Imaging', requestGroup: '15 Sep 2025', requestContext: 'Diabetic Eye Screening', source: 'Diabetic Eye Screening Programme' },
  ],
  specialNotes: [
    {
      id: 'sn-01',
      category: 'Communication',
      note: 'Patient requires a Yoruba interpreter for clinical consultations. Patient understands written English but prefers spoken clinical discussions in Yoruba to ensure informed consent.',
      recordedDate: '08 Nov 2025',
      recordedBy: 'Dr James Adeyemi',
      source: 'GPConnect',
    },
  ],
  immunisations: [
    { vaccine: 'COVID-19 (Moderna)',         date: '14 Oct 2023', dose: 'Booster',    administeredBy: 'Pharmacy — Lloyds Pharmacy Birmingham', source: 'NHAIS' },
    { vaccine: 'Influenza (Quadrivalent)',    date: '02 Oct 2024', dose: 'Annual',     administeredBy: 'Dr James Adeyemi', source: 'GPConnect'                    },
    { vaccine: 'Pneumococcal (PPV23)',        date: '08 Mar 2022', dose: 'Single',     administeredBy: 'Dr James Adeyemi', source: 'GPConnect'                    },
    { vaccine: 'Hepatitis B (Engerix-B)',     date: '11 Jan 2023', dose: 'Course — 3 doses completed', batchNumber: 'EB-2301-047', administeredBy: 'Occupational health — employer referral', source: 'Occupational Health Records' },
    { vaccine: 'Tetanus/Diphtheria/Polio',   date: '22 Sep 2019', dose: 'Booster',    administeredBy: 'Dr James Adeyemi', source: 'GPConnect'                    },
  ],
  problems: [
    {
      groupTitle: 'Cardiovascular',
      source: 'GPConnect',
      items: [
        { condition: 'Hypertension',              status: 'Active',   onset: '2021', notes: 'Poorly controlled. Currently on amlodipine 10mg. ACE inhibitor being added.' },
        { condition: 'Hypertensive urgency',       status: 'Resolved', onset: 'Jun 2025', notes: 'A&E attendance. Managed with oral labetalol. No end-organ damage.' },
        { condition: 'Elevated cardiovascular risk', status: 'Active', onset: '2026', notes: '10-year QRISK3 score 14.2%.' },
      ],
    },
    {
      groupTitle: 'Metabolic',
      source: 'GPConnect',
      items: [
        { condition: 'Type 2 Diabetes',  status: 'Active', onset: '2022', notes: 'HbA1c 74 mmol/mol — suboptimal. On metformin 1g BD.' },
        { condition: 'Obesity',          status: 'Active', onset: '2022', notes: 'BMI 29.7. Dietary review arranged.' },
        { condition: 'Hypercholesterolaemia', status: 'Active', onset: '2025', notes: 'Total cholesterol 5.8 mmol/mol. Statin initiation under consideration.' },
      ],
    },
    {
      groupTitle: 'Mental health',
      source: 'GPConnect',
      items: [
        { condition: 'Anxiety disorder', status: 'Active', onset: '2020', notes: 'On sertraline 50mg. Occasional panic attacks. No secondary care input.' },
      ],
    },
  ],
  outboundReferrals: [
    {
      id: 'ref-01',
      referralDate: '12 Jan 2026',
      referredTo: 'Stop Smoking Service — West Midlands',
      specialty: 'Smoking cessation',
      reason: 'Current smoker with elevated cardiovascular risk. 15 pack-year history.',
      status: 'Pending',
      urgency: 'Routine',
      referredBy: 'Dr James Adeyemi',
      source: 'GPConnect',
    },
    {
      id: 'ref-02',
      referralDate: '08 Nov 2025',
      referredTo: 'Dietetics — Sandwell and West Birmingham NHS Trust',
      specialty: 'Dietetics',
      reason: 'Suboptimal glycaemic control. Irregular mealtimes secondary to shift work. Dietary review requested.',
      status: 'Active',
      urgency: 'Routine',
      referredBy: 'Dr James Adeyemi',
      source: 'GPConnect',
    },
    {
      id: 'ref-03',
      referralDate: '03 Jun 2025',
      referredTo: 'Cardiology — City Hospital Birmingham',
      specialty: 'Cardiology',
      reason: 'Hypertensive urgency with poorly controlled BP on current therapy. Specialist review requested for optimisation of antihypertensive regimen.',
      status: 'Completed',
      urgency: 'Urgent',
      referredBy: 'Dr Sarah Obi',
      source: 'Secondary care discharge summary',
    },
  ],
  carePlans: [
    { area: 'Cardiovascular', plan: 'Add ramipril; repeat BP in 4 weeks; smoking cessation referral active' },
    { area: 'Diabetes',       plan: 'Repeat HbA1c in 3 months; dietetics referral active; reinforce foot care' },
    { area: 'Lifestyle',      plan: 'Smoking cessation support; alcohol reduction advice; weight management' },
  ],
  recentActivityFeed: [
    { id: 'o1', type: 'viewed',      actor: { initials: 'JA', color: '#2B6CB0' }, datetime: '12 Jan 2026, 09:45' },
    { id: 'o2', type: 'work-item',   actor: { initials: 'JA', color: '#2B6CB0' }, datetime: '12 Jan 2026, 09:52', meta: { label: 'Work item', value: 'Smoking Cessation Referral' } },
    { id: 'o3', type: 'filed',       actor: { initials: 'JA', color: '#2B6CB0' }, datetime: '08 Nov 2025, 14:25', meta: { label: 'Filed to', value: 'Diabetes Annual Review' } },
    { id: 'o4', type: 'appointment', actor: { initials: 'SO', color: '#B24E45' }, datetime: '03 Jun 2025, 22:40', meta: { label: 'Appointment', value: 'A&E — Hypertensive Urgency' } },
    { id: 'o5', type: 'filed',       actor: { initials: 'SO', color: '#B24E45' }, datetime: '03 Jun 2025, 23:10', meta: { label: 'Filed to', value: 'Hypertensive Urgency — Discharge' } },
  ],
  aiSummary: {
    keyThemes: [
      'Poorly controlled hypertension with hypertensive urgency A&E attendance',
      'Type 2 diabetes — suboptimal glycaemic control',
      'Elevated cardiovascular risk (QRISK3 14.2%)',
      'Interpreter required — Yoruba',
      'Medication adherence concerns secondary to shift work',
    ],
    recentActivity:
      'The patient has had three significant clinical contacts in the past year relating to cardiovascular and metabolic risk management. In June 2025 he attended the emergency department with hypertensive urgency, requiring managed BP reduction. Subsequent GP reviews in November 2025 and January 2026 have focused on antihypertensive optimisation, glycaemic control, and smoking cessation. ACE inhibitor addition is planned and smoking cessation referral is active.',
    longitudinalSummary:
      'The clinical record reflects a 41-year-old male with a high-burden cardiovascular and metabolic risk profile including poorly controlled hypertension, type 2 diabetes, and active smoking. Medication adherence is intermittent, partly attributed to rotating shift work. A hypertensive urgency episode in mid-2025 highlighted the urgency of risk factor optimisation. The clinical trajectory requires close monitoring and proactive multidisciplinary input.',
  },
  patientTracker: {
    outstandingTasks: 2,
    openReferrals: 2,
    medicationReviewsDue: 1,
    nextAppointment: '10 Feb 2026',
    lastAppointment: '12 Jan 2026',
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
