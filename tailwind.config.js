/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C42', secondary: '#A78BFA', pastelOrange: '#FFD6B0',
        pastelPurple: '#EDE9FE', cream: '#FFFAF5', textPrimary: '#3B2F4A', textSecondary: '#8B7FA8',
      },
    },
  },
  plugins: [],
};
