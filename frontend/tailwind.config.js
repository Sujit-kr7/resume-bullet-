/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        white: '#f5f5f0',
        'gray-brutal': '#eeeeea',
        'gray-mid': '#d4d4cf',
        'gray-dim': '#9a9a95',
        'red-brutal': '#d32f2f',
        'green-brutal': '#1a7a1a',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
