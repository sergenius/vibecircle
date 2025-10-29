import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { mockSafetyTips } from '@/data/mockData';
import { ActionButton } from '@/components/common/ActionButton';

export const SafetyCenterScreen: React.FC = () => (
  <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
    <Text className="mt-12 text-3xl font-semibold text-on-background">Safety center</Text>
    <Text className="mt-3 text-sm text-slate-600">
      Friendship-only spaces with AI moderation and human review when needed.
    </Text>

    <View className="mt-6 space-y-4">
      {mockSafetyTips.map((tip, index) => (
        <View key={tip} className="rounded-3xl bg-white p-4 shadow-subtle">
          <Text className="text-sm font-semibold text-on-background">Safety tip {index + 1}</Text>
          <Text className="mt-2 text-sm text-slate-600">{tip}</Text>
        </View>
      ))}
    </View>

    <View className="mt-10 space-y-3">
      <ActionButton label="Report user/content" />
      <ActionButton variant="ghost" label="Emergency resources" />
    </View>
  </ScrollView>
);
