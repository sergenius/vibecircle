import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';
import { useAuth, useUser } from '@/contexts';

const AGREEMENTS = [
  'VibeCircle is friendship-only. I’ll honor community guidelines.',
  'I understand that AI moderation keeps spaces safe, and I can report anytime.',
  'I consent to responsible data handling and understand my privacy controls.',
];

export const PrivacyAgreementScreen: React.FC<NativeStackScreenProps<OnboardingStackParamList, 'PrivacyAgreement'>> = ({
  navigation,
}) => {
  const [acknowledged, setAcknowledged] = useState<boolean[]>(AGREEMENTS.map(() => false));
  const { completeOnboarding } = useAuth();
  const { profile } = useUser();

  const toggleAcknowledged = (index: number) => {
    setAcknowledged((prev) => prev.map((value, idx) => (idx === index ? !value : value)));
  };

  const allAcknowledged = acknowledged.every(Boolean);

  return (
    <View className="flex-1 bg-background px-6">
      <ScrollView className="mt-16" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-semibold text-on-background">Friendship-first commitment</Text>
        <Text className="mt-2 text-base text-slate-600">
          We center psychological safety. Please confirm these guidelines before diving in.
        </Text>

        <View className="mt-8 space-y-4">
          {AGREEMENTS.map((statement, index) => (
            <View key={statement} className="flex-row items-start rounded-3xl bg-white p-4 shadow-subtle">
              <Switch
                value={acknowledged[index]}
                onValueChange={() => toggleAcknowledged(index)}
                thumbColor={acknowledged[index] ? '#14B8A6' : '#CBD5F5'}
              />
              <Text className="ml-4 flex-1 text-sm text-slate-600">{statement}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="mb-12">
        <ActionButton
          label="Enter VibeCircle"
          disabled={!allAcknowledged}
          onPress={() => {
            if (profile) {
              completeOnboarding(profile);
            } else {
              navigation.reset({ index: 0, routes: [{ name: 'ProfileSetup' }] });
            }
          }}
        />
      </View>
    </View>
  );
};
