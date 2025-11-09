/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: {
          50: '#f0f9cc',
          100: '#e0f399',
          200: '#c8ea66',
          300: '#b0e033',
          400: '#99d500',
          500: '#93d500', // base
          600: '#7cb200',
          700: '#659000',
          800: '#4e6e00',
          900: '#374c00',
          950: '#203300',
        },
      },
    },
  },
  darkMode: 'class', // Alternar con la clase .dark
  plugins: [],
}
