import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
        },
        finance: {
          DEFAULT: 'var(--finance)',
          light: 'var(--finance-light)',
        },
        streak: {
          DEFAULT: 'var(--streak)',
          light: 'var(--streak-light)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          light: 'var(--destructive-light)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
