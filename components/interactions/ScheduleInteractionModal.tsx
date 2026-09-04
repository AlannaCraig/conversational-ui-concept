'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui';
import { TaskIcon, RepeatIcon, ReportIcon, PatientIcon, CalendarIcon, SearchIcon } from '@/components/icons';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InteractionType = 'appointment' | 'task' | 'follow-up' | 'contact' | 'review';

interface ScheduleInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
  contextPatient?: { name: string; chiNumber: string; dob?: string; phone?: string } | null;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PATIENTS = [
  { id: 'p-001', name: 'WALSH, Peter (Mr)',        dob: '14/03/1958', chiNumber: '312748 5091', phone: '07891 234 560' },
  { id: 'p-002', name: 'DOBSON, Irene (Mrs)',       dob: '22/07/1941', chiNumber: '450619 2837', phone: '07723 456 781' },
  { id: 'p-003', name: 'HARTLEY, Charles (Mr)',     dob: '05/11/1965', chiNumber: '871304 6152', phone: '07654 321 098' },
  { id: 'p-004', name: 'PATEL, Susan (Mrs)',        dob: '30/01/1972', chiNumber: '629015 3874', phone: '07512 876 543' },
  { id: 'p-005', name: 'HOLMES, Margaret (Mrs)',    dob: '18/09/1953', chiNumber: '483920 1754', phone: '07832 156 490' },
  { id: 'p-006', name: 'CRAWFORD, Thomas (Mr)',     dob: '27/06/1980', chiNumber: '261083 7492', phone: '07910 244 033' },
  { id: 'p-007', name: 'FARROW, Nina (Ms)',         dob: '09/12/1989', chiNumber: '739452 8163', phone: '07741 882 317' },
  { id: 'p-008', name: 'ASHWORTH, Linda (Mrs)',     dob: '03/04/1967', chiNumber: '193507 4826', phone: '07346 890 123' },
  { id: 'p-009', name: 'BAINES, Christopher (Mr)', dob: '16/08/1956', chiNumber: '748261 0935', phone: '07867 012 345' },
  { id: 'p-010', name: 'MURRAY, David (Mr)',        dob: '11/02/1948', chiNumber: '927146 3580', phone: '07712 678 901' },
  { id: 'p-011', name: 'CLARKSON, Brian (Mr)',      dob: '20/05/1974', chiNumber: '236874 1059', phone: '07634 890 123' },
  { id: 'p-012', name: 'NEVILLE, Patricia (Mrs)',   dob: '07/10/1963', chiNumber: '384920 6751', phone: '07478 234 567' },
  { id: 'p-013', name: 'REED, James (Mr)',          dob: '25/04/1977', chiNumber: '519083 2647', phone: '07558 123 456' },
  { id: 'p-014', name: 'PORTER, Angela (Ms)',       dob: '12/09/1985', chiNumber: '672341 8950', phone: '07799 345 678' },
  { id: 'p-015', name: 'THORNTON, William (Mr)',    dob: '03/06/1960', chiNumber: '845162 3097', phone: '07621 567 890' },
  { id: 'p-016', name: 'MORRISON, Steven (Mr)',     dob: '17/04/1969', chiNumber: '673041 8295', phone: '07378 234 567' },
  { id: 'p-017', name: 'HARDY, Michael (Mr)',       dob: '02/11/1955', chiNumber: '592317 8046', phone: '07523 669 410' },
];

const STAFF_MEMBERS = [
  { id: 'me',       name: 'Dr Sarah Malik',      role: 'GP',                   initials: 'SM' },
  { id: 'reid',     name: 'Dr James Reid',       role: 'GP',                   initials: 'JR' },
  { id: 'wilson',   name: 'Amy Wilson',          role: 'Practice Nurse',       initials: 'AW' },
  { id: 'douglas',  name: 'Mark Douglas',        role: 'Healthcare Assistant', initials: 'MD' },
  { id: 'jones',    name: 'Helen Jones',         role: 'Pharmacist',           initials: 'HJ' },
  { id: 'admin',    name: 'Reception / Admin',   role: 'Admin',                initials: 'RA' },
];

// ─── Interaction type config ──────────────────────────────────────────────────

interface TypeConfig {
  id: InteractionType;
  label: string;
  description: string;
  requiresPatient: boolean;
  icon: React.ReactNode;
}

const INTERACTION_TYPES: TypeConfig[] = [
  {
    id: 'appointment',
    label: 'Appointment',
    description: 'Patient appointment with a clinician',
    requiresPatient: true,
    icon: <CalendarIcon size={18} className="text-text-secondary" />,
  },
  {
    id: 'task',
    label: 'Task / work',
    description: 'Action to be completed, e.g. referral letter, review',
    requiresPatient: false,
    icon: <TaskIcon size={18} className="text-text-secondary" />,
  },
  {
    id: 'follow-up',
    label: 'Follow-up',
    description: 'Review or check-in at a future date',
    requiresPatient: true,
    icon: <RepeatIcon size={18} className="text-text-secondary" />,
  },
  {
    id: 'contact',
    label: 'Contact patient',
    description: 'Phone call or other direct patient contact',
    requiresPatient: true,
    icon: <PatientIcon size={18} className="text-text-secondary" />,
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Clinical or admin review, e.g. results, letters',
    requiresPatient: false,
    icon: <ReportIcon size={18} className="text-text-secondary" />,
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
      {children}
    </p>
  );
}

function PatientPill({ name, onClear }: { name: string; onClear: () => void }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
      {name}
      <button
        onClick={onClear}
        style={{ display: 'flex', alignItems: 'center', padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        aria-label="Remove patient"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

// ─── Modal content ────────────────────────────────────────────────────────────

function ScheduleInteractionModalContent({
  onClose,
  onBookAppointment,
  contextPatient,
}: {
  onClose: () => void;
  onBookAppointment: () => void;
  contextPatient?: { name: string; chiNumber: string; dob?: string; phone?: string } | null;
}) {
  type Step = 'type' | 'patient' | 'details' | 'done';
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<InteractionType | null>(null);
  const [description, setDescription] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof MOCK_PATIENTS[0] | null>(
    contextPatient
      ? { id: 'ctx', name: contextPatient.name, chiNumber: contextPatient.chiNumber, dob: contextPatient.dob ?? '', phone: contextPatient.phone ?? '' }
      : null
  );
  const [assignedTo, setAssignedTo] = useState(STAFF_MEMBERS[0].id);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const typeConfig = INTERACTION_TYPES.find(t => t.id === selectedType);
  const needsPatient = typeConfig?.requiresPatient ?? false;

  const patientResults = patientSearch.trim().length >= 2
    ? MOCK_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.chiNumber.replace(/\s/g, '').includes(patientSearch.replace(/\s/g, '')) ||
        p.dob.includes(patientSearch)
      ).slice(0, 6)
    : [];

  function handleSelectType(type: InteractionType) {
    setSelectedType(type);
    if (type === 'appointment') {
      onClose();
      onBookAppointment();
      return;
    }
    const cfg = INTERACTION_TYPES.find(t => t.id === type)!;
    // Skip patient step if context patient already set, or type doesn't require patient
    if (cfg.requiresPatient && !contextPatient && !selectedPatient) {
      setStep('patient');
    } else {
      setStep('details');
    }
  }

  function handleSelectPatient(p: typeof MOCK_PATIENTS[0]) {
    setSelectedPatient(p);
    setPatientSearch('');
    setStep('details');
  }

  function handleSubmit() {
    setStep('done');
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 40, padding: '0 12px', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--background)',
    fontSize: 13, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
  };

  const canSubmit = !!(description.trim() || selectedType);

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 9990 }} onClick={onClose} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 9991, width: 520, maxWidth: 'calc(100vw - 32px)',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
        background: 'var(--background)', borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0, height: 52, padding: '0 16px 0 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          {step !== 'type' && step !== 'done' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                leadingIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>}
                onClick={() => {
                  if (step === 'patient') setStep('type');
                  else if (step === 'details') setStep(needsPatient && !contextPatient ? 'patient' : 'type');
                }}
              >
                Back
              </Button>
              <div style={{ width: 1, height: 16, background: 'var(--border)', flexShrink: 0 }} />
            </>
          )}
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
            {step === 'type'    ? 'Schedule an interaction' :
             step === 'patient' ? 'Who is this for?' :
             step === 'details' ? 'Interaction details' :
             'Scheduled'}
          </span>
          <Button variant="icon" size="xs" style={{ border: 'none', background: 'transparent' }} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </Button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }} className="conversation-scroll">

          {/* Step: type */}
          {step === 'type' && (
            <>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>What needs to happen?</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Choose the type of interaction to schedule.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {INTERACTION_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type.id)}
                    className="hover:bg-hover transition-colors"
                    style={{
                      width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14,
                      background: selectedType === type.id ? 'var(--background-soft)' : 'var(--background)',
                      border: '1px solid ' + (selectedType === type.id ? 'var(--primary-main)' : 'var(--border)'),
                      borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: 'var(--background-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {type.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{type.label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{type.description}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--text-secondary)' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step: patient */}
          {step === 'patient' && (
            <>
              {selectedPatient ? (
                <div style={{ marginBottom: 16 }}>
                  <PatientPill name={selectedPatient.name} onClear={() => setSelectedPatient(null)} />
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', marginBottom: 8 }}>
                    <SearchIcon size={14} className="text-text-secondary flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search by name, CHI number or date of birth…"
                      value={patientSearch}
                      onChange={e => setPatientSearch(e.target.value)}
                      style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--text-primary)' }}
                    />
                  </div>
                  {patientResults.length > 0 && (
                    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
                      {patientResults.map((p, i) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPatient(p)}
                          style={{
                            width: '100%', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2,
                            background: 'transparent', border: 'none',
                            borderBottom: i < patientResults.length - 1 ? '1px solid var(--border)' : 'none',
                            cursor: 'pointer', textAlign: 'left',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--hover)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.dob} · {p.chiNumber}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {patientSearch.length >= 2 && patientResults.length === 0 && (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '12px 0' }}>No patients found.</p>
                  )}
                </>
              )}
              {selectedPatient && (
                <Button variant="secondary" size="sm" onClick={() => setStep('details')}>
                  Continue
                </Button>
              )}
              {typeConfig?.requiresPatient === false || (
                <button
                  onClick={() => setStep('details')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 8 }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'underline' }}>Continue without a patient</span>
                </button>
              )}
            </>
          )}

          {/* Step: details */}
          {step === 'details' && (
            <>
              {/* Context chips */}
              {(selectedType || selectedPatient) && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                  {selectedType && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {INTERACTION_TYPES.find(t => t.id === selectedType)?.label}
                    </span>
                  )}
                  {selectedPatient && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, paddingInline: 10, borderRadius: 20, border: '1px solid var(--border)', background: 'var(--background-soft)', fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {selectedPatient.name}
                    </span>
                  )}
                </div>
              )}

              {/* What needs to happen */}
              <div style={{ marginBottom: 16 }}>
                <SectionLabel>What needs to happen</SectionLabel>
                <textarea
                  autoFocus
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Briefly describe what needs to happen…"
                  rows={3}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'var(--background)',
                    fontSize: 13, color: 'var(--text-primary)', outline: 'none',
                    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Assign to */}
              <div style={{ marginBottom: 16 }}>
                <SectionLabel>Assign to</SectionLabel>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {STAFF_MEMBERS.map(s => (
                    <option key={s.id} value={s.id}>{s.id === 'me' ? `Me (${s.name})` : `${s.name} — ${s.role}`}</option>
                  ))}
                </select>
              </div>

              {/* Due / scheduled */}
              <div style={{ marginBottom: 16 }}>
                <SectionLabel>Due / scheduled</SectionLabel>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  {(['Today', 'Tomorrow', 'This week', 'Next week', 'In 1 month', 'In 3 months'] as const).map(label => (
                    <button
                      key={label}
                      onClick={() => setDueDate(label)}
                      style={{
                        height: 28, paddingInline: 10, borderRadius: 6, cursor: 'pointer', fontSize: 12,
                        border: '1px solid ' + (dueDate === label ? 'var(--primary-main)' : 'var(--border)'),
                        background: dueDate === label ? 'var(--primary-main)' : 'var(--background)',
                        color: dueDate === label ? 'var(--primary-contrast)' : 'var(--text-secondary)',
                        fontWeight: dueDate === label ? 600 : 400,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <SectionLabel>Notes <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></SectionLabel>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any relevant notes or context…"
                  rows={3}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'var(--background)',
                    fontSize: 13, color: 'var(--text-primary)', outline: 'none',
                    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5,
                  }}
                />
              </div>
            </>
          )}

          {/* Step: done */}
          {step === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 16, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success-dark)' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Interaction scheduled</p>
                {selectedPatient && <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedPatient.name}</p>}
                {description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{description}</p>}
                {dueDate && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Due: {dueDate}</p>}
              </div>
              <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
            </div>
          )}

        </div>

        {/* Footer — details step only */}
        {step === 'details' && (
          <div style={{ flexShrink: 0, padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="md" disabled={!canSubmit} onClick={handleSubmit}>
              Schedule interaction
            </Button>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}

// ─── Mount wrapper ────────────────────────────────────────────────────────────

export function ScheduleInteractionModal({ isOpen, onClose, onBookAppointment, contextPatient }: ScheduleInteractionModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isOpen) return null;
  return (
    <ScheduleInteractionModalContent
      onClose={onClose}
      onBookAppointment={onBookAppointment}
      contextPatient={contextPatient}
    />
  );
}
