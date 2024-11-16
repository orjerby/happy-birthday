/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  presets: [require("tailwindcss-preset-px-to-rem")],
  prefix: "tw-",
  theme: {
    extend: {},
  },
  plugins: [],
};
