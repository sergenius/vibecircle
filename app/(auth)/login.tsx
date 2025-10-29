import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { styled } from 'nativewind';
import { Mail, Eye, EyeOff } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      // Navigation will be handled by the root navigator based on auth state
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StyledScrollView className="flex-1 px-6 pt-24">
        {/* Header */}
        <StyledView className="mb-8">
          <StyledText className="text-3xl font-bold text-neutral-800 mb-2">
            Welcome back
          </StyledText>
          <StyledText className="text-neutral-600 text-lg">
            Sign in to continue vibing
          </StyledText>
        </StyledView>

        {/* Form */}
        <StyledView className="space-y-4 mb-8">
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

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry={!showPassword}
                rightIcon={
                  <Button
                    title=""
                    onPress={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    className="p-0"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </Button>
                }
              />
            )}
          />
        </StyledView>

        {/* Forgot Password */}
        <Button
          title="Forgot password?"
          onPress={() => router.push('/(auth)/forgot-password')}
          variant="ghost"
          className="self-end mb-8"
          textStyle={{ color: '#14b8a6' }}
        />
      </StyledScrollView>

      {/* Login Button */}
      <StyledView className="px-6 pb-8 pt-4 bg-white border-t border-neutral-200">
        <Button
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          size="lg"
          className="w-full"
        />
        
        <Button
          title="Need an account? Sign up"
          onPress={() => router.push('/(auth)/register')}
          variant="ghost"
          className="w-full mt-3"
        />
      </StyledView>
    </KeyboardAvoidingView>
  );
}