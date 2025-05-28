/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dadcoin-yellow': '#fbb026',
        'dadcoin-black': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        spin: 'spin 10s linear infinite',
      },
    },
  },
  plugins: [],
};