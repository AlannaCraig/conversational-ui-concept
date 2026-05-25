/**
 * LineGraphCard Component
 *
 * Displays a line graph visualization for data trends (e.g., blood pressure readings)
 */

'use client';

import { motion } from 'framer-motion';

interface LineGraphCardProps {
  className?: string;
}

export function LineGraphCard({ className = '' }: LineGraphCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {/* Blood Pressure Graph SVG */}
      <svg width="357" height="154" viewBox="0 0 357 154" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect x="0.5" y="0.5" width="356" height="153" rx="11.5" fill="#FEFCF8"/>
        <rect x="0.5" y="0.5" width="356" height="153" rx="11.5" stroke="#D5CFBD"/>
        <rect x="16" y="16" width="2" height="120" fill="#757A80"/>
        <rect x="16" y="136" width="320" height="2" fill="#757A80"/>
        <rect x="80" y="132" width="2" height="6" fill="#757A80"/>
        <rect x="144" y="132" width="2" height="6" fill="#757A80"/>
        <rect x="208" y="132" width="2" height="6" fill="#757A80"/>
        <rect x="272" y="132" width="2" height="6" fill="#757A80"/>
        <rect x="336" y="132" width="2" height="6" fill="#757A80"/>
        <path d="M337.242 34.9697L273.184 50.9844L273.124 50.9922L209.124 58.9922L208.938 59.0156L208.758 58.9697L145.117 43.0596L81.4473 74.8945L81.3486 74.9434L81.2422 74.9697L18 90V88L80.6484 73.0576L144.553 41.1055L144.884 40.9404L209.06 56.9844L272.819 49.0146L336.758 33.0303L337.242 34.9697Z" fill="#6B4347"/>
        <circle cx="81" cy="74" r="4" fill="#6B4347"/>
        <circle cx="145" cy="42" r="4" fill="#6B4347"/>
        <circle cx="209" cy="58" r="4" fill="#6B4347"/>
        <circle cx="273" cy="50" r="4" fill="#6B4347"/>
        <circle cx="337" cy="34" r="4" fill="#6B4347"/>
      </svg>
    </motion.div>
  );
}
