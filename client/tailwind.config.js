/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#f9e8ff',
          200: '#f3d0fe',
          300: '#e8a9fd',
          400: '#d877f9',
          500: '#c44df0',
          600: '#a62dd4',
          700: '#8a20b0',
          800: '#731f91',
          900: '#601d77',
          950: '#3e0752',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        dark: {
          900: '#080810',
          800: '#0e0e1a',
          700: '#141426',
          600: '#1a1a30',
          500: '#22223c',
          400: '#2e2e50',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'slide-in': 'slideIn 0.5s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
