export type WorkItemStatus = 'DUE' | 'TO DO' | 'IN PROGRESS' | 'ON HOLD' | 'DONE';
export type WorkItemPriority = 'high' | 'medium' | 'low';
export type WorkItemDueGroup = 'today' | 'tomorrow' | 'this-week';

export interface LinkedPatient {
  displayName: string;
  nhsNo: string;
}

export interface LinkedDocument {
  id: string;
  title: string;
  uploadedOn: string;
}

export interface WorkItemPerson {
  name: string;
  initials: string;
  avatarVariant: 'accent1' | 'accent2' | 'accent3';
}

export interface WorkItem {
  id: string;
  title: string;
  createdDate: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  assignedTo: WorkItemPerson;
  dueGroup: WorkItemDueGroup;
  description: string;
  breadcrumb: string[];
  linkedPatient?: LinkedPatient;
  linkedDocument?: LinkedDocument;
  assignedOn: string;
  createdBy: WorkItemPerson;
  createdOn: string;
  commentCount: number;
}

const SM: WorkItemPerson = { name: 'Dr Sarah Malik', initials: 'SM', avatarVariant: 'accent1' };
const OP: WorkItemPerson = { name: 'Dr Olivia Paisley', initials: 'OP', avatarVariant: 'accent2' };

export const WORK_ITEMS: WorkItem[] = [
  // ── Due today ──────────────────────────────────────────────────────────────
  {
    id: 'WI-10234',
    title: 'Chase FBC results — CRAWFORD, Thomas',
    createdDate: '18-Aug-2026',
    status: 'DUE',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'today',
    description: 'Full blood count results requested on 14 August have not returned. Results are needed before the patient\'s follow-up appointment on 28 August. Contact the lab to chase and document the outcome in the patient record before the appointment.',
    breadcrumb: ['Patients', 'CRAWFORD, Thomas (Mr)', 'Tasks'],
    linkedPatient: { displayName: 'CRAWFORD, Thomas (Mr)', nhsNo: '943 476 5628' },
    assignedOn: '18-Aug-2026 at 14:22',
    createdBy: SM,
    createdOn: '18-Aug-2026 at 14:22',
    commentCount: 2,
  },
  {
    id: 'WI-10235',
    title: 'Review medication list — FARROW, Nina',
    createdDate: '20-Aug-2026',
    status: 'DUE',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'today',
    description: 'Annual medication review due for patient currently on six long-term medications. Review for drug interactions, ongoing clinical appropriateness, and any required dose adjustments. Patient has a telephone consultation booked for 27 August.',
    breadcrumb: ['Patients', 'FARROW, Nina (Ms)', 'Tasks'],
    linkedPatient: { displayName: 'FARROW, Nina (Ms)', nhsNo: '710 334 8821' },
    assignedOn: '20-Aug-2026 at 09:10',
    createdBy: OP,
    createdOn: '20-Aug-2026 at 09:10',
    commentCount: 0,
  },
  {
    id: 'WI-10236',
    title: 'Sign repeat prescriptions (batch — 17 items)',
    createdDate: '25-Aug-2026',
    status: 'DUE',
    priority: 'medium',
    assignedTo: SM,
    dueGroup: 'today',
    description: 'Batch of 17 repeat prescription requests requiring clinical sign-off. Review each item for clinical appropriateness before authorising. Flag any items requiring a clinical review before issuing.',
    breadcrumb: ['Prescriptions', 'Awaiting authorisation'],
    assignedOn: '25-Aug-2026 at 08:00',
    createdBy: OP,
    createdOn: '25-Aug-2026 at 08:00',
    commentCount: 0,
  },
  {
    id: 'WI-10237',
    title: 'Complete referral letter — HASSAN, Ali',
    createdDate: '22-Aug-2026',
    status: 'DUE',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'today',
    description: 'Two-week wait referral to Cardiology for chest pain investigation. Patient seen 22 August. Letter drafted and requires final review, signature, and submission to the Lothian Referral Hub before 5pm today.',
    breadcrumb: ['Patients', 'HASSAN, Ali (Mr)', 'Referrals'],
    linkedPatient: { displayName: 'HASSAN, Ali (Mr)', nhsNo: '501 882 3347' },
    linkedDocument: { id: 'DOC-4421', title: 'Cardiology referral draft', uploadedOn: '22-Aug-2026' },
    assignedOn: '22-Aug-2026 at 16:30',
    createdBy: SM,
    createdOn: '22-Aug-2026 at 16:30',
    commentCount: 1,
  },
  {
    id: 'WI-10238',
    title: 'Review abnormal TFT result — WRIGHT, Margaret',
    createdDate: '25-Aug-2026',
    status: 'DUE',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'today',
    description: 'TSH elevated at 12.4 mIU/L (reference range 0.4–4.0), free T4 below range. Review in context of patient history and current levothyroxine dose. Consider dose adjustment and arrange repeat thyroid function tests in 6 weeks.',
    breadcrumb: ['Patients', 'WRIGHT, Margaret (Mrs)', 'Results'],
    linkedPatient: { displayName: 'WRIGHT, Margaret (Mrs)', nhsNo: '826 115 7794' },
    assignedOn: '26-Aug-2026 at 07:45',
    createdBy: SM,
    createdOn: '26-Aug-2026 at 07:45',
    commentCount: 0,
  },
  // ── Due tomorrow ───────────────────────────────────────────────────────────
  {
    id: 'WI-10239',
    title: 'Review consultation notes for quarterly audit',
    createdDate: '21-Aug-2026',
    status: 'TO DO',
    priority: 'medium',
    assignedTo: SM,
    dueGroup: 'tomorrow',
    description: 'Quarterly clinical audit of 10 randomly selected consultations. Review notes for compliance with documentation standards: coded diagnosis, SNOMED clinical terms applied, safety-netting documented, and follow-up actions recorded.',
    breadcrumb: ['Clinical Governance', 'Audit', 'Q3 2026'],
    assignedOn: '21-Aug-2026 at 11:00',
    createdBy: OP,
    createdOn: '21-Aug-2026 at 11:00',
    commentCount: 0,
  },
  {
    id: 'WI-10240',
    title: 'Action SNOMED coding backlog (14 entries)',
    createdDate: '19-Aug-2026',
    status: 'TO DO',
    priority: 'low',
    assignedTo: SM,
    dueGroup: 'tomorrow',
    description: '14 entries in the coding backlog require clinical review before SNOMED CT codes can be assigned. These relate to consultations from the past four weeks and are required for QOF reporting before end of quarter.',
    breadcrumb: ['Admin', 'Coding', 'Backlog'],
    assignedOn: '19-Aug-2026 at 09:30',
    createdBy: OP,
    createdOn: '19-Aug-2026 at 09:30',
    commentCount: 0,
  },
  {
    id: 'WI-10241',
    title: 'Two-week wait referral — THOMPSON, James',
    createdDate: '24-Aug-2026',
    status: 'TO DO',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'tomorrow',
    description: 'Suspected lower GI malignancy. Patient presents with eight-week history of change in bowel habit and rectal bleeding. Referral to Colorectal Surgery required under the 2WW pathway. Complete referral form and submit via SCI Gateway.',
    breadcrumb: ['Patients', 'THOMPSON, James (Mr)', 'Referrals'],
    linkedPatient: { displayName: 'THOMPSON, James (Mr)', nhsNo: '344 729 0156' },
    assignedOn: '24-Aug-2026 at 15:45',
    createdBy: SM,
    createdOn: '24-Aug-2026 at 15:45',
    commentCount: 3,
  },
  // ── Due this week ──────────────────────────────────────────────────────────
  {
    id: 'WI-10242',
    title: 'Annual review — BROWN, Patricia',
    createdDate: '11-Aug-2026',
    status: 'TO DO',
    priority: 'medium',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Long-term conditions annual review for patient with Type 2 diabetes, hypertension, and CKD Stage 3. Review HbA1c, renal function, blood pressure, lipid profile, and medication. Update care plan and check all QOF indicators.',
    breadcrumb: ['Patients', 'BROWN, Patricia (Mrs)', 'Tasks'],
    linkedPatient: { displayName: 'BROWN, Patricia (Mrs)', nhsNo: '157 308 4422' },
    assignedOn: '11-Aug-2026 at 10:15',
    createdBy: OP,
    createdOn: '11-Aug-2026 at 10:15',
    commentCount: 0,
  },
  {
    id: 'WI-10243',
    title: 'Respond to patient AccuRx query — PATEL, Raj',
    createdDate: '24-Aug-2026',
    status: 'TO DO',
    priority: 'low',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Patient submitted an AccuRx query regarding side effects from newly prescribed ramipril: dizziness and dry cough. Review and respond with clinical advice. Consider whether dose adjustment or an alternative ACE inhibitor is appropriate.',
    breadcrumb: ['Messages', 'Inbox'],
    linkedPatient: { displayName: 'PATEL, Raj (Mr)', nhsNo: '629 441 7783' },
    assignedOn: '24-Aug-2026 at 13:20',
    createdBy: SM,
    createdOn: '24-Aug-2026 at 13:20',
    commentCount: 0,
  },
  {
    id: 'WI-10244',
    title: 'Review QOF diabetes register indicators',
    createdDate: '18-Aug-2026',
    status: 'TO DO',
    priority: 'low',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'QOF reporting period ends 31 August. Review outstanding indicators for the diabetes register: HbA1c, blood pressure, cholesterol, BMI, and smoking status. Identify patients requiring urgent recall before the end of quarter.',
    breadcrumb: ['Clinical Governance', 'QOF', 'Diabetes Register'],
    assignedOn: '18-Aug-2026 at 09:00',
    createdBy: OP,
    createdOn: '18-Aug-2026 at 09:00',
    commentCount: 0,
  },
  {
    id: 'WI-10245',
    title: 'Sign off discharge summary — PATEL, Raj',
    createdDate: '23-Aug-2026',
    status: 'TO DO',
    priority: 'medium',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Discharge summary received from NHS Lothian following patient admission 18–21 August. Review medication changes and follow-up recommendations, then update the patient record. Confirm any new medications are added to the repeat list.',
    breadcrumb: ['Patients', 'PATEL, Raj (Mr)', 'Correspondence'],
    linkedPatient: { displayName: 'PATEL, Raj (Mr)', nhsNo: '629 441 7783' },
    linkedDocument: { id: 'DOC-4418', title: 'NHS Lothian discharge summary', uploadedOn: '23-Aug-2026' },
    assignedOn: '23-Aug-2026 at 10:00',
    createdBy: OP,
    createdOn: '23-Aug-2026 at 10:00',
    commentCount: 0,
  },
  {
    id: 'WI-10246',
    title: 'Drug monitoring review — JONES, Helen',
    createdDate: '14-Aug-2026',
    status: 'TO DO',
    priority: 'medium',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Patient on methotrexate for rheumatoid arthritis. Monthly FBC and LFTs are due. Results have been received and require clinical review before the next prescription is issued. Check specifically for cytopenias and signs of hepatotoxicity.',
    breadcrumb: ['Patients', 'JONES, Helen (Mrs)', 'Results'],
    linkedPatient: { displayName: 'JONES, Helen (Mrs)', nhsNo: '782 205 9934' },
    assignedOn: '14-Aug-2026 at 14:00',
    createdBy: SM,
    createdOn: '14-Aug-2026 at 14:00',
    commentCount: 0,
  },
  {
    id: 'WI-10247',
    title: 'Review echocardiogram result — MOORE, George',
    createdDate: '20-Aug-2026',
    status: 'TO DO',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Echocardiogram report received showing moderate mitral regurgitation. Patient is currently asymptomatic. Result requires clinical review and a management decision: referral to Cardiology, watchful waiting with serial echoes, or GP-led follow-up.',
    breadcrumb: ['Patients', 'MOORE, George (Mr)', 'Results'],
    linkedPatient: { displayName: 'MOORE, George (Mr)', nhsNo: '493 607 2218' },
    linkedDocument: { id: 'DOC-4419', title: 'Echocardiogram report', uploadedOn: '20-Aug-2026' },
    assignedOn: '20-Aug-2026 at 11:30',
    createdBy: OP,
    createdOn: '20-Aug-2026 at 11:30',
    commentCount: 1,
  },
  {
    id: 'WI-10248',
    title: 'Update care plan — DAVIDSON, Susan',
    createdDate: '22-Aug-2026',
    status: 'TO DO',
    priority: 'low',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Personalised care plan requires updating following recent diagnosis of atrial fibrillation. Add new diagnosis, updated medication list (patient now on anticoagulation), and a revised monitoring plan including INR schedule.',
    breadcrumb: ['Patients', 'DAVIDSON, Susan (Ms)', 'Care Plans'],
    linkedPatient: { displayName: 'DAVIDSON, Susan (Ms)', nhsNo: '318 554 6671' },
    assignedOn: '22-Aug-2026 at 16:00',
    createdBy: SM,
    createdOn: '22-Aug-2026 at 16:00',
    commentCount: 0,
  },
  {
    id: 'WI-10249',
    title: 'Complaint response — MILLER, Robert',
    createdDate: '19-Aug-2026',
    status: 'TO DO',
    priority: 'high',
    assignedTo: SM,
    dueGroup: 'this-week',
    description: 'Formal complaint received from patient regarding a delayed referral for knee pain. Practice manager requires a written clinical response within five working days. Review consultation records and referral timeline before drafting a response.',
    breadcrumb: ['Admin', 'Complaints', 'Open'],
    linkedPatient: { displayName: 'MILLER, Robert (Mr)', nhsNo: '867 193 4450' },
    assignedOn: '19-Aug-2026 at 14:30',
    createdBy: OP,
    createdOn: '19-Aug-2026 at 14:30',
    commentCount: 4,
  },
];
