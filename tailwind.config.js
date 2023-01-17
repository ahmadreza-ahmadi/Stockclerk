/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'yekan-bakh': 'yekan bakh',
    },
    extend: {
      colors: {
        'primary': '#4790E7',
        'primary-o50': 'rgba(71, 144, 231, 0.5)',
        'primary-o20': 'rgba(71, 144, 231, 0.2)',
        'primary-o15': 'rgba(71, 144, 231, 0.15)',
        'white': '#FFFFFF'
      },  
      spacing: {
        '1300': '1300px',
        '750': '750px',
        '660': '660px',
        '500': '500px',
        '450': '450px',
        '200': '200px',
        '100': '100px',

      },
      blur: {
        125: '125px',
      },
      dropShadow: {
        'title': '0 8px 20px rgba(0, 0, 0, 0.25)',
      },
      opacity: {
        '15': '0.15',
      },
      borderRadius: {
        '40': '40px',
        '24': '24px',
      },
      boxShadow: {
        'snackbar-progress': '0 0 5px 0 rgb(74 222 128)',
      }
    },
  },
  plugins: [],
};
