/**
 * Theme Converter
 *
 * Converts Figma Design Tokens format to CSS custom properties
 */

interface FigmaColorValue {
  colorSpace: string;
  components: number[];
  alpha: number;
  hex: string;
}

interface FigmaToken {
  $type: string;
  $value: FigmaColorValue;
}

interface FigmaTokenGroup {
  [key: string]: FigmaToken | FigmaTokenGroup;
}

interface FigmaTheme {
  Primary?: FigmaTokenGroup;
  'Accent 1'?: FigmaTokenGroup;
  'Accent 2'?: FigmaTokenGroup;
  Accent3?: FigmaTokenGroup;
  Success?: FigmaTokenGroup;
  Warning?: FigmaTokenGroup;
  Error?: FigmaTokenGroup;
  Greyscale?: FigmaTokenGroup;
  Other?: FigmaTokenGroup;
  Text?: FigmaTokenGroup;
  [key: string]: any;
}

/**
 * Convert RGB components to hex
 */
function rgbToHex(components: number[], alpha: number): string {
  const [r, g, b] = components.map(c => Math.round(c * 255));
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return hex;
}

/**
 * Extract color value from Figma token
 */
function extractColor(token: FigmaToken): string {
  if (token.$value.hex) {
    if (token.$value.alpha < 1) {
      return rgbToHex(token.$value.components, token.$value.alpha);
    }
    return token.$value.hex;
  }
  return rgbToHex(token.$value.components, token.$value.alpha);
}

/**
 * Convert Figma theme to CSS custom properties object
 */
export function convertFigmaThemeToCSSVars(figmaTheme: FigmaTheme): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Primary colors
  if (figmaTheme.Primary) {
    if ('main' in figmaTheme.Primary && '$value' in figmaTheme.Primary.main) {
      cssVars['--primary-main'] = extractColor(figmaTheme.Primary.main as FigmaToken);
    }
    if ('dark' in figmaTheme.Primary && '$value' in figmaTheme.Primary.dark) {
      cssVars['--primary-dark'] = extractColor(figmaTheme.Primary.dark as FigmaToken);
    }
    if ('light' in figmaTheme.Primary && '$value' in figmaTheme.Primary.light) {
      cssVars['--primary-light'] = extractColor(figmaTheme.Primary.light as FigmaToken);
    }
    if ('contrast' in figmaTheme.Primary && '$value' in figmaTheme.Primary.contrast) {
      cssVars['--primary-contrast'] = extractColor(figmaTheme.Primary.contrast as FigmaToken);
    }
  }

  // Accent 1 colors
  if (figmaTheme['Accent 1']) {
    if ('main' in figmaTheme['Accent 1'] && '$value' in figmaTheme['Accent 1'].main) {
      cssVars['--accent1-main'] = extractColor(figmaTheme['Accent 1'].main as FigmaToken);
    }
    if ('dark' in figmaTheme['Accent 1'] && '$value' in figmaTheme['Accent 1'].dark) {
      cssVars['--accent1-dark'] = extractColor(figmaTheme['Accent 1'].dark as FigmaToken);
    }
    if ('light' in figmaTheme['Accent 1'] && '$value' in figmaTheme['Accent 1'].light) {
      cssVars['--accent1-light'] = extractColor(figmaTheme['Accent 1'].light as FigmaToken);
    }
    if ('contrast' in figmaTheme['Accent 1'] && '$value' in figmaTheme['Accent 1'].contrast) {
      cssVars['--accent1-contrast'] = extractColor(figmaTheme['Accent 1'].contrast as FigmaToken);
    }
  }

  // Accent 2 colors
  if (figmaTheme['Accent 2']) {
    if ('main' in figmaTheme['Accent 2'] && '$value' in figmaTheme['Accent 2'].main) {
      cssVars['--accent2-main'] = extractColor(figmaTheme['Accent 2'].main as FigmaToken);
    }
    if ('dark' in figmaTheme['Accent 2'] && '$value' in figmaTheme['Accent 2'].dark) {
      cssVars['--accent2-dark'] = extractColor(figmaTheme['Accent 2'].dark as FigmaToken);
    }
    if ('light' in figmaTheme['Accent 2'] && '$value' in figmaTheme['Accent 2'].light) {
      cssVars['--accent2-light'] = extractColor(figmaTheme['Accent 2'].light as FigmaToken);
    }
    if ('contrast' in figmaTheme['Accent 2'] && '$value' in figmaTheme['Accent 2'].contrast) {
      cssVars['--accent2-contrast'] = extractColor(figmaTheme['Accent 2'].contrast as FigmaToken);
    }
  }

  // Accent 3 colors
  if (figmaTheme.Accent3) {
    if ('main' in figmaTheme.Accent3 && '$value' in figmaTheme.Accent3.main) {
      cssVars['--accent3-main'] = extractColor(figmaTheme.Accent3.main as FigmaToken);
    }
    if ('dark' in figmaTheme.Accent3 && '$value' in figmaTheme.Accent3.dark) {
      cssVars['--accent3-dark'] = extractColor(figmaTheme.Accent3.dark as FigmaToken);
    }
    if ('light' in figmaTheme.Accent3 && '$value' in figmaTheme.Accent3.light) {
      cssVars['--accent3-light'] = extractColor(figmaTheme.Accent3.light as FigmaToken);
    }
    if ('contrast' in figmaTheme.Accent3 && '$value' in figmaTheme.Accent3.contrast) {
      cssVars['--accent3-contrast'] = extractColor(figmaTheme.Accent3.contrast as FigmaToken);
    }
  }

  // Greyscale
  if (figmaTheme.Greyscale) {
    Object.keys(figmaTheme.Greyscale).forEach(key => {
      const token = figmaTheme.Greyscale![key];
      if ('$value' in token) {
        cssVars[`--grey-${key}`] = extractColor(token as FigmaToken);
      }
    });
  }

  // Other (backgrounds, borders, etc.)
  if (figmaTheme.Other) {
    if ('bg-default' in figmaTheme.Other && '$value' in figmaTheme.Other['bg-default']) {
      cssVars['--background'] = extractColor(figmaTheme.Other['bg-default'] as FigmaToken);
    }
    if ('bg-soft' in figmaTheme.Other && '$value' in figmaTheme.Other['bg-soft']) {
      cssVars['--background-soft'] = extractColor(figmaTheme.Other['bg-soft'] as FigmaToken);
    }
    if ('bg-inactive' in figmaTheme.Other && '$value' in figmaTheme.Other['bg-inactive']) {
      cssVars['--background-inactive'] = extractColor(figmaTheme.Other['bg-inactive'] as FigmaToken);
    }
    if ('border' in figmaTheme.Other && '$value' in figmaTheme.Other.border) {
      cssVars['--border'] = extractColor(figmaTheme.Other.border as FigmaToken);
    }
    if ('hover' in figmaTheme.Other && '$value' in figmaTheme.Other.hover) {
      cssVars['--hover'] = extractColor(figmaTheme.Other.hover as FigmaToken);
    }
    if ('selected' in figmaTheme.Other && '$value' in figmaTheme.Other.selected) {
      cssVars['--selected'] = extractColor(figmaTheme.Other.selected as FigmaToken);
    }
    if ('inactive' in figmaTheme.Other && '$value' in figmaTheme.Other.inactive) {
      cssVars['--inactive'] = extractColor(figmaTheme.Other.inactive as FigmaToken);
    }
  }

  // Text
  if (figmaTheme.Text) {
    if ('primary' in figmaTheme.Text && '$value' in figmaTheme.Text.primary) {
      cssVars['--text-primary'] = extractColor(figmaTheme.Text.primary as FigmaToken);
    }
    if ('secondary' in figmaTheme.Text && '$value' in figmaTheme.Text.secondary) {
      cssVars['--text-secondary'] = extractColor(figmaTheme.Text.secondary as FigmaToken);
    }
  }

  // Add tertiary text color (derived from greyscale)
  if (figmaTheme.Greyscale && 'grey-50' in figmaTheme.Greyscale && '$value' in figmaTheme.Greyscale['grey-50']) {
    cssVars['--text-tertiary'] = extractColor(figmaTheme.Greyscale['grey-50'] as FigmaToken);
  }

  return cssVars;
}

/**
 * Apply CSS variables to document root
 */
export function applyCSSVars(cssVars: Record<string, string>): void {
  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

/**
 * Get theme name from Figma theme
 */
export function getThemeName(figmaTheme: FigmaTheme): string {
  if (figmaTheme.$extensions && 'com.figma.modeName' in figmaTheme.$extensions) {
    return figmaTheme.$extensions['com.figma.modeName'];
  }
  return 'Unknown';
}
