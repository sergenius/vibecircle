import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-secondary-500 active:bg-secondary-600',
  outline: 'border-2 border-primary-500 bg-transparent active:bg-primary-50',
  ghost: 'bg-transparent active:bg-neutral-100',
  danger: 'bg-danger-500 active:bg-danger-600',
};

const sizeStyles = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-4 py-3 rounded-xl',
  lg: 'px-6 py-4 rounded-2xl',
};

const textVariantStyles = {
  primary: 'text-white font-semibold',
  secondary: 'text-white font-semibold',
  outline: 'text-primary-600 font-semibold',
  ghost: 'text-neutral-700 font-medium',
  danger: 'text-white font-semibold',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export default function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <StyledPressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? 'opacity-50' : 'opacity-100'}
        flex-row items-center justify-center
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#14b8a6' : 'white'} 
        />
      ) : (
        <>
          {icon && <Text className="mr-2">{icon}</Text>}
          <StyledText
            className={`${textVariantStyles[variant]} ${textSizeStyles[size]}`}
            style={textStyle}
          >
            {title}
          </StyledText>
        </>
      )}
    </StyledPressable>
  );
}