import React from 'react';
import { View, ViewStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

const variantStyles = {
  default: 'bg-white rounded-2xl p-4',
  elevated: 'bg-white rounded-2xl p-4 shadow-lg shadow-neutral-200',
  outlined: 'bg-white rounded-2xl p-4 border border-neutral-200',
};

export default function Card({ 
  children, 
  className = '', 
  style,
  variant = 'default' 
}: CardProps) {
  return (
    <StyledView 
      className={`${variantStyles[variant]} ${className}`}
      style={style}
    >
      {children}
    </StyledView>
  );
}