/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F1A2E',
        surface: '#2A2340',
        'surface-2': '#352C4D',
        bone: '#F2EBDD',
        ember: '#FB5A3C',
        mint: '#74D3AE',
        dust: '#9A8FB0',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
