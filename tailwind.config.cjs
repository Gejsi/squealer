/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translate3d(0, 100%, 0)' },
          '100%': { transform: 'translate3d(0, 0, 0)' },
        },
        wiggle: {
          '10%': { transform: 'rotate(5deg) scale(1.05)' },
          '20%': { transform: 'rotate(-5deg) scale(1.05)' },
          '30%': { transform: 'rotate(5deg) scale(1.05)' },
          '40%': { transform: 'none' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out forwards',
        scaleIn: 'scaleIn 200ms cubic-bezier(.21,1.02,.73,1) forwards',
        slideUp: 'slideUp 350ms cubic-bezier(.21,1.02,.73,1) forwards',
        wiggle: 'wiggle 1.3s ease infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['emerald', 'dark'],
    darkTheme: 'dark',
  },
}
