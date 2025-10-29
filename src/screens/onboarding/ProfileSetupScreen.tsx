import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';
import { Chip } from '@/components/common/Chip';
import { INTEREST_CATEGORIES } from '@/constants/interestCategories';
import { FRIENDSHIP_VALUES, DAILY_VIBE_PROMPTS } from '@/constants/prompts';
import { useUser, useAuth } from '@/contexts';

const STEPS = ['Basic Info', 'Interests', 'Values', 'First Vibe'] as const;

type StepKey = (typeof STEPS)[number];

export const ProfileSetupScreen: React.FC<NativeStackScreenProps<OnboardingStackParamList, 'ProfileSetup'>> = ({
  navigation,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState('Ava Reyes');
  const [username, setUsername] = useState('ava.codes');
  const [pronouns, setPronouns] = useState('she/her');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Mental Health & Wellness']);
  const [selectedValues, setSelectedValues] = useState<string[]>(['Empathy', 'Curiosity']);
  const [selectedPrompt] = useState(DAILY_VIBE_PROMPTS[0]);

  const { updateProfile } = useUser();
  const { completeOnboarding } = useAuth();

  const currentStep = STEPS[stepIndex];

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((index) => index + 1);
    } else {
      updateProfile({
        name,
        username,
        pronouns,
        interests: selectedInterests,
        values: selectedValues,
      });
      completeOnboarding({
        id: 'user-1',
        name,
        username,
        pronouns,
        ageBracket: '22-25',
        bio: 'Designing joyful experiences, organizing community hack nights, and caring for plants.',
        interests: selectedInterests,
        values: selectedValues,
        mainVibeId: 'vibe-1',
        authenticityScore: 0.87,
        mood: 'creative',
        location: 'Austin, TX',
        stats: {
          friendshipsFormed: 0,
          circlesJoined: 0,
          authenticityStreak: 0,
          vibesShared: 0,
        },
        milestones: [],
      });
    }
  };

  const goBack = () => setStepIndex((index) => Math.max(0, index - 1));

  const toggleItem = (list: string[], value: string, setList: (next: string[]) => void) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  };

  return (
    <View className="flex-1 bg-background px-6">
      <View className="mt-16">
        <Text className="text-sm font-medium uppercase tracking-widest text-primary">Profile Setup</Text>
        <Text className="mt-2 text-2xl font-semibold text-on-background">{currentStep}</Text>
        <Text className="mt-2 text-base text-slate-600">
          {stepIndex === 0 && 'Share how you want to be recognized in the community.'}
          {stepIndex === 1 && 'Pick up to five circles-worth of interests to unlock curated vibes.'}
          {stepIndex === 2 && 'These values power our compatibility algorithm—choose what feels true.'}
          {stepIndex === 3 && 'Record a quick vibe, we will guide you with prompts and countdowns.'}
        </Text>
      </View>

      {currentStep === 'Basic Info' && (
        <View className="mt-10 space-y-5">
          <View>
            <Text className="text-sm font-medium text-slate-600">Preferred name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
            />
          </View>
          <View>
            <Text className="text-sm font-medium text-slate-600">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
            />
          </View>
          <View>
            <Text className="text-sm font-medium text-slate-600">Pronouns</Text>
            <TextInput
              value={pronouns}
              onChangeText={setPronouns}
              className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
            />
          </View>
        </View>
      )}

      {currentStep === 'Interests' && (
        <View className="mt-10 flex-row flex-wrap">
          {INTEREST_CATEGORIES.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              selected={selectedInterests.includes(interest)}
              onPress={() => toggleItem(selectedInterests, interest, setSelectedInterests)}
            />
          ))}
        </View>
      )}

      {currentStep === 'Values' && (
        <View className="mt-10 flex-row flex-wrap">
          {FRIENDSHIP_VALUES.map((value) => (
            <Chip
              key={value}
              label={value}
              selected={selectedValues.includes(value)}
              onPress={() => toggleItem(selectedValues, value, setSelectedValues)}
            />
          ))}
        </View>
      )}

      {currentStep === 'First Vibe' && (
        <View className="mt-10 space-y-5">
          <View className="rounded-3xl bg-white p-4 shadow-card">
            <Text className="text-sm font-semibold text-on-background">Today’s prompt</Text>
            <Text className="mt-2 text-base text-slate-600">{selectedPrompt}</Text>
          </View>
          <ActionButton label="Record 15-second vibe" onPress={() => {}} />
          <Text className="text-xs text-slate-500">
            No pressure—our AI checks for authenticity cues but never judges. You can re-record anytime.
          </Text>
        </View>
      )}

      <View className="mt-auto mb-12 flex-row items-center justify-between">
        <ActionButton label="Back" variant="ghost" onPress={goBack} disabled={stepIndex === 0} />
        <ActionButton label={stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'} onPress={goNext} />
      </View>
    </View>
  );
};
