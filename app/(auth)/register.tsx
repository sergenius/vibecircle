import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { styled } from 'nativewind';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

interface RegisterForm {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      return;
    }

    try {
      setIsLoading(true);
      await register(data.email, data.password, data.phone);
      router.push('/(auth)/verification');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StyledScrollView className="flex-1 px-6 pt-16">
        {/* Header */}
        <StyledView className="mb-8">
          <StyledText className="text-3xl font-bold text-neutral-800 mb-2">
            Create your account
          </StyledText>
          <StyledText className="text-neutral-600 text-lg">
            Join the friendship revolution
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
            name="phone"
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^\+?[\d\s\-\(\)]+$/,
                message: 'Invalid phone number',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                leftIcon={<Phone size={20} color="#9ca3af" />}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Create a strong password"
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

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: (value) => 
                value === password || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  <Button
                    title=""
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    className="p-0"
                  >
                    {showConfirmPassword ? (
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

        {/* Terms */}
        <StyledText className="text-neutral-600 text-sm text-center mb-8">
          By creating an account, you agree to our{' '}
          <StyledText className="text-primary-600 font-medium">
            Terms of Service
          </StyledText>
          {' '}and{' '}
          <StyledText className="text-primary-600 font-medium">
            Privacy Policy
          </StyledText>
        </StyledText>
      </StyledScrollView>

      {/* Continue Button */}
      <StyledView className="px-6 pb-8 pt-4 bg-white border-t border-neutral-200">
        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          size="lg"
          className="w-full"
        />
        
        <Button
          title="Already have an account? Sign in"
          onPress={() => router.push('/(auth)/login')}
          variant="ghost"
          className="w-full mt-3"
        />
      </StyledView>
    </KeyboardAvoidingView>
  );
}