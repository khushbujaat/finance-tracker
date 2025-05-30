/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Modern, clean font
      },
      colors: {
        primary: '#1E40AF', // Deep blue
        accent: '#22C55E',  // Lime green (income)
        danger: '#EF4444',  // Red (expenses / delete)
      },
    },
  },
  plugins: [],
}


