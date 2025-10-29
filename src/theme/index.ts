import { DefaultTheme, Theme } from '@react-navigation/native';

export const colors = {
  primary: '#14B8A6',
  primaryLight: '#2DD4BF',
  primaryDark: '#0F766E',
  secondary: '#FB923C',
  secondaryLight: '#FDBA74',
  secondaryDark: '#C2410C',
  success: '#10B981',
  surface: '#FFFFFF',
  background: '#F9FAFB',
  onPrimary: '#0F172A',
  onBackground: '#111827',
  border: '#E5E7EB',
  muted: '#64748B',
  danger: '#EF4444',
  overlay: 'rgba(15, 23, 42, 0.65)',
};

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.onBackground,
    border: colors.border,
    notification: colors.secondary,
  },
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const gradients = {
  primary: ['#14B8A6', '#0EA5E9'],
  secondary: ['#FB923C', '#F97316'],
};

export const typography = {
  display: {
    fontFamily: 'Poppins_600SemiBold',
  },
  body: {
    fontFamily: 'Inter_400Regular',
  },
};
