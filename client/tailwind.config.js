/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5fc',
          100: '#d9e9f9',
          200: '#b8d6f4',
          300: '#8cbbed',
          400: '#5e9ce3',
          500: '#4A8DD5', // Primary brand color
          600: '#3870b2',
          700: '#2f5c91',
          800: '#2a4e78',
          900: '#294565',
          950: '#1a2c43',
        },
        secondary: {
          50: '#f0f9f5',
          100: '#daf0e6',
          200: '#b8e2cf',
          300: '#8cccb2',
          400: '#5AB58D', // Secondary brand color
          500: '#3c9d71',
          600: '#2d7d5a',
          700: '#27654a',
          800: '#23503d',
          900: '#1f4334',
          950: '#0f261e',
        },
        accent: {
          50: '#f4f1fc',
          100: '#e9e2f8',
          200: '#d5c9f2',
          300: '#b9a4e8',
          400: '#9c7edd',
          500: '#8D6CD9', // Accent brand color
          600: '#714ec0',
          700: '#5f3ea0',
          800: '#4f3683',
          900: '#43306c',
          950: '#291c42',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevation-2': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-4': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};