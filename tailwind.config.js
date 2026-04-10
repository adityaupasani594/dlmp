/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0e1a',
          900: '#0f1629',
          850: '#131d35',
          800: '#1a2540',
        },
        electric: { DEFAULT: '#4f8ef7', light: '#7db0ff', dark: '#2563eb' },
        neon: { green: '#10b981', amber: '#f59e0b', red: '#ef4444', purple: '#8b5cf6' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'celebration': 'celebration 0.6s ease-out forwards',
      },
      keyframes: {
        glow: { '0%': { boxShadow: '0 0 5px #4f8ef7' }, '100%': { boxShadow: '0 0 20px #4f8ef7, 0 0 40px #4f8ef733' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        celebration: { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.05)', boxShadow: '0 0 40px #10b981' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
