/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#1c1c1c',
        bg2: '#2a2a2a',
        bg3: '#3f3f3f',
        primary: '#7f58d9',
        secondary: '#ffc1df',
      }
    },
  },
  plugins: [],
}
