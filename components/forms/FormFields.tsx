/**
 * Form Field Components
 *
 * Reusable form input components with consistent styling.
 * Matches the design system tokens.
 */

'use client';

import { ReactNode } from 'react';

interface BaseFieldProps {
  label: string;
  name: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  className?: string;
}

interface TextInputProps extends BaseFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  defaultValue?: string;
}

interface TextAreaProps extends BaseFieldProps {
  placeholder?: string;
  rows?: number;
  defaultValue?: string;
}

interface SelectProps extends BaseFieldProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string;
}

interface CheckboxProps {
  label: string;
  name: string;
  defaultChecked?: boolean;
  helpText?: string;
  className?: string;
}

interface RadioGroupProps extends BaseFieldProps {
  options: { value: string; label: string }[];
}

// Text Input Field - Simple placeholder
export function TextInput({
  label,
  name,
  type = 'text',
  placeholder,
  defaultValue,
  required = false,
  helpText,
  error,
  className = '',
}: TextInputProps) {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block text-sm text-text-primary mb-1">
        Form field
      </label>
      <div className="h-10 w-full bg-accent1-contrast border border-accent1-light rounded" />
    </div>
  );
}

// Text Area Field - Simple placeholder
export function TextArea({
  label,
  name,
  placeholder,
  rows = 4,
  defaultValue,
  required = false,
  helpText,
  error,
  className = '',
}: TextAreaProps) {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block text-sm text-text-primary mb-1">
        Form field
      </label>
      <div className="h-24 w-full bg-accent1-contrast border border-accent1-light rounded" />
    </div>
  );
}

// Select Dropdown Field - Simple placeholder
export function Select({
  label,
  name,
  options,
  placeholder,
  defaultValue,
  required = false,
  helpText,
  error,
  className = '',
}: SelectProps) {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="block text-sm text-text-primary mb-1">
        Form field
      </label>
      <div className="h-10 w-full bg-accent1-contrast border border-accent1-light rounded" />
    </div>
  );
}

// Checkbox Field - Simple placeholder
export function Checkbox({
  label,
  name,
  defaultChecked = false,
  helpText,
  className = '',
}: CheckboxProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-5 h-5 bg-accent1-contrast border border-accent1-light rounded flex-shrink-0" />
      <label className="text-sm text-text-primary">Form field</label>
    </div>
  );
}

// Radio Group Field - Simple placeholder
export function RadioGroup({
  label,
  name,
  options,
  required = false,
  helpText,
  error,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`${className}`}>
      <label className="block text-sm text-text-primary mb-2">
        Form field
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent1-contrast border border-accent1-light rounded-full flex-shrink-0" />
            <label className="text-sm text-text-primary">Form field</label>
          </div>
        ))}
      </div>
    </div>
  );
}

// Field Group (for grouping related fields)
export function FieldGroup({
  legend,
  children,
  className = '',
}: {
  legend?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={`space-y-4 ${className}`}>
      {legend && (
        <legend className="text-sm font-medium text-text-primary mb-3">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
