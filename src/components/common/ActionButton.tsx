import React from 'react';
import { Pressable, Text } from 'react-native';
import clsx from 'clsx';

interface ActionButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}) => {
  const baseStyles = 'mt-4 flex-row items-center justify-center rounded-2xl px-5 py-3';
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    ghost: 'bg-transparent border border-slate-200',
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={clsx(baseStyles, variantStyles, disabled && 'opacity-50')}
    >
      {icon}
      <Text className={clsx('text-base font-semibold', variant === 'ghost' ? 'text-primary' : 'text-white')}>
        {label}
      </Text>
    </Pressable>
  );
};
