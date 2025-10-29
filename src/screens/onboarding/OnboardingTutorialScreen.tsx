import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

const STEPS = [
  {
    title: 'Daily vibe drops',
    description: 'Share quick 15-second clips guided by prompts designed to highlight real moments.',
  },
  {
    title: 'Circles > swipes',
    description: 'Join up to five interest circles with weekly challenges to spark repeat interactions.',
  },
  {
    title: 'Safety-first design',
    description: 'AI moderation, age-based zones, and no dating overlap keep things purely friendship.',
  },
];

export const OnboardingTutorialScreen: React.FC<NativeStackScreenProps<OnboardingStackParamList, 'OnboardingTutorial'>> = ({
  navigation,
}) => (
  <View className="flex-1 bg-background px-6">
    <View className="mt-16">
      <Text className="text-2xl font-semibold text-on-background">How VibeCircle flows</Text>
      <Text className="mt-2 text-base text-slate-600">
        A quick walkthrough of the features Gen Z loves and trusts the most.
      </Text>
    </View>

    <View className="mt-10 space-y-6">
      {STEPS.map((step) => (
        <View key={step.title} className="rounded-3xl bg-white p-4 shadow-subtle">
          <Text className="text-lg font-semibold text-on-background">{step.title}</Text>
          <Text className="mt-2 text-sm text-slate-600">{step.description}</Text>
        </View>
      ))}
    </View>

    <View className="mt-auto mb-12">
      <ActionButton label="Continue" onPress={() => navigation.navigate('PrivacyAgreement')} />
    </View>
  </View>
);
