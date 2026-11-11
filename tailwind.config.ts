import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Taman" (meadow) palette. 600/700 keep ≥ 4.5:1 contrast with white text.
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#15803d',
          700: '#166534',
        },
      },
      // Short, purposeful animations (entrance and feedback). All are switched off by
      // "Kurangi animasi" and by the OS reduced-motion setting (see styles/index.css).
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(28px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '60%': { transform: 'scale(1.04)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(6deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-6deg)' },
          '75%': { transform: 'rotate(6deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(.2,.8,.2,1) both',
        'slide-in': 'slide-in 0.35s cubic-bezier(.2,.8,.2,1) both',
        pop: 'pop 0.4s cubic-bezier(.2,.8,.2,1) both',
        float: 'float 4s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        sway: 'sway 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
