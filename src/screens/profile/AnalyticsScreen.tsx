import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useMatches, useVibes, useNotifications } from '@/contexts';

export const AnalyticsScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'Analytics'>> = () => {
  const { matches } = useMatches();
  const { vibes } = useVibes();
  const { notifications } = useNotifications();

  const connectionRate = matches.length > 0 ? Math.round(matches[0].compatibilityScore * 100) : 0;
  const connectionRateLabel = connectionRate.toString() + '%';

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Analytics dashboard</Text>
      <Text className="mt-3 text-sm text-slate-600">
        Monitor how authenticity, values alignment, and vibe engagement evolve.
      </Text>

      <View className="mt-6 space-y-4">
        <AnalyticsCard title="Connection rate" value={connectionRateLabel} description="Based on last 10 AI matches" />
        <AnalyticsCard title="Vibes shared" value={String(vibes.length)} description="Recent 30 days" />
        <AnalyticsCard title="Notifications" value={String(notifications.length)} description="Last week" />
      </View>
    </ScrollView>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, description }) => (
  <View className="rounded-3xl bg-white p-5 shadow-card">
    <Text className="text-sm font-semibold text-on-background">{title}</Text>
    <Text className="mt-2 text-3xl font-semibold text-primary">{value}</Text>
    <Text className="mt-2 text-xs text-slate-500">{description}</Text>
  </View>
);
