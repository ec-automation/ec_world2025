/** @type {import('tailwindcss').Config} */
module.exports = {
  // ⬅️ pon tus rutas como estaban
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],

  // ⭐ ESTA LÍNEA NUEVA
  presets: [require("@tailwindcss/preset-classic")],

  theme: {
    extend: {},
  },
  plugins: [],
};
