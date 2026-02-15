import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#020617', // deep slate
        foreground: '#e5e7eb',
        card: '#020617',
        'card-foreground': '#e5e7eb',
        border: '#1f2937',
        muted: '#0f172a',
        'muted-foreground': '#9ca3af',
        primary: '#3b82f6',
        'primary-foreground': '#f9fafb',
      },
    },
  },
  plugins: [],
};

export default config;
