import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — derived from original HTML design tokens
        dg: '#27382f',        // dark green — header, primary buttons
        lg: '#c9deb6',        // light green — logo, accents
        fg: '#499e6b',        // forest green — active, focus
        cream: '#faf9f7',     // page background
        'brand-black': '#171717',
        'brand-gray': '#7a8a84',
        'brand-border': '#e4ede8',
        'brand-card': '#ffffff',
        'brand-text': '#3c4840',
        'brand-yellow': '#ffec82',
        'brand-orange': '#ffa366',

        // shadcn/ui CSS variable mappings
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Darker Grotesque', 'system-ui', 'sans-serif'],
        sidekick: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['3rem', { lineHeight: '1.05', fontWeight: '400' }],
        h1: ['2.125rem', { lineHeight: '1.12', fontWeight: '400' }],
        h2: ['1.625rem', { lineHeight: '1.2', fontWeight: '400' }],
        h3: ['1.25rem', { lineHeight: '1.25', fontWeight: '500' }],
        body: ['1.0625rem', { lineHeight: '1.55', fontWeight: '600' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.45', fontWeight: '600' }],
        caption: ['0.8125rem', { lineHeight: '1.35', fontWeight: '600' }],
        label: ['0.6875rem', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'card-soft': '0 2px 10px rgba(39, 56, 47, 0.05)',
        'card-hover': '0 10px 26px rgba(39, 56, 47, 0.12)',
        'focus-soft': '0 0 0 3px rgba(73, 158, 107, 0.18)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
}

export default config
