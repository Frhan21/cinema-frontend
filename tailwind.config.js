/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cinema: '#0d0e0f',
        surface: '#17191b',
        primary: '#ff5f62',
        secondary: '#65c9ff',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
