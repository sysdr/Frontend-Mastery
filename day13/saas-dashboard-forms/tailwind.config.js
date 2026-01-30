/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-amber-500',
    'bg-amber-100',
    'text-amber-700',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
