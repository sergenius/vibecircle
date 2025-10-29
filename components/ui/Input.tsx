import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <StyledView className={`mb-4 ${className}`}>
      {label && (
        <StyledText className="text-neutral-700 font-medium mb-2 text-sm">
          {label}
        </StyledText>
      )}
      
      <StyledView className={`
        flex-row items-center
        bg-white border-2 rounded-xl px-4 py-3
        ${error ? 'border-danger-500' : 'border-neutral-200 focus:border-primary-500'}
      `}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        
        <StyledTextInput
          className="flex-1 text-neutral-800 text-base"
          placeholderTextColor="#9ca3af"
          {...props}
        />
        
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </StyledView>
      
      {error && (
        <StyledText className="text-danger-500 text-sm mt-1">
          {error}
        </StyledText>
      )}
    </StyledView>
  );
}