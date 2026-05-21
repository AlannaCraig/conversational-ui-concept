/**
 * Avatar Component
 *
 * Circular avatar with initials.
 * Uses accent color variants (accent1, accent2, accent3) for background.
 * 36x36px circle with 2px inside stroke.
 */

interface AvatarProps {
  initials: string;
  variant?: 'accent1' | 'accent2' | 'accent3';
  size?: number;
}

export function Avatar({ initials, variant = 'accent1', size = 36 }: AvatarProps) {
  const colorMap = {
    accent1: {
      bg: 'var(--accent1-main)',
      stroke: 'var(--accent1-contrast)',
      text: 'var(--accent1-contrast)',
    },
    accent2: {
      bg: 'var(--accent2-main)',
      stroke: 'var(--accent2-contrast)',
      text: 'var(--accent2-contrast)',
    },
    accent3: {
      bg: 'var(--accent3-main)',
      stroke: 'var(--accent3-contrast)',
      text: 'var(--accent3-contrast)',
    },
  };

  const colors = colorMap[variant];

  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold select-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colors.bg,
        boxShadow: `inset 0 0 0 2px ${colors.stroke}`,
        color: colors.text,
        fontSize: '16px',
        lineHeight: '1',
      }}
      aria-label={`Avatar for ${initials}`}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
