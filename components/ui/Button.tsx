'use client';

import { type ReactNode, type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const BASE =
  'inline-flex items-center justify-center leading-none rounded-[6px] ' +
  'transition-colors cursor-pointer select-none flex-shrink-0 whitespace-nowrap ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

const TEXT_SIZE: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-[11px] gap-1',
  sm: 'h-8 px-3 text-[12px] gap-1.5',
  md: 'h-9 px-3.5 text-[13px] gap-1.5',
  lg: 'h-10 px-4 text-[14px] gap-2',
};

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: 'size-7',
  sm: 'size-8',
  md: 'size-9',
  lg: 'size-10',
};

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'font-semibold bg-primary-main text-primary-contrast border border-primary-main ' +
    'hover:opacity-90 active:opacity-80',
  secondary:
    'font-medium bg-background text-text-primary border border-border ' +
    'hover:bg-hover active:bg-hover-strong',
  ghost:
    'font-medium bg-transparent text-text-secondary ' +
    'hover:bg-hover hover:text-text-primary active:bg-hover-strong',
  icon:
    'bg-background text-text-secondary border border-border ' +
    'hover:bg-hover active:bg-hover-strong',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isIcon = variant === 'icon';
  const sizeClass = isIcon ? ICON_SIZE[size] : TEXT_SIZE[size];

  return (
    <button
      type={type}
      className={[BASE, sizeClass, VARIANT[variant], className].filter(Boolean).join(' ')}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
