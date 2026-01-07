/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'mono': ['Courier New', 'monospace'],
        'hand': ['Comic Sans MS', 'cursive'],
        'modern': ['Arial', 'sans-serif'],
        // Custom fonts
        'array': ['Array', 'sans-serif'],
        'boxing': ['Boxing', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
        'stardom': ['Stardom', 'sans-serif'],
        'telma': ['Telma', 'sans-serif'],
        'bespokeserif': ['BespokeSerif', 'serif'],
      },
    },
  },
  plugins: [],
}

