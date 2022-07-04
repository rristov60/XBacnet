/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {   
      colors: {
        'background': '#FFFFFF',
        'background-dark': '#0A122A'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
