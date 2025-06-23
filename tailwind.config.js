/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C00001',
        'primary-dark': '#A00001',
        'primary-light': '#E60002',
        secondary: '#F6D316',
        'secondary-dark': '#D4B414',
        accent: '#857040',
        'accent-light': '#A08A52',
        dark: '#000000',
        'gray-custom': '#F8F9FA',
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}