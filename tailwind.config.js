const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*{html,js}'],

  theme: {
    colors: {
      ...colors,
      customGray: 'rgb(107 114 128 / 42%)',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
