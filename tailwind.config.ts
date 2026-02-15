import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a1628', // Dark navy - main background
        foreground: '#e5e7eb', // Light gray - main text
        card: '#0f1e33', // Lighter navy - cards and elevated surfaces
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
