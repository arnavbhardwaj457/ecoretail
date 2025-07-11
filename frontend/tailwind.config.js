/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#fff',
        eco: {
          bg: '#101924',
          bg2: '#16202e',
          green: '#10b981',
          teal: '#06b6d4',
          blue: '#3b82f6',
          glass: 'rgba(22,32,46,0.7)',
          glassLight: 'rgba(16,25,36,0.6)',
        },
        green: {
          DEFAULT: '#10b981',
          light: '#bbf7d0',
        },
        gray: {
          DEFAULT: '#222',
        },
        accent: {
          green: '#10b981',
          teal: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'eco-gradient': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 