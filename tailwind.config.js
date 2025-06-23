/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D65D67',
        'primary-dark': '#B54951',
        'primary-light': '#E07A83',
      }
    },
  },
  plugins: [],
}
