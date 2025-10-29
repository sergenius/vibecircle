import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import clsx from 'clsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateVibeStackParamList } from '@/types/navigation';
import { DAILY_VIBE_PROMPTS, MOOD_OPTIONS } from '@/constants/prompts';
import { Chip } from '@/components/common/Chip';
import { ActionButton } from '@/components/common/ActionButton';
import { useVibes } from '@/contexts';

export const CreatePromptScreen: React.FC<NativeStackScreenProps<CreateVibeStackParamList, 'CreatePrompt'>> = ({
  navigation,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState(DAILY_VIBE_PROMPTS[0]);
  const [selectedMood, setSelectedMood] = useState<typeof MOOD_OPTIONS[number]>('creative');
  const { startRecording } = useVibes();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <View className="mt-12">
        <Text className="text-sm font-medium uppercase tracking-widest text-primary">Create vibe</Text>
        <Text className="mt-2 text-3xl font-semibold text-on-background">Share a 15-second moment</Text>
        <Text className="mt-3 text-sm text-slate-500">
          Pick a prompt and mood so our AI can match your vibe thoughtfully.
        </Text>
      </View>

      <View className="mt-8 space-y-4">
        {DAILY_VIBE_PROMPTS.map((prompt) => {
          const selected = prompt === selectedPrompt;
          return (
            <View
              key={prompt}
              className={clsx(
                'rounded-3xl border px-4 py-4',
                selected ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white',
              )}
            >
              <Text className="text-sm font-semibold text-on-background">Prompt</Text>
              <Text className="mt-2 text-base text-slate-600">{prompt}</Text>
              <ActionButton
                label={selected ? 'Selected' : 'Use this prompt'}
                variant={selected ? 'ghost' : 'primary'}
                onPress={() => setSelectedPrompt(prompt)}
              />
            </View>
          );
        })}
      </View>

      <View className="mt-8">
        <Text className="text-sm font-semibold text-on-background">Mood</Text>
        <View className="mt-3 flex-row flex-wrap">
          {MOOD_OPTIONS.map((mood) => (
            <Chip key={mood} label={mood} selected={selectedMood === mood} onPress={() => setSelectedMood(mood)} />
          ))}
        </View>
      </View>

      <View className="mt-10">
        <ActionButton
          label="Open camera"
          onPress={() => {
            startRecording(selectedPrompt);
            navigation.navigate('RecordVibe');
          }}
        />
      </View>
    </ScrollView>
  );
};
