/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          base: '#0B0A10',
          paper: '#14121E',
          surface: '#1A1728',
          card: 'rgba(23, 20, 36, 0.65)',
          lightBase: '#FBF9F5',
          lightSurface: '#FFFFFF',
          lightCard: 'rgba(255, 255, 255, 0.75)',

          violet: '#7C3AED',
          magenta: '#FF2E88',
          cyan: '#00E5FF',
          gold: '#FFD23F',
          
          textPrimary: '#F6F5F9',
          textMuted: '#9B96B0',
          lightText: '#181524',
          lightMuted: '#67627B',
        },
        editorial: {
          lightBg: '#FBF9F5',
          lightSurface: '#FFFFFF',
          lightText: '#181524',
          lightMuted: '#67627B',
          lightBorder: 'rgba(124, 58, 237, 0.15)',

          darkBg: '#0B0A10',
          darkSurface: '#14121E',
          darkText: '#F6F5F9',
          darkMuted: '#9B96B0',
          darkBorder: 'rgba(124, 58, 237, 0.25)',

          accent: '#FF2E88',
          accentHover: '#E01D74',
          accentLight: 'rgba(255, 46, 136, 0.12)',
          accentDark: 'rgba(255, 46, 136, 0.22)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      lineHeight: {
        editorial: '1.75',
      },
      maxWidth: {
        reading: '680px',
      },
      animation: {
        'aurora-drift': 'aurora 24s ease-in-out infinite alternate',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'gradient-x': 'gradientX 12s ease infinite',
        'ink-bleed': 'inkBleed 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translate(0%, 0%) scale(1) rotate(0deg)' },
          '50%': { transform: 'translate(-5%, 8%) scale(1.15) rotate(5deg)' },
          '100%': { transform: 'translate(8%, -6%) scale(1.08) rotate(-4deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        inkBleed: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(124, 58, 237, 0.45)',
        'glow-magenta': '0 0 25px -5px rgba(255, 46, 136, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(0, 229, 255, 0.45)',
        'glow-gold': '0 0 25px -5px rgba(255, 210, 63, 0.45)',
        'glass-card': '0 10px 30px -5px rgba(11, 10, 16, 0.3)',
      },
    },
  },
  plugins: [],
}
