import React from 'react';
import { View, Text } from 'react-native';
import { PREMIUM_FEATURES } from '@/constants/premium';
import { ActionButton } from '@/components/common/ActionButton';

export const PremiumModal: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-black/60 px-6">
    <View className="w-full rounded-3xl bg-white p-6">
      <Text className="text-lg font-semibold text-on-background">Daily match limit reached</Text>
      <Text className="mt-2 text-sm text-slate-600">
        Upgrade to VibeCircle+ for unlimited curated matches and deeper AI insights.
      </Text>

      <View className="mt-4 space-y-2">
        {PREMIUM_FEATURES.slice(0, 3).map((feature) => (
          <Text key={feature.id} className="text-sm text-slate-600">• {feature.name}</Text>
        ))}
      </View>

      <View className="mt-6">
        <ActionButton label="Upgrade now" />
        <ActionButton label="Maybe later" variant="ghost" />
      </View>
    </View>
  </View>
);
