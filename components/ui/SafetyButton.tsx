import React from 'react';
import { View, Pressable } from 'react-native';
import { Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

interface SafetyButtonProps {
  onPress: () => void;
  variant?: 'shield' | 'alert';
  className?: string;
}

export default function SafetyButton({ 
  onPress, 
  variant = 'shield',
  className = '' 
}: SafetyButtonProps) {
  const Icon = variant === 'shield' ? Shield : AlertTriangle;
  const bgColor = variant === 'shield' ? 'bg-success-500' : 'bg-danger-500';
  
  return (
    <StyledPressable
      onPress={onPress}
      className={`
        ${bgColor} rounded-full p-3 shadow-lg
        active:scale-95
        ${className}
      `}
    >
      <Icon size={20} color="white" />
    </StyledPressable>
  );
}