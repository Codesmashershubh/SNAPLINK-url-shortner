/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(17,24,39,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,24,39,0.035) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
