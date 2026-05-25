/**
 * LineGraphCard Component
 *
 * Displays a line graph visualization for blood pressure readings over 6 months.
 * Uses system date to calculate the time period dynamically.
 *
 * Color tokens:
 * - Line & anchor points: primary-main (#0E0E0C)
 * - Axis lines: primary-light (#D8D2C6)
 * - Background: primary-contrast (#FAF8F2)
 * - Border: border (#D5CFBD)
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

interface LineGraphCardProps {
  className?: string;
}

// Generate 6 months of data based on current date
function generateDataPoints() {
  const today = new Date();
  const dataPoints = [];

  // Generate 6 data points (last 6 months)
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.toLocaleDateString('en-US', { month: 'short' });

    // Blood pressure readings: systolic (140-150) and diastolic (88-95)
    const systolic = 140 + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 5);
    const diastolic = 88 + Math.floor(Math.random() * 7);

    dataPoints.push({ month, systolic, diastolic });
  }

  return dataPoints;
}

export function LineGraphCard({ className = '' }: LineGraphCardProps) {
  // Generate data points once
  const dataPoints = useMemo(() => generateDataPoints(), []);

  // Hover state for tooltip
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Graph dimensions
  const width = 400;
  const height = 240;
  const paddingLeft = 55;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 48;
  const graphWidth = width - paddingLeft - paddingRight;
  const graphHeight = height - paddingTop - paddingBottom;

  // Y-axis scale (blood pressure range: 80-160 to accommodate both systolic and diastolic)
  const minValue = 80;
  const maxValue = 160;
  const range = maxValue - minValue;

  // Calculate point positions for systolic (higher line)
  const systolicPoints = dataPoints.map((point, index) => {
    const x = paddingLeft + (index / (dataPoints.length - 1)) * graphWidth;
    const y = paddingTop + ((maxValue - point.systolic) / range) * graphHeight;
    return { x, y, ...point };
  });

  // Calculate point positions for diastolic (lower line)
  const diastolicPoints = dataPoints.map((point, index) => {
    const x = paddingLeft + (index / (dataPoints.length - 1)) * graphWidth;
    const y = paddingTop + ((maxValue - point.diastolic) / range) * graphHeight;
    return { x, y, ...point };
  });

  // Create SVG path strings for both lines
  const systolicPath = systolicPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const diastolicPath = diastolicPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <div className={`border border-border bg-background rounded-lg p-4 pt-12 flex items-center justify-center ${className}`}>
      <div className="relative inline-block" style={{ overflow: 'visible' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxWidth: '400px', overflow: 'visible' }}
        >
        {/* Y-axis */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke="var(--primary-light)"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="var(--primary-light)"
          strokeWidth="1"
        />

        {/* Y-axis labels (blood pressure values) */}
        {[80, 100, 120, 140, 160].map((value) => {
          const y = paddingTop + ((maxValue - value) / range) * graphHeight;
          return (
            <g key={`y-label-${value}`}>
              {/* Tick mark */}
              <line
                x1={paddingLeft - 4}
                y1={y}
                x2={paddingLeft}
                y2={y}
                stroke="var(--primary-light)"
                strokeWidth="1"
              />
              {/* Label - text-sm (14px) */}
              <text
                x={paddingLeft - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="14"
                fill="var(--text-primary)"
                fontFamily="var(--font-geist-sans)"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* X-axis labels (months) and tick marks */}
        {systolicPoints.map((point, i) => (
          <g key={`x-label-${i}`}>
            {/* Tick mark */}
            <line
              x1={point.x}
              y1={height - paddingBottom}
              x2={point.x}
              y2={height - paddingBottom + 4}
              stroke="var(--primary-light)"
              strokeWidth="1"
            />
            {/* Month label - text-sm (14px) */}
            <text
              x={point.x}
              y={height - paddingBottom + 20}
              textAnchor="middle"
              fontSize="14"
              fill="var(--text-primary)"
              fontFamily="var(--font-geist-sans)"
            >
              {point.month}
            </text>
          </g>
        ))}

        {/* Diastolic line (lower values) - primary-main with reduced opacity */}
        <path
          d={diastolicPath}
          fill="none"
          stroke="var(--primary-main)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />

        {/* Systolic line (higher values) - primary-main */}
        <path
          d={systolicPath}
          fill="none"
          stroke="var(--primary-main)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diastolic anchor points - primary-main with reduced opacity */}
        {diastolicPoints.map((point, i) => (
          <g key={`diastolic-point-${i}`}>
            {/* Invisible larger hover area */}
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {/* Visible anchor point */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === i ? "4" : "3"}
              fill="var(--primary-main)"
              opacity="0.5"
              style={{
                cursor: 'pointer',
                transition: 'r 0.2s ease'
              }}
              pointerEvents="none"
            />
          </g>
        ))}

        {/* Systolic anchor points - primary-main with hover areas */}
        {systolicPoints.map((point, i) => (
          <g key={`point-${i}`}>
            {/* Invisible larger hover area */}
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {/* Visible anchor point */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === i ? "4" : "3"}
              fill="var(--primary-main)"
              style={{
                cursor: 'pointer',
                transition: 'r 0.2s ease'
              }}
              pointerEvents="none"
            />
          </g>
        ))}

        {/* Tooltip rendered in SVG using foreignObject */}
        {hoveredPoint !== null && (
          <foreignObject
            x={systolicPoints[hoveredPoint].x - 50}
            y={systolicPoints[hoveredPoint].y - 50}
            width="100"
            height="50"
            style={{ overflow: 'visible' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center pointer-events-none"
              xmlns="http://www.w3.org/1999/xhtml"
            >
              {/* Tooltip Box */}
              <div
                className="text-xs font-medium px-3 py-2 rounded-md whitespace-nowrap shadow-lg relative"
                style={{
                  backgroundColor: 'var(--primary-dark)',
                  color: 'var(--primary-contrast)'
                }}
              >
                {systolicPoints[hoveredPoint].month} - {systolicPoints[hoveredPoint].systolic}/{systolicPoints[hoveredPoint].diastolic}

                {/* Arrow pointing down */}
                <div
                  className="absolute w-0 h-0 left-1/2 -translate-x-1/2 top-full border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]"
                  style={{
                    borderColor: 'var(--primary-dark) transparent transparent transparent'
                  }}
                />
              </div>
            </motion.div>
          </foreignObject>
        )}
        </svg>
      </div>
    </div>
  );
}
