/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./*.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A6D1',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          tertiary: '#949494',
          placeholder: '#B8B8B8'
        },
        border: {
          search: '#E5E7EB',
          focus: '#00A6D1'
        },
        hover: {
          DEFAULT: '#00A6D1'
        }
      }
    }
  },
  plugins: [],
}
