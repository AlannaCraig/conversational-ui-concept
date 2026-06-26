'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface MetricHistoryPoint {
  date: string;
  value: string;
}

export interface LifestyleMetricTileProps {
  label: string;
  value: string;
  unit: string;
  date: string;
  trend: MetricTrend;
  history?: MetricHistoryPoint[];
}

function TrendArrow({ trend }: { trend: MetricTrend }) {
  if (trend === 'neutral') return null;
  const isUp = trend === 'up';
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-text-secondary flex-shrink-0">
      {isUp ? (
        <path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill="currentColor" />
      ) : (
        <path d="M12 20L20 12H15V4H9V12H4L12 20Z" fill="currentColor" />
      )}
    </svg>
  );
}

function TruncatedLabel({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const el = ref.current;
    if (el) setTruncated(el.scrollWidth > el.clientWidth);
  });

  const handleMouseEnter = () => {
    if (!truncated || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    setVisible(true);
  };

  const tooltip = visible && mounted && truncated ? createPortal(
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
      <span ref={ref} className="text-sm text-text-primary truncate" onMouseEnter={handleMouseEnter} onMouseLeave={() => setVisible(false)}>
        {label}
      </span>
      {tooltip}
    </>
  );
}

// ── Spark chart dialog ──────────────────────────────────────────────────────

function isBPMetric(label: string) {
  const l = label.toLowerCase();
  return l === 'bp' || l.includes('blood pressure') || l.includes('postural drop');
}

function parseNumeric(value: string): number {
  // For BP values like "150/90" take systolic; strip non-numeric suffixes
  const slashIdx = value.indexOf('/');
  const raw = slashIdx !== -1 ? value.slice(0, slashIdx) : value;
  return parseFloat(raw.replace(/[^\d.]/g, ''));
}

function parseDiastolic(value: string): number | null {
  const slashIdx = value.indexOf('/');
  if (slashIdx === -1) return null;
  return parseFloat(value.slice(slashIdx + 1).replace(/[^\d.]/g, ''));
}

interface SparkChartProps {
  label: string;
  unit: string;
  history: MetricHistoryPoint[];
}

function SparkChart({ label, unit, history }: SparkChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const bp = isBPMetric(label) && history.some(h => h.value.includes('/'));

  const width = 400;
  const height = 200;
  const paddingLeft = 50;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 44;
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  const primaryValues = history.map(h => parseNumeric(h.value));
  const diastolicValues = bp ? history.map(h => parseDiastolic(h.value) ?? 0) : [];

  const allValues = bp ? [...primaryValues, ...diastolicValues] : primaryValues;
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = Math.max((rawMax - rawMin) * 0.2, 5);
  const minValue = Math.floor(rawMin - padding);
  const maxValue = Math.ceil(rawMax + padding);
  const range = maxValue - minValue || 1;

  function toPoint(val: number, index: number) {
    const x = paddingLeft + (index / Math.max(history.length - 1, 1)) * graphWidth;
    const y = paddingTop + ((maxValue - val) / range) * graphHeight;
    return { x, y };
  }

  const primaryPoints = primaryValues.map((v, i) => ({ ...toPoint(v, i), value: history[i].value, date: history[i].date }));
  const diastolicPoints = bp ? diastolicValues.map((v, i) => ({ ...toPoint(v, i), value: history[i].value, date: history[i].date })) : [];

  const primaryPath = primaryPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const diastolicPath = diastolicPoints.length > 1 ? diastolicPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') : '';

  // Y-axis tick values: 5 evenly spaced
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round(minValue + (i / 4) * range));

  return (
    <div className="relative inline-block" style={{ overflow: 'visible' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxWidth: '400px', overflow: 'visible' }}>
        {/* Y-axis */}
        <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="var(--primary-light)" strokeWidth="1" />
        {/* X-axis */}
        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="var(--primary-light)" strokeWidth="1" />

        {/* Y-axis labels */}
        {yTicks.map(val => {
          const y = paddingTop + ((maxValue - val) / range) * graphHeight;
          return (
            <g key={`y-${val}`}>
              <line x1={paddingLeft - 4} y1={y} x2={paddingLeft} y2={y} stroke="var(--primary-light)" strokeWidth="1" />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--text-secondary)" fontFamily="var(--font-geist-sans)">{val}</text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {primaryPoints.map((p, i) => (
          <g key={`x-${i}`}>
            <line x1={p.x} y1={height - paddingBottom} x2={p.x} y2={height - paddingBottom + 4} stroke="var(--primary-light)" strokeWidth="1" />
            <text x={p.x} y={height - paddingBottom + 16} textAnchor="middle" fontSize="11" fill="var(--text-secondary)" fontFamily="var(--font-geist-sans)">{p.date}</text>
          </g>
        ))}

        {/* Diastolic line */}
        {diastolicPath && (
          <path d={diastolicPath} fill="none" stroke="var(--primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        )}

        {/* Primary line */}
        <path d={primaryPath} fill="none" stroke="var(--primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Diastolic anchor points */}
        {diastolicPoints.map((p, i) => (
          <g key={`dp-${i}`}>
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? '4' : '3'} fill="var(--primary-main)" opacity="0.5" pointerEvents="none" style={{ transition: 'r 0.2s ease' }} />
          </g>
        ))}

        {/* Primary anchor points */}
        {primaryPoints.map((p, i) => (
          <g key={`pp-${i}`}>
            <circle cx={p.x} cy={p.y} r="12" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? '4' : '3'} fill="var(--primary-main)" pointerEvents="none" style={{ transition: 'r 0.2s ease' }} />
          </g>
        ))}

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <foreignObject x={primaryPoints[hoveredPoint].x - 55} y={primaryPoints[hoveredPoint].y - 52} width="110" height="50" style={{ overflow: 'visible' }}>
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="flex justify-center pointer-events-none">
              <div className="text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg relative" style={{ backgroundColor: 'var(--primary-dark)', color: 'var(--primary-contrast)' }}>
                {primaryPoints[hoveredPoint].date} — {primaryPoints[hoveredPoint].value}{unit ? ` ${unit}` : ''}
                <div className="absolute w-0 h-0 left-1/2 -translate-x-1/2 top-full" style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--primary-dark)' }} />
              </div>
            </motion.div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}

interface SparkDialogProps {
  label: string;
  unit: string;
  history: MetricHistoryPoint[] | null;
  anchorRect: DOMRect;
  onClose: () => void;
}

function SparkDialog({ label, unit, history, anchorRect, onClose }: SparkDialogProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; openUpward: boolean } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Once mounted, measure dialog and compute smart position
  useEffect(() => {
    if (!mounted) return;
    const dialogWidth = 400;
    // Estimate dialog height: ~280px with chart, ~120px empty state
    const estimatedHeight = (!history || history.length === 0) ? 160 : 380;
    const gap = 8;
    const edgePad = 12;

    const spaceBelow = window.innerHeight - anchorRect.bottom - gap;
    const spaceAbove = anchorRect.top - gap;
    const openUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    const top = openUpward
      ? anchorRect.top - gap - estimatedHeight
      : anchorRect.bottom + gap;

    // Align left edge with tile, but clamp within viewport
    const left = Math.max(
      edgePad,
      Math.min(anchorRect.left, window.innerWidth - dialogWidth - edgePad)
    );

    setPos({ top, left, openUpward });
  }, [mounted, anchorRect, history]);

  if (!mounted || !pos) return null;

  const animateFrom = pos.openUpward ? { opacity: 0, y: 6 } : { opacity: 0, y: -6 };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9990]" onClick={onClose} />
      <motion.div
        ref={dialogRef}
        initial={animateFrom}
        animate={{ opacity: 1, y: 0 }}
        exit={animateFrom}
        transition={{ duration: 0.18 }}
        className="fixed z-[9991] bg-primary-contrast border border-border rounded-lg shadow-xl"
        style={{ top: pos.top, left: pos.left, width: 400 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-text-primary">{label}</p>
            <p className="text-xs text-text-secondary mt-0.5">Last 6 months</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-hover transition-colors text-text-secondary hover:text-text-primary" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {!history || history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <p className="text-sm font-medium text-text-primary">No recent data available</p>
          </div>
        ) : (
          <>
            <div className="px-4 pt-4">
              <SparkChart label={label} unit={unit} history={history} />
            </div>
            {/* Two-column readings list */}
            <div className="px-4 pb-4 pt-3 border-t border-border mt-3">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {history.map((h, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-text-secondary whitespace-nowrap">{h.date}</span>
                    <span className="text-xs font-medium text-text-primary whitespace-nowrap">
                      {h.value}{unit ? ` ${unit}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>,
    document.body
  );
}

// ── Main tile ───────────────────────────────────────────────────────────────

export function LifestyleMetricTile({ label, value, unit, date, trend, history }: LifestyleMetricTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const handleClick = () => {
    if (!tileRef.current) return;
    setAnchorRect(tileRef.current.getBoundingClientRect());
    setDialogOpen(true);
  };

  return (
    <>
      <div
        ref={tileRef}
        onClick={handleClick}
        className="bg-primary-contrast border border-border rounded-lg px-2.5 py-2 select-none cursor-pointer hover:bg-hover transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <TruncatedLabel label={label} />
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span className="text-sm font-medium text-text-primary leading-none">{value}</span>
            {unit && <span className="text-xs text-text-primary">{unit}</span>}
            <TrendArrow trend={trend} />
          </div>
        </div>
        <hr className="border-border mt-1.5" />
        <span className="text-xs text-text-secondary mt-1.5 block">{date}</span>
      </div>

      {dialogOpen && anchorRect && (
        <SparkDialog
          label={label}
          unit={unit}
          history={history ?? null}
          anchorRect={anchorRect}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
