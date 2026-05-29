// Mock appointment context for each patient.
// Each entry provides the appointment reason and suggested follow-up actions
// shown when the "next appointment" response is returned.

export interface AppointmentContext {
  patientName: string;
  patientNameDisplay: string; // e.g. "ELLISON, Margaret (Ms)"
  dateOfBirth: string;
  patientId: string;
  sex: string;
  minutesUntil: number; // minutes from now the appointment is
  appointmentType: string;
  followUpText: string;
  suggestedActions: { id: string; text: string }[];
}

export const APPOINTMENT_POOL: AppointmentContext[] = [
  {
    patientName: 'Ms Margaret Ellison',
    patientNameDisplay: 'ELLISON, Margaret (Ms)',
    dateOfBirth: '03 Sep 1951',
    patientId: 'PT-10002',
    sex: 'Female',
    minutesUntil: 12,
    appointmentType: 'GP Review',
    followUpText:
      "Ms Margaret Ellison has requested this appointment to discuss her breathing. She reports a worsening wheeze and increased sputum production over the past week, and is concerned she may be developing another exacerbation. From a brief review of Ms Margaret Ellison's record I can see she was admitted with an acute COPD exacerbation in April 2025 and has an active referral for pulmonary rehabilitation that has not yet commenced.",
    suggestedActions: [
      { id: 'action-view-summary', text: 'View patient summary for Ms Margaret Ellison' },
      { id: 'action-copd-record', text: "View Ms Margaret Ellison's clinical record entries associated with Problem: COPD" },
      { id: 'action-copd-treatment', text: 'Summarise the recent treatment Ms Margaret Ellison has received for her COPD' },
    ],
  },
  {
    patientName: 'Mr Daniel Harper',
    patientNameDisplay: 'HARPER, Daniel (Mr)',
    dateOfBirth: '14 Feb 1997',
    patientId: 'PT-10001',
    sex: 'Male',
    minutesUntil: 8,
    appointmentType: 'GP Review',
    followUpText:
      "Mr Daniel Harper has booked this appointment to review his anxiety symptoms. He reports that work pressures have increased significantly over the past month and his propranolol use has become more frequent. He is also asking about whether a referral for talking therapy would be appropriate. From a brief review of Mr Daniel Harper's record I can see he was started on propranolol PRN in March 2025 for situational anxiety with no current secondary mental health involvement.",
    suggestedActions: [
      { id: 'action-view-summary', text: 'View patient summary for Mr Daniel Harper' },
      { id: 'action-anxiety-record', text: "View Mr Daniel Harper's clinical record entries associated with Problem: Anxiety" },
      { id: 'action-therapy-referral', text: 'What talking therapy options are available for Mr Daniel Harper?' },
    ],
  },
];

export function pickRandomAppointment(): AppointmentContext {
  return APPOINTMENT_POOL[Math.floor(Math.random() * APPOINTMENT_POOL.length)];
}
