import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { PREMIUM_FEATURES, SUBSCRIPTION_DETAILS } from '@/constants/premium';
import { ActionButton } from '@/components/common/ActionButton';

export const PremiumScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'Premium'>> = () => (
  <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
    <Text className="mt-12 text-3xl font-semibold text-on-background">VibeCircle+</Text>
    <Text className="mt-3 text-base text-slate-600">
      Unlock deeper insights and unlimited matches for friendships that go the distance.
    </Text>

    <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
      <Text className="text-xl font-semibold text-on-background">{SUBSCRIPTION_DETAILS.price}</Text>
      <Text className="mt-2 text-sm text-slate-600">{SUBSCRIPTION_DETAILS.highlight}</Text>
      <Text className="mt-2 text-xs text-slate-500">Includes {SUBSCRIPTION_DETAILS.trial}</Text>
    </View>

    <View className="mt-8 space-y-3">
      {PREMIUM_FEATURES.map((feature) => (
        <View key={feature.id} className="rounded-3xl bg-white p-4 shadow-subtle">
          <Text className="text-base font-semibold text-on-background">{feature.name}</Text>
          <Text className="mt-1 text-sm text-slate-600">{feature.description}</Text>
        </View>
      ))}
    </View>

    <View className="mt-10">
      <ActionButton label="Start 7-day trial" />
      <ActionButton variant="ghost" label="Restore purchases" />
    </View>
  </ScrollView>
);
