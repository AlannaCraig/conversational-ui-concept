/**
 * PatientSummaryCard Component
 *
 * Large data view showing patient summary with enhanced patient header and widget grid.
 * Widget content is populated by the AI summarization agent via /api/summarize-patient.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PatientIcon, MoreVerticalIcon, ArrowRightIcon } from '@/components/icons';
import { ACTIVE_PATIENT, PATIENT_HARPER, PATIENT_ELLISON, type Patient } from '@/lib/patientData';
import { PatientEntryTile } from '@/components/ui/PatientEntryTile';
import { AllergyChip, type AllergyStatus } from '@/components/ui/AllergyChip';
import { LifestyleMetricTile } from '@/components/ui/LifestyleMetricTile';

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

const WIDGETS = [
  { id: 'summary', title: 'Summary' },
  { id: 'encounters', title: 'Recent encounters' },
  { id: 'activity', title: 'Recent activity' },
  { id: 'lifestyle', title: 'Lifestyle & examinations' },
  { id: 'tests', title: 'Recent tests' },
  { id: 'medications', title: 'Current medications' },
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
      {title === 'Summary'
        ? <SummaryContent text={summary!} />
        : <BulletOrParagraph text={summary!} />
      }
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

// Summary widget: bullet list at top, then narrative paragraphs
function SummaryContent({ text }: { text: string }) {
  const lines = text.split('\n');
  const bullets: string[] = [];
  const paragraphs: string[] = [];
  let inParagraphs = false;

  for (const line of lines) {
    if (!line.trim()) { inParagraphs = true; continue; }
    if (!inParagraphs && line.startsWith('•')) {
      bullets.push(line.slice(1).trim());
    } else {
      inParagraphs = true;
      if (line.trim()) paragraphs.push(line.trim());
    }
  }

  return (
    <div className="space-y-3">
      {bullets.length > 0 && (
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-text-primary flex-shrink-0" />
              <RichText text={b} className="text-sm text-text-primary leading-relaxed" boldColor="var(--accent1-main)" />
            </li>
          ))}
        </ul>
      )}
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-text-primary leading-relaxed">
          <RichText text={p} boldColor="var(--accent1-main)" />
        </p>
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

function EncountersContent({ patientId }: { patientId: string }) {
  const patient = PATIENT_REGISTRY[patientId] ?? ACTIVE_PATIENT;
  const encounters = [...patient.encounters].reverse(); // most recent first

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      {encounters.map((enc, i) => (
        <PatientEntryTile
          key={i}
          title={encounterLabel(enc.type)}
          subtitle={`${enc.date} at ${enc.time}`}
          gpName={enc.clinician}
        />
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
      className="flex flex-col gap-2"
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
        <PatientEntryTile
          key={i}
          title={med.name}
          subtitle={`${med.dose} ${med.frequency}`}
          date={med.prescribedDate}
          gpName={med.prescriber}
        />
      ))}
    </motion.div>
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

  return (
    <div className={`grid grid-cols-3 gap-6 pb-10 ${className}`} style={{ gridAutoRows: 'auto' }}>
      {WIDGETS.map((widget, index) => (
        <motion.div
          key={widget.id}
          className="border border-border bg-primary-contrast rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          {/* Widget Header */}
          <div className="p-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary flex-1">
              {widget.title}
            </h3>

            {/* Action buttons */}
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

          {/* Breaker line */}
          <div className="border-t border-border" />

          {/* Widget content — 16px padding all sides */}
          <div className="p-4">
            {widget.title === 'Recent encounters' ? (
              <EncountersContent patientId={resolvedPatientId} />
            ) : widget.title === 'Current medications' ? (
              <MedicationsContent patientId={resolvedPatientId} />
            ) : widget.title === 'Lifestyle & examinations' ? (
              <LifestyleContent patientId={resolvedPatientId} />
            ) : (
              <WidgetContent title={widget.title} patientId={resolvedPatientId} />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
