/**
 * PatientCard Component
 *
 * Displays patient information with icon, name, demographics, and navigation
 */

'use client';

import { motion } from 'framer-motion';
import { PatientIcon, ArrowRightIcon } from '@/components/icons';

interface PatientCardProps {
  patientName?: string;
  dateOfBirth?: string;
  patientId?: string;
  sex?: string;
  className?: string;
  onClick?: () => void;
}

export function PatientCard({
  patientName = 'SMITH, Robert (Mr)',
  dateOfBirth = 'DD-Mon-YYYY',
  patientId = '123 456 7890',
  sex = 'Male',
  className = '',
  onClick,
}: PatientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border border-accent1-main bg-accent1-contrast rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:bg-hover transition-colors group ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Patient Icon */}
      <div className="w-10 h-10 flex items-center justify-center bg-accent1-contrast border border-accent1-main rounded flex-shrink-0">
        <PatientIcon size={24} className="text-accent1-main" />
      </div>

      {/* Patient Information */}
      <div className="flex-1">
        {/* Patient Name */}
        <div className="text-sm font-semibold text-accent1-dark mb-1">
          {patientName}
        </div>

        {/* Demographics - Single line with separators */}
        <div className="text-sm text-accent1-main flex items-center gap-2 flex-wrap">
          <span>Born: {dateOfBirth}</span>
          <span className="text-accent1-main opacity-50">•</span>
          <span>Patient identifier: {patientId}</span>
          <span className="text-accent1-main opacity-50">•</span>
          <span>Sex: {sex}</span>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0 text-accent1-main group-hover:text-accent1-dark transition-colors">
        <ArrowRightIcon size={20} />
      </div>
    </motion.div>
  );
}
