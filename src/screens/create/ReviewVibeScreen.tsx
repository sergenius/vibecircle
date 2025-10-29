import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateVibeStackParamList } from '@/types/navigation';
import { VibePlayer } from '@/components/vibe/VibePlayer';
import { Chip } from '@/components/common/Chip';
import { ActionButton } from '@/components/common/ActionButton';
import { useVibes, useCircles } from '@/contexts';

export const ReviewVibeScreen: React.FC<NativeStackScreenProps<CreateVibeStackParamList, 'ReviewVibe'>> = ({
  navigation,
}) => {
  const { vibes, selectedVibeId } = useVibes();
  const { joined } = useCircles();
  const vibe = vibes.find((item) => item.id === selectedVibeId) ?? vibes[0];

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Preview & share</Text>
      <Text className="mt-3 text-sm text-slate-500">
        Add context tags, choose visibility, and share with your favorite circles.
      </Text>

      {vibe && (
        <View className="mt-6">
          <VibePlayer source={vibe.videoUri} autoPlay={false} />
        </View>
      )}

      <Text className="mt-8 text-sm font-semibold text-on-background">Context tags</Text>
      <TextInput
        placeholder="#bookworm #nightowl"
        className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
      />

      <Text className="mt-8 text-sm font-semibold text-on-background">Share with circles</Text>
      <View className="mt-3 flex-row flex-wrap">
        {joined.map((circle) => (
          <Chip key={circle.id} label={circle.name} />
        ))}
      </View>

      <Text className="mt-8 text-sm font-semibold text-on-background">Visibility</Text>
      <View className="mt-3 rounded-3xl bg-white p-4 shadow-subtle">
        <Text className="text-base font-semibold text-on-background">Friends & joined circles</Text>
        <Text className="mt-2 text-sm text-slate-600">
          Recommended for authenticity streaks. Only people you connect with or circle members can view it.
        </Text>
      </View>

      <View className="mt-10">
        <ActionButton label="Share vibe" onPress={() => navigation.navigate('UploadProcessing')} />
      </View>
    </ScrollView>
  );
};
