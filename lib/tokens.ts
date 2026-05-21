/**
 * Design Token Parser
 *
 * Converts JSON design tokens into CSS variables and Tailwind theme extensions.
 * This utility ensures a single source of truth for all design values.
 */

import tokens from '@/tokens/tokens.json';

/**
 * Flattens nested token objects into dot notation
 * Example: { colors: { primary: { main: '#000' } } } -> { 'colors.primary.main': '#000' }
 */
function flattenTokens(obj: any, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result = { ...result, ...flattenTokens(value, newKey) };
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

/**
 * Generates CSS variable string for injecting into global styles
 */
export function generateCSSVariables(): string {
  const flattened = flattenTokens(tokens);
  const cssVars = Object.entries(flattened)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  return `:root {\n${cssVars}\n}`;
}

/**
 * Converts tokens to Tailwind theme format
 */
export function getTailwindTheme() {
  return {
    colors: {
      background: tokens.colors.background,
      backgroundSoft: tokens.colors.backgroundSoft,
      backgroundInactive: tokens.colors.backgroundInactive,
      surface: tokens.colors.surface,
      border: tokens.colors.border,
      borderLight: tokens.colors.borderLight,
      textPrimary: tokens.colors.textPrimary,
      textSecondary: tokens.colors.textSecondary,
      textTertiary: tokens.colors.textTertiary,
      inactive: tokens.colors.inactive,
      hover: tokens.colors.hover,
      selected: tokens.colors.selected,
      accent: tokens.colors.accent,
      grey: tokens.colors.grey,
      primary: tokens.colors.primary,
    },
    spacing: tokens.spacing,
    borderRadius: tokens.radius,
    boxShadow: tokens.shadows,
    fontFamily: tokens.typography.fontFamily,
    fontSize: tokens.typography.fontSize,
    fontWeight: tokens.typography.fontWeight,
    lineHeight: tokens.typography.lineHeight,
    transitionDuration: tokens.motion.duration,
    transitionTimingFunction: tokens.motion.easing,
    zIndex: tokens.zIndex,
    borderWidth: tokens.borders.width,
  };
}

/**
 * Direct access to token values
 */
export { tokens };
