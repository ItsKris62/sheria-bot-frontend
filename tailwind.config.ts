import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        body: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        legal: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        ui: ['var(--font-general-sans)', 'var(--font-satoshi)', 'system-ui', 'sans-serif'],
        numeric: ['var(--font-general-sans)', 'var(--font-satoshi)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-cabinet)', 'var(--font-satoshi)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cabinet)', 'var(--font-satoshi)', 'system-ui', 'sans-serif'],
        brand: ['var(--font-basicaline)', 'var(--font-cabinet)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        caveat: ['var(--font-caveat)', 'cursive'],
      },
      colors: {
        background: 'var(--bg-base)',
        foreground: 'var(--fg-primary)',
        surface: {
          DEFAULT: 'var(--bg-raised)',
          overlay: 'var(--bg-overlay)',
          input: 'var(--bg-input)',
        },
        'foreground-secondary': 'var(--fg-secondary)',
        'foreground-muted': 'var(--fg-muted)',
        'foreground-disabled': 'var(--fg-disabled)',
        'foreground-on-green': 'var(--fg-on-green)',
        border: {
          DEFAULT: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          green: 'var(--border-green)',
        },
        brand: {
          green: {
            DEFAULT: 'var(--brand-green)',
            hover: 'var(--brand-green-hover)',
            soft: 'var(--brand-green-soft)',
          },
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: 'var(--destructive)',
        info: 'var(--info)',
        /* Legacy aliases for backward compatibility */
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'var(--success)',
          '2': 'var(--info)',
          '3': 'var(--warning)',
          '4': '#A855F7',
          '5': '#EC4899',
          '6': '#14B8A6',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glow-green': '0 0 0 1px rgba(34, 197, 94, 0.15), 0 8px 24px -4px rgba(34, 197, 94, 0.35)',
        'glow-green-sm': '0 0 0 1px rgba(34, 197, 94, 0.2), 0 2px 8px rgba(34, 197, 94, 0.25)',
        'elevated': '0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 24px -8px rgba(0, 0, 0, 0.8)',
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '260ms',
        slower: '400ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(34,197,94,0.15), 0 8px 24px -4px rgba(34,197,94,0.25)' },
          '50%':      { boxShadow: '0 0 0 1px rgba(34,197,94,0.25), 0 12px 32px -4px rgba(34,197,94,0.45)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        'dot-pulse': {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up': 'accordion-up 180ms ease-out',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        'shake': 'shake 400ms ease-in-out',
        'dot-pulse': 'dot-pulse 1.2s ease-in-out infinite',
        'fade-slide-up': 'fade-slide-up 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'pulse-glow': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
export default config
