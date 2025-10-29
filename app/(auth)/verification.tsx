import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { styled } from 'nativewind';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function VerificationScreen() {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = () => {
    if (code.length === 6) {
      router.push('/(auth)/onboarding-profile-setup');
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    // Trigger resend logic
  };

  return (
    <StyledView className="flex-1 bg-neutral-50 px-6 pt-24">
      <StyledText className="text-3xl font-bold text-neutral-800 mb-2">
        Check your phone
      </StyledText>
      <StyledText className="text-neutral-600 text-lg mb-8">
        We've sent a 6-digit code to your phone number
      </StyledText>

      <Input
        placeholder="Enter 6-digit code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        className="text-center text-2xl tracking-widest"
      />

      <StyledView className="items-center mt-6">
        {canResend ? (
          <Button
            title="Resend Code"
            onPress={handleResend}
            variant="ghost"
          />
        ) : (
          <StyledText className="text-neutral-500">
            Resend in {countdown}s
          </StyledText>
        )}
      </StyledView>

      <StyledView className="absolute bottom-8 left-6 right-6">
        <Button
          title="Verify"
          onPress={handleVerify}
          disabled={code.length !== 6}
          size="lg"
          className="w-full"
        />
      </StyledView>
    </StyledView>
  );
}