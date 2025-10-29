import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ActionButton } from '@/components/common/ActionButton';

export const SupportCenterScreen: React.FC = () => (
  <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
    <Text className="mt-12 text-3xl font-semibold text-on-background">Support center</Text>
    <Text className="mt-3 text-sm text-slate-600">
      Reach the VibeCircle team for community concerns, accessibility requests, or press.
    </Text>

    <View className="mt-6 space-y-4">
      <View className="rounded-3xl bg-white p-4 shadow-subtle">
        <Text className="text-base font-semibold text-on-background">Community care</Text>
        <Text className="mt-1 text-sm text-slate-600">We respond to safety reports within 12 hours.</Text>
      </View>
      <View className="rounded-3xl bg-white p-4 shadow-subtle">
        <Text className="text-base font-semibold text-on-background">Accessibility</Text>
        <Text className="mt-1 text-sm text-slate-600">Let us know how we can make VibeCircle more inclusive.</Text>
      </View>
    </View>

    <View className="mt-10 space-y-3">
      <ActionButton label="Chat with support" />
      <ActionButton variant="ghost" label="View help articles" />
    </View>
  </ScrollView>
);
