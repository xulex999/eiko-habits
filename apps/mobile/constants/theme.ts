export const colors = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  primaryLight: '#EEF2FF',

  finance: '#10B981',
  financeHover: '#059669',
  financeLight: '#ECFDF5',

  streak: '#F59E0B',
  streakLight: '#FFFBEB',

  destructive: '#F43F5E',
  destructiveLight: '#FFF1F2',

  textPrimary: '#020617',
  textSecondary: '#334155',
  textTertiary: '#64748B',
  border: '#CBD5E1',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  subtleBg: '#F1F5F9',

  // Dark mode
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    elevated: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '700' as const },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  bodyLarge: { fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  overline: { fontSize: 11, lineHeight: 16, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
} as const;
