import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0D',
        plum: '#3D0F26',
        pink: '#E0479C',
        pinkSoft: '#F6A8CE',
        gold: '#F0B429',
        blush: '#FDF3F7',
        white: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        price: ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(61,15,38,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
