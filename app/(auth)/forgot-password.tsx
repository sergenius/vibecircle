import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { styled } from 'nativewind';
import { Mail } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const StyledView = styled(View);
const StyledText = styled(Text);

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <StyledView className="flex-1 bg-neutral-50 px-6 pt-24">
        <StyledView className="items-center">
          <StyledText className="text-6xl mb-6">📧</StyledText>
          <StyledText className="text-2xl font-bold text-neutral-800 mb-4 text-center">
            Check your email
          </StyledText>
          <StyledText className="text-neutral-600 text-center mb-8">
            We've sent password reset instructions to your email address
          </StyledText>
          
          <Button
            title="Back to Sign In"
            onPress={() => router.back()}
            variant="primary"
            size="lg"
            className="w-full"
          />
        </StyledView>
      </StyledView>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StyledView className="flex-1 px-6 pt-24">
        <StyledText className="text-3xl font-bold text-neutral-800 mb-2">
          Reset password
        </StyledText>
        <StyledText className="text-neutral-600 text-lg mb-8">
          Enter your email and we'll send you reset instructions
        </StyledText>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="your@email.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              leftIcon={<Mail size={20} color="#9ca3af" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
      </StyledView>

      <StyledView className="px-6 pb-8 pt-4 bg-white border-t border-neutral-200">
        <Button
          title="Send Reset Email"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          size="lg"
          className="w-full mb-3"
        />
        
        <Button
          title="Back to Sign In"
          onPress={() => router.back()}
          variant="ghost"
          className="w-full"
        />
      </StyledView>
    </KeyboardAvoidingView>
  );
}