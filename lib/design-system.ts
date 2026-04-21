/**
 * Design System Utilities for SheriaBot
 * Provides theme management, color utilities, and design token helpers
 */

/**
 * SheriaBot Brand Color Palette
 */
export const SHERIA_COLORS = {
  // Primary: Navy
  primary: {
    50: '#f0f4fa',
    100: '#d9e5f2',
    200: '#a8c5e0',
    300: '#77a4ce',
    400: '#4684bb',
    500: '#1a2b4a', // Primary brand color
    600: '#16263f',
    700: '#0f1a28',
    800: '#0a0e17',
    900: '#050709',
  },
  // Secondary: Emerald
  secondary: {
    50: '#e6f7f3',
    100: '#b3e8dc',
    200: '#80d9c4',
    300: '#4dcaad',
    400: '#1abb95',
    500: '#00875a', // Secondary brand color
    600: '#00704a',
    700: '#00593a',
    800: '#004229',
    900: '#002b19',
  },
  // Accent: Gold
  accent: {
    50: '#fef9ed',
    100: '#fdefd0',
    200: '#fbe4a1',
    300: '#f9d972',
    400: '#f7ce43',
    500: '#d4a843', // Accent brand color
    600: '#b88d38',
    700: '#9c742d',
    800: '#805a22',
    900: '#644017',
  },
  // Neutrals
  neutral: {
    50: '#fafbfc',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

/**
 * Status color palette (semantic colors)
 */
export const STATUS_COLORS = {
  success: '#00875a',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#1a2b4a',
} as const;

/**
 * Chart color palette (for recharts and other visualization libraries)
 */
export const CHART_COLORS = {
  1: '#00875a', // Emerald - primary chart
  2: '#1a2b4a', // Navy - secondary
  3: '#d4a843', // Gold - accent
  4: '#f97316', // Orange - supplementary
  5: '#3b82f6', // Blue - supplementary
} as const;

/**
 * Typography scale tokens
 */
export const TYPOGRAPHY = {
  // Headings
  h1: 'text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl',
  h2: 'text-3xl font-bold leading-tight tracking-tight md:text-4xl',
  h3: 'text-2xl font-bold leading-snug md:text-3xl',
  h4: 'text-xl font-semibold leading-snug md:text-2xl',
  h5: 'text-lg font-semibold leading-normal',
  h6: 'text-base font-semibold leading-normal',

  // Body text
  body: {
    lg: 'text-lg leading-relaxed',
    base: 'text-base leading-relaxed',
    sm: 'text-sm leading-relaxed',
    xs: 'text-xs leading-relaxed',
  },

  // Specialized
  label: 'text-sm font-medium leading-none',
  small: 'text-sm',
  code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded',
} as const;

/**
 * Spacing scale tokens (in rem and px)
 */
export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const;

/**
 * Border radius tokens
 */
export const RADIUS = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  full: '9999px',
} as const;

/**
 * Shadow elevations for card and surface depths
 */
export const SHADOWS = {
  sm: 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
  md: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
  lg: 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
  xl: 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
  '2xl': 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
} as const;

/**
 * Z-index layers for proper stacking
 */
export const Z_INDEX = {
  dropdown: 40,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 50,
  notification: 60,
  debug: 9999,
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Animation durations
 */
export const ANIMATIONS = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

/**
 * Utility function: Convert color hex to HSL values for CSS variables
 */
export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Utility function: Get contrasting text color for a background
 */
export function getContrastColor(backgroundColor: string): 'light' | 'dark' {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
}

/**
 * Utility function: Get readable color name for a hex value
 */
export function getColorName(hex: string): string {
  const hexLower = hex.toLowerCase();
  for (const [name, shades] of Object.entries(SHERIA_COLORS)) {
    for (const [shade, value] of Object.entries(shades)) {
      if (value.toLowerCase() === hexLower) {
        return `${name}-${shade}`;
      }
    }
  }
  return 'custom';
}
