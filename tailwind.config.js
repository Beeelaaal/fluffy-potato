/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-body)',    'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        // Primary 3-color palette
        funky: {
          cyan:   '#2EF2FF',
          orange: '#FF7A18',
          lime:   '#D8FF3E',
          // extended
          purple: '#9B6DFF',
          coral:  '#FF5C7A',
        },
        dark: {
          900: '#0A0514',
          800: '#110A20',
          700: '#1A0F30',
          600: '#221440',
          500: '#2C1A52',
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'cyan-gradient':     'linear-gradient(135deg, #2EF2FF, #00BBDD)',
        'orange-gradient':   'linear-gradient(135deg, #FF7A18, #FF5500)',
        'lime-cyan-gradient':'linear-gradient(135deg, #D8FF3E, #2EF2FF)',
        'dark-gradient':     'linear-gradient(180deg, #0A0514, #070310)',
      },
      animation: {
        'float':      'float 4s ease-in-out infinite',
        'spin-slow':  'spin-slow 8s linear infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float:     { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' } },
        'spin-slow':{ to:{ transform:'rotate(360deg)' } },
        shimmer:   { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glass':    '0 8px 32px rgba(0,0,0,0.6)',
        'cyan':     '0 0 24px rgba(46,242,255,0.30)',
        'orange':   '0 0 24px rgba(255,122,24,0.32)',
        'lime':     '0 0 24px rgba(216,255,62,0.28)',
        'neon-lg':  '0 0 50px rgba(46,242,255,0.25), 0 0 100px rgba(46,242,255,0.10)',
      },
      borderColor: {
        glass:    'rgba(255,255,255,0.07)',
        'glass-2':'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [],
};
