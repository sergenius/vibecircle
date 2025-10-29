import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

export const ForgotPasswordScreen: React.FC<NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>> = ({
  navigation,
}) => {
  const [contact, setContact] = useState('');

  return (
    <View className="flex-1 bg-background px-6">
      <View className="mt-16">
        <Text className="text-2xl font-semibold text-on-background">Reset your password</Text>
        <Text className="mt-2 text-base text-slate-600">
          We will send a reset link to your email or phone. Resetting takes under a minute.
        </Text>
      </View>

      <TextInput
        value={contact}
        onChangeText={setContact}
        placeholder="you@example.com"
        className="mt-10 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
      />

      <View className="mt-6">
        <ActionButton label="Send reset link" onPress={() => navigation.goBack()} disabled={!contact} />
      </View>
    </View>
  );
};
