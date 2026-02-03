/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Enterprise Grade Palette
        brand: {
          50: '#f2fcf5',
          100: '#e1f8e8',
          200: '#c5efd4',
          300: '#97e1b5',
          400: '#5fca8d',
          500: '#2E8B57', // Primary: Agro-green
          600: '#247146',
          700: '#1f5a3a',
          800: '#1c4831',
          900: '#183c2a',
          950: '#041d13', // Ultra-dark: Agro-dark
        },
        surface: {
          50: '#F0F8E8', // Agro-light
          100: '#e2efd6',
          200: '#c7e1b2',
          300: '#a3ce85',
          400: '#1A5D1A', // Agro-surface (Cards)
          500: '#144a14',
        },
        accent: {
          amber: '#FF9E1B',
          red: '#DC143C',
          glass: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        // High-end Typography Stack
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        accent: ['"Big Shoulders Display"', 'cursive'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'farmer-base': '1.125rem',
        'farmer-lg': '1.5rem',
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'premium-mask': 'linear-gradient(to bottom, transparent, black)',
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal': 'reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: [],
}