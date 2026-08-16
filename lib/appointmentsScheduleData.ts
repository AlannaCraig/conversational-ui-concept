export type AppointmentStatus =
  | 'Available' | 'Booked' | 'Arrived' | 'In Progress'
  | 'Completed' | 'DNA' | 'Cancelled' | 'Blocked' | 'Reserved' | 'Running Late';

export type RoleCategory = 'doctor' | 'nurse' | 'hca' | 'clinic' | 'service';

export interface ScheduleColumn {
  id: string;
  name: string;
  role: string;
  category: RoleCategory;
  initials: string;
  sessionLabel?: string;
}

export interface ScheduleSlot {
  id: string;
  columnId: string;
  type: 'appointment' | 'blocked' | 'available';
  startTime: string;
  durationMins: number;
  patientName?: string;
  appointmentType?: string;
  status?: AppointmentStatus;
  blockedLabel?: string;
}

export const SCHEDULE_COLUMNS: ScheduleColumn[] = [
  { id: 'malik',      name: 'Dr Sarah Malik',    role: 'GP',                    category: 'doctor',  initials: 'SM', sessionLabel: 'Full Day Session'     },
  { id: 'reid',       name: 'Dr James Reid',     role: 'GP',                    category: 'doctor',  initials: 'JR', sessionLabel: 'Full Day Session'     },
  { id: 'wilson',     name: 'Amy Wilson',        role: 'Practice Nurse',        category: 'nurse',   initials: 'AW', sessionLabel: 'Full Day Session'     },
  { id: 'douglas',    name: 'Mark Douglas',      role: 'Healthcare Assistant',  category: 'hca',     initials: 'MD', sessionLabel: 'Full Day Session'     },
  { id: 'phlebotomy', name: 'Phlebotomy Clinic', role: 'Blood tests',           category: 'service', initials: 'PH', sessionLabel: 'Morning Session'      },
  { id: 'diabetes',   name: 'Diabetes Clinic',   role: 'Long-term conditions',  category: 'clinic',  initials: 'DC', sessionLabel: 'Afternoon Session'    },
];

export const SCHEDULE_SLOTS: ScheduleSlot[] = [
  // ─── Dr Sarah Malik ──────────────────────────────────────────────────────
  { id: 'sm-01', columnId: 'malik', type: 'appointment', startTime: '09:00', durationMins: 10, patientName: 'WALSH, Peter (Mr)',       appointmentType: 'Routine',            status: 'Completed'    },
  { id: 'sm-02', columnId: 'malik', type: 'appointment', startTime: '09:10', durationMins: 10, patientName: 'DOBSON, Irene (Mrs)',      appointmentType: 'Admin',              status: 'Completed'    },
  { id: 'sm-03', columnId: 'malik', type: 'appointment', startTime: '09:20', durationMins: 10, patientName: 'HARTLEY, Charles (Mr)',    appointmentType: 'Face-to-face',       status: 'Completed'    },
  { id: 'sm-04', columnId: 'malik', type: 'appointment', startTime: '09:30', durationMins: 20, patientName: 'PATEL, Susan (Mrs)',       appointmentType: 'Medication review',  status: 'Completed'    },
  { id: 'sm-05', columnId: 'malik', type: 'available',   startTime: '09:50', durationMins: 10 },
  { id: 'sm-06', columnId: 'malik', type: 'blocked',     startTime: '10:00', durationMins: 30, blockedLabel: 'Admin / correspondence'  },
  { id: 'sm-07', columnId: 'malik', type: 'appointment', startTime: '10:30', durationMins: 10, patientName: 'HOLMES, Margaret (Mrs)',   appointmentType: 'Medication review',  status: 'In Progress'  },
  { id: 'sm-08', columnId: 'malik', type: 'appointment', startTime: '10:40', durationMins: 10, patientName: 'CRAWFORD, Thomas (Mr)',    appointmentType: 'Follow-up',          status: 'Arrived'      },
  { id: 'sm-09', columnId: 'malik', type: 'appointment', startTime: '10:50', durationMins: 10, patientName: 'FARROW, Nina (Ms)',        appointmentType: 'Asthma review',      status: 'Booked'       },
  { id: 'sm-10', columnId: 'malik', type: 'appointment', startTime: '11:00', durationMins: 10, patientName: 'ASHWORTH, Linda (Mrs)',    appointmentType: 'Face-to-face',       status: 'DNA'          },
  { id: 'sm-11', columnId: 'malik', type: 'appointment', startTime: '11:10', durationMins: 20, patientName: 'BAINES, Christopher (Mr)', appointmentType: 'Annual review',      status: 'Booked'       },
  { id: 'sm-12', columnId: 'malik', type: 'available',   startTime: '11:30', durationMins: 10 },
  { id: 'sm-13', columnId: 'malik', type: 'appointment', startTime: '11:40', durationMins: 20, patientName: 'NEVILLE, Patricia (Mrs)',  appointmentType: 'Mental health',      status: 'Booked'       },
  { id: 'sm-14', columnId: 'malik', type: 'blocked',     startTime: '12:00', durationMins: 60, blockedLabel: 'Lunch'                   },
  { id: 'sm-15', columnId: 'malik', type: 'appointment', startTime: '13:00', durationMins: 10, patientName: 'HARDY, Michael (Mr)',      appointmentType: 'Urgent',             status: 'Arrived'      },
  { id: 'sm-16', columnId: 'malik', type: 'appointment', startTime: '13:10', durationMins: 20, patientName: 'SIMMONS, Carol (Mrs)',     appointmentType: "Women's health",     status: 'Booked'       },
  { id: 'sm-17', columnId: 'malik', type: 'appointment', startTime: '13:30', durationMins: 20, patientName: 'MURRAY, David (Mr)',       appointmentType: 'Respiratory',        status: 'Running Late' },
  { id: 'sm-18', columnId: 'malik', type: 'available',   startTime: '13:50', durationMins: 10 },
  { id: 'sm-19', columnId: 'malik', type: 'appointment', startTime: '14:00', durationMins: 10, patientName: 'CLARKSON, Brian (Mr)',     appointmentType: 'Face-to-face',       status: 'Booked'       },
  { id: 'sm-20', columnId: 'malik', type: 'appointment', startTime: '14:10', durationMins: 20, patientName: 'WEBB, Karen (Mrs)',        appointmentType: 'Annual review',      status: 'Booked'       },
  { id: 'sm-21', columnId: 'malik', type: 'appointment', startTime: '14:30', durationMins: 20, patientName: 'MORRISON, Steven (Mr)',    appointmentType: 'Diabetes review',    status: 'Booked'       },
  { id: 'sm-22', columnId: 'malik', type: 'available',   startTime: '14:50', durationMins: 10 },
  { id: 'sm-23', columnId: 'malik', type: 'blocked',     startTime: '15:00', durationMins: 30, blockedLabel: 'Clinical meeting'        },
  { id: 'sm-24', columnId: 'malik', type: 'appointment', startTime: '15:30', durationMins: 10, patientName: 'RICHARDS, Anne (Mrs)',     appointmentType: 'Admin',              status: 'Booked'       },
  { id: 'sm-25', columnId: 'malik', type: 'appointment', startTime: '15:40', durationMins: 10, patientName: 'HOLLOWAY, Frank (Mr)',     appointmentType: 'Follow-up',          status: 'Booked'       },
  { id: 'sm-26', columnId: 'malik', type: 'available',   startTime: '15:50', durationMins: 10 },
  { id: 'sm-27', columnId: 'malik', type: 'appointment', startTime: '16:00', durationMins: 20, patientName: 'THORNTON, Dorothy (Mrs)',  appointmentType: 'Mental health',      status: 'Booked'       },
  { id: 'sm-28', columnId: 'malik', type: 'appointment', startTime: '16:20', durationMins: 10, patientName: 'LAWSON, George (Mr)',      appointmentType: 'Results review',     status: 'Booked'       },
  { id: 'sm-29', columnId: 'malik', type: 'blocked',     startTime: '16:30', durationMins: 30, blockedLabel: 'Admin'                   },

  // ─── Dr James Reid ───────────────────────────────────────────────────────
  { id: 'jr-01', columnId: 'reid', type: 'appointment', startTime: '09:00', durationMins: 10, patientName: 'NORRIS, Robert (Mr)',     appointmentType: 'Face-to-face',      status: 'Completed'    },
  { id: 'jr-02', columnId: 'reid', type: 'appointment', startTime: '09:10', durationMins: 10, patientName: 'FITZGERALD, Jean (Mrs)',  appointmentType: 'Face-to-face',      status: 'Completed'    },
  { id: 'jr-03', columnId: 'reid', type: 'appointment', startTime: '09:20', durationMins: 20, patientName: 'WHITMORE, Alan (Mr)',     appointmentType: 'Diabetes review',   status: 'Completed'    },
  { id: 'jr-04', columnId: 'reid', type: 'appointment', startTime: '09:40', durationMins: 10, patientName: 'OKAFOR, Brenda (Mrs)',    appointmentType: 'Follow-up',         status: 'Completed'    },
  { id: 'jr-05', columnId: 'reid', type: 'available',   startTime: '09:50', durationMins: 10 },
  { id: 'jr-06', columnId: 'reid', type: 'appointment', startTime: '10:00', durationMins: 10, patientName: 'HADLEY, Eric (Mr)',       appointmentType: 'Routine',           status: 'Cancelled'    },
  { id: 'jr-07', columnId: 'reid', type: 'appointment', startTime: '10:10', durationMins: 20, patientName: 'MACINTYRE, Fiona (Ms)',   appointmentType: 'Asthma review',     status: 'Arrived'      },
  { id: 'jr-08', columnId: 'reid', type: 'appointment', startTime: '10:30', durationMins: 10, patientName: 'STANTON, Harry (Mr)',     appointmentType: 'Face-to-face',      status: 'In Progress'  },
  { id: 'jr-09', columnId: 'reid', type: 'appointment', startTime: '10:40', durationMins: 20, patientName: 'THORNTON, Julie (Mrs)',   appointmentType: 'Medication review', status: 'Booked'       },
  { id: 'jr-10', columnId: 'reid', type: 'appointment', startTime: '11:00', durationMins: 10, patientName: 'GALLAGHER, Lewis (Mr)',   appointmentType: 'Mental health',     status: 'Booked'       },
  { id: 'jr-11', columnId: 'reid', type: 'blocked',     startTime: '11:10', durationMins: 30, blockedLabel: 'Home visits'            },
  { id: 'jr-12', columnId: 'reid', type: 'appointment', startTime: '11:40', durationMins: 20, patientName: 'POTTS, Rachel (Ms)',      appointmentType: "Women's health",    status: 'Booked'       },
  { id: 'jr-13', columnId: 'reid', type: 'blocked',     startTime: '12:00', durationMins: 60, blockedLabel: 'Lunch'                  },
  { id: 'jr-14', columnId: 'reid', type: 'appointment', startTime: '13:00', durationMins: 20, patientName: 'CLARK, Andrew (Mr)',      appointmentType: 'Respiratory',       status: 'Booked'       },
  { id: 'jr-15', columnId: 'reid', type: 'appointment', startTime: '13:20', durationMins: 10, patientName: 'PRYCE, Olivia (Mrs)',     appointmentType: 'Routine',           status: 'DNA'          },
  { id: 'jr-16', columnId: 'reid', type: 'appointment', startTime: '13:30', durationMins: 20, patientName: 'HASTINGS, Clive (Mr)',    appointmentType: 'Follow-up',         status: 'Running Late' },
  { id: 'jr-17', columnId: 'reid', type: 'available',   startTime: '13:50', durationMins: 10 },
  { id: 'jr-18', columnId: 'reid', type: 'appointment', startTime: '14:00', durationMins: 30, patientName: 'BARKER, Wendy (Mrs)',     appointmentType: 'Annual review',     status: 'Booked'       },
  { id: 'jr-19', columnId: 'reid', type: 'available',   startTime: '14:30', durationMins: 10 },
  { id: 'jr-20', columnId: 'reid', type: 'appointment', startTime: '14:40', durationMins: 20, patientName: 'BRENT, Nicholas (Mr)',    appointmentType: 'Hypertension',      status: 'Booked'       },
  { id: 'jr-21', columnId: 'reid', type: 'blocked',     startTime: '15:00', durationMins: 30, blockedLabel: 'Clinical meeting'       },
  { id: 'jr-22', columnId: 'reid', type: 'appointment', startTime: '15:30', durationMins: 10, patientName: 'TURNBULL, Sarah (Ms)',    appointmentType: 'Face-to-face',      status: 'Booked'       },
  { id: 'jr-23', columnId: 'reid', type: 'appointment', startTime: '15:40', durationMins: 20, patientName: 'WALSH, Dennis (Mr)',      appointmentType: 'Respiratory',       status: 'Booked'       },
  { id: 'jr-24', columnId: 'reid', type: 'available',   startTime: '16:00', durationMins: 10 },
  { id: 'jr-25', columnId: 'reid', type: 'appointment', startTime: '16:10', durationMins: 20, patientName: 'MERCER, Pauline (Mrs)',   appointmentType: 'Mental health',     status: 'Booked'       },
  { id: 'jr-26', columnId: 'reid', type: 'blocked',     startTime: '16:30', durationMins: 30, blockedLabel: 'Admin'                  },

  // ─── Amy Wilson — Practice Nurse ─────────────────────────────────────────
  { id: 'aw-01', columnId: 'wilson', type: 'appointment', startTime: '09:00', durationMins: 15, patientName: 'SUTHERLAND, Gail (Ms)',  appointmentType: "Women's health",    status: 'Completed'    },
  { id: 'aw-02', columnId: 'wilson', type: 'appointment', startTime: '09:15', durationMins: 15, patientName: 'YATES, Ian (Mr)',         appointmentType: 'Injection',         status: 'Completed'    },
  { id: 'aw-03', columnId: 'wilson', type: 'appointment', startTime: '09:30', durationMins: 15, patientName: 'CHAN, Beverley (Mrs)',    appointmentType: 'Wound care',        status: 'Completed'    },
  { id: 'aw-04', columnId: 'wilson', type: 'available',   startTime: '09:45', durationMins: 15 },
  { id: 'aw-05', columnId: 'wilson', type: 'appointment', startTime: '10:00', durationMins: 30, patientName: 'FERNANDEZ, Robin (Mr)',   appointmentType: 'Diabetes',          status: 'Completed'    },
  { id: 'aw-06', columnId: 'wilson', type: 'appointment', startTime: '10:30', durationMins: 15, patientName: 'HEWITT, Sandra (Mrs)',    appointmentType: 'Wound care',        status: 'In Progress'  },
  { id: 'aw-07', columnId: 'wilson', type: 'appointment', startTime: '10:45', durationMins: 15, patientName: 'BUTCHER, Owen (Mr)',      appointmentType: 'Vaccination',       status: 'Arrived'      },
  { id: 'aw-08', columnId: 'wilson', type: 'appointment', startTime: '11:00', durationMins: 15, patientName: 'HOPKINS, Tracey (Mrs)',   appointmentType: "Women's health",    status: 'Booked'       },
  { id: 'aw-09', columnId: 'wilson', type: 'appointment', startTime: '11:15', durationMins: 15, patientName: 'LONG, Barry (Mr)',        appointmentType: 'Vaccination',       status: 'DNA'          },
  { id: 'aw-10', columnId: 'wilson', type: 'blocked',     startTime: '11:30', durationMins: 30, blockedLabel: 'Protected learning time' },
  { id: 'aw-11', columnId: 'wilson', type: 'blocked',     startTime: '12:00', durationMins: 60, blockedLabel: 'Lunch'                  },
  { id: 'aw-12', columnId: 'wilson', type: 'appointment', startTime: '13:00', durationMins: 15, patientName: 'DEWHURST, Gillian (Mrs)', appointmentType: 'Asthma review',     status: 'Booked'       },
  { id: 'aw-13', columnId: 'wilson', type: 'appointment', startTime: '13:15', durationMins: 15, patientName: 'FORSYTH, Alec (Mr)',      appointmentType: 'ECG',               status: 'Booked'       },
  { id: 'aw-14', columnId: 'wilson', type: 'appointment', startTime: '13:30', durationMins: 30, patientName: 'ROWLEY, Helen (Mrs)',     appointmentType: 'New patient',       status: 'Booked'       },
  { id: 'aw-15', columnId: 'wilson', type: 'appointment', startTime: '14:00', durationMins: 15, patientName: 'MARSDEN, Colin (Mr)',     appointmentType: 'BP check',          status: 'Booked'       },
  { id: 'aw-16', columnId: 'wilson', type: 'appointment', startTime: '14:15', durationMins: 15, patientName: 'OLSEN, Jackie (Mrs)',     appointmentType: 'Vaccination',       status: 'Booked'       },
  { id: 'aw-17', columnId: 'wilson', type: 'blocked',     startTime: '14:30', durationMins: 30, blockedLabel: 'Admin / notes'          },
  { id: 'aw-18', columnId: 'wilson', type: 'appointment', startTime: '15:00', durationMins: 15, patientName: 'HAMMOND, Victor (Mr)',    appointmentType: 'Ear care',          status: 'Booked'       },
  { id: 'aw-19', columnId: 'wilson', type: 'appointment', startTime: '15:15', durationMins: 15, patientName: 'PROCTOR, Natalie (Ms)',   appointmentType: "Women's health",    status: 'Running Late' },
  { id: 'aw-20', columnId: 'wilson', type: 'appointment', startTime: '15:30', durationMins: 15, patientName: 'WHEATLEY, Ray (Mr)',      appointmentType: 'Blood test',        status: 'Booked'       },
  { id: 'aw-21', columnId: 'wilson', type: 'available',   startTime: '15:45', durationMins: 15 },
  { id: 'aw-22', columnId: 'wilson', type: 'appointment', startTime: '16:00', durationMins: 30, patientName: 'SOMMERS, Elaine (Mrs)',   appointmentType: 'Respiratory',       status: 'Booked'       },
  { id: 'aw-23', columnId: 'wilson', type: 'blocked',     startTime: '16:30', durationMins: 30, blockedLabel: 'Catch-up admin'         },

  // ─── Mark Douglas — Healthcare Assistant ─────────────────────────────────
  { id: 'md-01', columnId: 'douglas', type: 'appointment', startTime: '09:00', durationMins: 15, patientName: 'SHERWOOD, Paul (Mr)',    appointmentType: 'BP check',          status: 'Completed'    },
  { id: 'md-02', columnId: 'douglas', type: 'appointment', startTime: '09:15', durationMins: 15, patientName: 'GRIFFITHS, Molly (Ms)', appointmentType: 'Health check',      status: 'Completed'    },
  { id: 'md-03', columnId: 'douglas', type: 'appointment', startTime: '09:30', durationMins: 15, patientName: 'HOLT, Norman (Mr)',      appointmentType: 'Urinalysis',        status: 'Completed'    },
  { id: 'md-04', columnId: 'douglas', type: 'appointment', startTime: '09:45', durationMins: 15, patientName: 'ATKINS, Deborah (Mrs)', appointmentType: 'ECG',               status: 'Completed'    },
  { id: 'md-05', columnId: 'douglas', type: 'appointment', startTime: '10:00', durationMins: 15, patientName: 'TUCKER, Glenn (Mr)',     appointmentType: 'BP check',          status: 'In Progress'  },
  { id: 'md-06', columnId: 'douglas', type: 'appointment', startTime: '10:15', durationMins: 15, patientName: 'FOX, Harriet (Ms)',      appointmentType: 'Health check',      status: 'Arrived'      },
  { id: 'md-07', columnId: 'douglas', type: 'appointment', startTime: '10:30', durationMins: 15, patientName: 'BALDWIN, Scott (Mr)',    appointmentType: 'Pre-op',            status: 'Booked'       },
  { id: 'md-08', columnId: 'douglas', type: 'appointment', startTime: '10:45', durationMins: 15, patientName: 'COOK, Mandy (Ms)',       appointmentType: 'Admin',             status: 'Booked'       },
  { id: 'md-09', columnId: 'douglas', type: 'blocked',     startTime: '11:00', durationMins: 30, blockedLabel: 'Stock check / supplies' },
  { id: 'md-10', columnId: 'douglas', type: 'blocked',     startTime: '11:30', durationMins: 30, blockedLabel: 'Training'              },
  { id: 'md-11', columnId: 'douglas', type: 'blocked',     startTime: '12:00', durationMins: 60, blockedLabel: 'Lunch'                 },
  { id: 'md-12', columnId: 'douglas', type: 'appointment', startTime: '13:00', durationMins: 15, patientName: 'QUINN, Lynda (Mrs)',     appointmentType: 'Admin',             status: 'Booked'       },
  { id: 'md-13', columnId: 'douglas', type: 'appointment', startTime: '13:15', durationMins: 15, patientName: 'PARK, Oscar (Mr)',       appointmentType: 'BP check',          status: 'DNA'          },
  { id: 'md-14', columnId: 'douglas', type: 'appointment', startTime: '13:30', durationMins: 15, patientName: 'MILES, Vera (Mrs)',      appointmentType: 'Urinalysis',        status: 'Booked'       },
  { id: 'md-15', columnId: 'douglas', type: 'appointment', startTime: '13:45', durationMins: 15, patientName: 'ABBOTT, Cyril (Mr)',     appointmentType: 'Health check',      status: 'Booked'       },
  { id: 'md-16', columnId: 'douglas', type: 'blocked',     startTime: '14:00', durationMins: 60, blockedLabel: 'Administration & filing' },
  { id: 'md-17', columnId: 'douglas', type: 'appointment', startTime: '15:00', durationMins: 15, patientName: 'PALMER, Doris (Mrs)',    appointmentType: 'Health check',      status: 'Booked'       },
  { id: 'md-18', columnId: 'douglas', type: 'available',   startTime: '15:15', durationMins: 15 },
  { id: 'md-19', columnId: 'douglas', type: 'appointment', startTime: '15:30', durationMins: 15, patientName: 'SIMMONS, Frank (Mr)',    appointmentType: 'Urinalysis',        status: 'Booked'       },
  { id: 'md-20', columnId: 'douglas', type: 'appointment', startTime: '15:45', durationMins: 15, patientName: 'WALTON, Grace (Mrs)',    appointmentType: 'Pre-op',            status: 'Booked'       },
  { id: 'md-21', columnId: 'douglas', type: 'blocked',     startTime: '16:00', durationMins: 30, blockedLabel: 'Equipment prep'        },
  { id: 'md-22', columnId: 'douglas', type: 'blocked',     startTime: '16:30', durationMins: 30, blockedLabel: 'End of day admin'      },

  // ─── Phlebotomy Clinic ────────────────────────────────────────────────────
  { id: 'ph-01', columnId: 'phlebotomy', type: 'appointment', startTime: '09:00', durationMins: 10, patientName: 'BROWNE, Millicent (Mrs)', appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-02', columnId: 'phlebotomy', type: 'appointment', startTime: '09:10', durationMins: 10, patientName: 'CASEY, Tom (Mr)',          appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-03', columnId: 'phlebotomy', type: 'appointment', startTime: '09:20', durationMins: 10, patientName: 'GIBSON, Freda (Mrs)',      appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-04', columnId: 'phlebotomy', type: 'appointment', startTime: '09:30', durationMins: 10, patientName: 'BARNETT, Hugh (Mr)',       appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-05', columnId: 'phlebotomy', type: 'appointment', startTime: '09:40', durationMins: 10, patientName: 'CRISP, Stella (Mrs)',      appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-06', columnId: 'phlebotomy', type: 'available',   startTime: '09:50', durationMins: 10 },
  { id: 'ph-07', columnId: 'phlebotomy', type: 'appointment', startTime: '10:00', durationMins: 10, patientName: 'BANKS, Walter (Mr)',       appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-08', columnId: 'phlebotomy', type: 'appointment', startTime: '10:10', durationMins: 10, patientName: 'JENNINGS, Nora (Mrs)',     appointmentType: 'Blood test', status: 'Completed'    },
  { id: 'ph-09', columnId: 'phlebotomy', type: 'appointment', startTime: '10:20', durationMins: 10, patientName: 'WEBB, Marcus (Mr)',        appointmentType: 'Blood test', status: 'In Progress'  },
  { id: 'ph-10', columnId: 'phlebotomy', type: 'appointment', startTime: '10:30', durationMins: 10, patientName: 'HART, Cynthia (Mrs)',      appointmentType: 'Blood test', status: 'Arrived'      },
  { id: 'ph-11', columnId: 'phlebotomy', type: 'appointment', startTime: '10:40', durationMins: 10, patientName: 'PLATT, Stanley (Mr)',      appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-12', columnId: 'phlebotomy', type: 'appointment', startTime: '10:50', durationMins: 10, patientName: 'LYNCH, Marjorie (Mrs)',    appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-13', columnId: 'phlebotomy', type: 'appointment', startTime: '11:00', durationMins: 10, patientName: 'HORTON, Derek (Mr)',       appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-14', columnId: 'phlebotomy', type: 'appointment', startTime: '11:10', durationMins: 10, patientName: 'SANDERSON, Rosie (Ms)',    appointmentType: 'Blood test', status: 'DNA'          },
  { id: 'ph-15', columnId: 'phlebotomy', type: 'appointment', startTime: '11:20', durationMins: 10, patientName: 'WHITFIELD, Len (Mr)',      appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-16', columnId: 'phlebotomy', type: 'available',   startTime: '11:30', durationMins: 10 },
  { id: 'ph-17', columnId: 'phlebotomy', type: 'appointment', startTime: '11:40', durationMins: 10, patientName: 'CARROLL, Agnes (Mrs)',     appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-18', columnId: 'phlebotomy', type: 'appointment', startTime: '11:50', durationMins: 10, patientName: 'PERKINS, Roy (Mr)',        appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-19', columnId: 'phlebotomy', type: 'blocked',     startTime: '12:00', durationMins: 60, blockedLabel: 'Lunch / centrifuge processing' },
  { id: 'ph-20', columnId: 'phlebotomy', type: 'appointment', startTime: '13:00', durationMins: 10, patientName: 'CHAMBERLAIN, Edith (Mrs)', appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-21', columnId: 'phlebotomy', type: 'appointment', startTime: '13:10', durationMins: 10, patientName: 'DRUMMOND, Angus (Mr)',     appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-22', columnId: 'phlebotomy', type: 'appointment', startTime: '13:20', durationMins: 10, patientName: 'CHAPMAN, Daisy (Ms)',      appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-23', columnId: 'phlebotomy', type: 'appointment', startTime: '13:30', durationMins: 10, patientName: 'ROSS, Frederick (Mr)',     appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-24', columnId: 'phlebotomy', type: 'appointment', startTime: '13:40', durationMins: 10, patientName: 'ELLISON, Violet (Mrs)',    appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-25', columnId: 'phlebotomy', type: 'appointment', startTime: '13:50', durationMins: 10, patientName: 'PAYNE, Archie (Mr)',       appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-26', columnId: 'phlebotomy', type: 'appointment', startTime: '14:00', durationMins: 10, patientName: 'NASH, Lilian (Mrs)',       appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-27', columnId: 'phlebotomy', type: 'appointment', startTime: '14:10', durationMins: 10, patientName: 'POWELL, Sidney (Mr)',      appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-28', columnId: 'phlebotomy', type: 'appointment', startTime: '14:20', durationMins: 10, patientName: 'VERNON, Hilda (Mrs)',      appointmentType: 'Blood test', status: 'Running Late' },
  { id: 'ph-29', columnId: 'phlebotomy', type: 'available',   startTime: '14:30', durationMins: 10 },
  { id: 'ph-30', columnId: 'phlebotomy', type: 'appointment', startTime: '14:40', durationMins: 10, patientName: 'BURTON, Cecil (Mr)',       appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-31', columnId: 'phlebotomy', type: 'appointment', startTime: '14:50', durationMins: 10, patientName: 'SUTTON, Ida (Mrs)',        appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-32', columnId: 'phlebotomy', type: 'blocked',     startTime: '15:00', durationMins: 60, blockedLabel: 'Batch processing'       },
  { id: 'ph-33', columnId: 'phlebotomy', type: 'appointment', startTime: '16:00', durationMins: 10, patientName: 'HARTLEY, Alice (Mrs)',     appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-34', columnId: 'phlebotomy', type: 'appointment', startTime: '16:10', durationMins: 10, patientName: 'WESTON, Percy (Mr)',       appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-35', columnId: 'phlebotomy', type: 'appointment', startTime: '16:20', durationMins: 10, patientName: 'BOOTH, Ethel (Mrs)',       appointmentType: 'Blood test', status: 'Booked'       },
  { id: 'ph-36', columnId: 'phlebotomy', type: 'blocked',     startTime: '16:30', durationMins: 30, blockedLabel: 'End of day processing'  },

  // ─── Diabetes Clinic ──────────────────────────────────────────────────────
  { id: 'dc-01', columnId: 'diabetes', type: 'appointment', startTime: '09:00', durationMins: 30, patientName: 'STAFFORD, Eleanor (Mrs)', appointmentType: 'Diabetes review',    status: 'Completed'    },
  { id: 'dc-02', columnId: 'diabetes', type: 'appointment', startTime: '09:30', durationMins: 30, patientName: 'FROST, Malcolm (Mr)',      appointmentType: 'Diabetes review',    status: 'Completed'    },
  { id: 'dc-03', columnId: 'diabetes', type: 'appointment', startTime: '10:00', durationMins: 30, patientName: 'DUNBAR, Heather (Mrs)',    appointmentType: 'Diabetes education', status: 'In Progress'  },
  { id: 'dc-04', columnId: 'diabetes', type: 'appointment', startTime: '10:30', durationMins: 30, patientName: 'SEYMOUR, Robert (Mr)',     appointmentType: 'Insulin review',     status: 'Arrived'      },
  { id: 'dc-05', columnId: 'diabetes', type: 'appointment', startTime: '11:00', durationMins: 30, patientName: 'BARTON, Gladys (Mrs)',     appointmentType: 'Diabetes review',    status: 'Booked'       },
  { id: 'dc-06', columnId: 'diabetes', type: 'blocked',     startTime: '11:30', durationMins: 30, blockedLabel: 'MDT discussion'          },
  { id: 'dc-07', columnId: 'diabetes', type: 'blocked',     startTime: '12:00', durationMins: 60, blockedLabel: 'Lunch'                   },
  { id: 'dc-08', columnId: 'diabetes', type: 'appointment', startTime: '13:00', durationMins: 30, patientName: 'KINGSLEY, Albert (Mr)',    appointmentType: 'New patient',        status: 'Booked'       },
  { id: 'dc-09', columnId: 'diabetes', type: 'appointment', startTime: '13:30', durationMins: 30, patientName: 'DOYLE, Mabel (Mrs)',       appointmentType: 'Follow-up',          status: 'Booked'       },
  { id: 'dc-10', columnId: 'diabetes', type: 'appointment', startTime: '14:00', durationMins: 45, patientName: 'FOWLER, Reginald (Mr)',    appointmentType: 'Insulin review',     status: 'Booked'       },
  { id: 'dc-11', columnId: 'diabetes', type: 'available',   startTime: '14:45', durationMins: 15 },
  { id: 'dc-12', columnId: 'diabetes', type: 'appointment', startTime: '15:00', durationMins: 30, patientName: 'BRADLEY, Constance (Mrs)', appointmentType: 'Specialist review',  status: 'Booked'       },
  { id: 'dc-13', columnId: 'diabetes', type: 'appointment', startTime: '15:30', durationMins: 30, patientName: 'MARSH, Herbert (Mr)',      appointmentType: 'Foot care',          status: 'Booked'       },
  { id: 'dc-14', columnId: 'diabetes', type: 'appointment', startTime: '16:00', durationMins: 30, patientName: 'KEATS, Winifred (Mrs)',    appointmentType: 'Diabetes education', status: 'Booked'       },
  { id: 'dc-15', columnId: 'diabetes', type: 'blocked',     startTime: '16:30', durationMins: 30, blockedLabel: 'Clinical admin'          },
];
