/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#000000',
          secondary: '#0d0d0d',
          tertiary: '#141414',
        },
        card: {
          DEFAULT: '#0d0d0d',
        },
        border: {
          DEFAULT: '#1a1a1a',
        },
        text: {
          primary: '#f5f7fa',
          secondary: '#a8b4c0',
          tertiary: '#5c6878',
        },
        brand: {
          DEFAULT: '#1fbf8f',
          hover: '#17a87d',
          alpha: 'rgba(31, 191, 143, 0.08)',
        },
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          'danger-dark': '#dc2626',
          info: '#38bdf8',
          purple: '#a371f7',
          orange: '#f97316',
        },
        ink: {
          onBrand: '#0c0c0f',
          white: '#ffffff',
          black: '#000000',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', '"Noto Sans"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.55)',
        md: '0 4px 12px rgba(0, 0, 0, 0.65)',
        lg: '0 18px 40px -22px rgba(0, 0, 0, 0.85)',
        xl: '0 30px 60px -30px rgba(0, 0, 0, 0.90)',
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '24px',
      },
      backgroundImage: {
        'app-shell': 'linear-gradient(135deg, rgba(1, 5, 12, 0.9), rgba(1, 5, 12, 0.4))',
        'public-cta': 'linear-gradient(145deg, rgba(0, 0, 0, 0.82), rgba(31, 191, 143, 0.16))',
        'auth-glow': 'radial-gradient(ellipse 72% 52% at 50% 18%, rgba(31, 191, 143, 0.12) 0%, transparent 68%)',
      },
      keyframes: {
        'skeleton-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '60%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pwa-update-rise': {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'binary-pop': {
          '0%': { opacity: '0', transform: 'translate(-50%, -50%) scale(0.7)' },
          '25%': { opacity: '1' },
          '100%': {
            opacity: '0',
            transform:
              'translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, -60px))) scale(1.2)',
          },
        },
        'table-shimmer': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: '200px 0' },
        },
        'cursor-blink': {
          '0%': { opacity: '0.85' },
          '50%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        'cs-dot-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'cs-file-progress': {
          from: { width: '0%' },
          to: { width: '100%' },
        },
        'badge-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '70%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'modal-card-in': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'stat-in': {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'stat-shimmer': {
          '0%': { backgroundPosition: '160% center' },
          '100%': { backgroundPosition: '0% center' },
        },
        'hs-reveal': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'hero-cursor-idle': {
          '0%, 45%, 100%': { opacity: '0.5' },
          '50%, 95%': { opacity: '0' },
        },
        'hero-scroll-pulse': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(5px)', opacity: '0.8' },
        },
        'silhouette-drift': {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '40%': { transform: 'translate(-50%, -51%) scale(1.015)', opacity: '0.85' },
          '70%': { transform: 'translate(-50%, -49%) scale(0.99)', opacity: '1' },
        },
        'why-in-x': {
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'why-in-y': {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'trust-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'lb-rank-pulse': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 0 0 color-mix(in srgb, var(--primary-color) 40%, transparent)',
          },
          '50%': { opacity: '0.6', boxShadow: '0 0 0 5px transparent' },
        },
        'partners-fade': {
          to: { opacity: '1' },
        },
      },
      animation: {
        'skeleton-shimmer': 'skeleton-shimmer 1.4s ease-in-out infinite',
        'pwa-update-rise': 'pwa-update-rise 0.2s ease-out',
        'binary-pop': 'binary-pop var(--duration, 1s) ease forwards',
        'table-shimmer': 'table-shimmer 1.4s ease-in-out infinite',
        'cursor-blink': 'cursor-blink 1.06s step-start infinite',
        'cs-dot-pulse': 'cs-dot-pulse 2.4s ease-in-out infinite',
        'cs-file-progress': 'cs-file-progress 1s linear forwards',
        'badge-pulse': 'badge-pulse 1.8s ease-out infinite',
        'slide-down': 'slide-down 0.3s ease',
        'scale-in': 'scale-in 0.5s ease',
        'modal-card-in': 'modal-card-in 0.22s cubic-bezier(0.34, 1.36, 0.64, 1) forwards',
        'stat-in': 'stat-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'stat-shimmer': 'stat-shimmer 1.6s ease-out forwards',
        'hs-reveal': 'hs-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'hero-cursor': 'hero-cursor 0.55s step-end infinite',
        'hero-cursor-idle': 'hero-cursor-idle 1.1s step-end infinite',
        'hero-scroll-pulse': 'hero-scroll-pulse 2s ease-in-out infinite',
        'silhouette-drift': 'silhouette-drift 18s ease-in-out infinite',
        'why-in-x': 'why-in-x 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'why-in-y': 'why-in-y 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'trust-scroll': 'trust-scroll 26s linear infinite',
        'lb-rank-pulse': 'lb-rank-pulse 2s ease-in-out infinite',
        'partners-fade': 'partners-fade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};
