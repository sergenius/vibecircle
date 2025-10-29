import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

export const VerificationScreen: React.FC<NativeStackScreenProps<AuthStackParamList, 'Verification'>> = ({
  navigation,
  route,
}) => {
  const [code, setCode] = useState('');
  const { contact } = route.params;

  return (
    <View className="flex-1 bg-background px-6">
      <View className="mt-16">
        <Text className="text-2xl font-semibold text-on-background">Verify your account</Text>
        <Text className="mt-2 text-base text-slate-600">
          We sent a 6-digit code to {contact}. Enter it below to start shaping your vibe profile.
        </Text>
      </View>

      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="••••••"
        className="mt-10 rounded-3xl border border-slate-200 bg-white px-6 py-4 text-center text-xl tracking-[10px]"
      />

      <View className="mt-6">
        <ActionButton label="Verify" onPress={() => navigation.navigate('AgeVerification')} disabled={code.length !== 6} />
        <ActionButton variant="ghost" label="Resend code" onPress={() => setCode('')} />
      </View>
    </View>
  );
};
