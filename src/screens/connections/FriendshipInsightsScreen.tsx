import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { useMatches, useUser } from '@/contexts';

export const FriendshipInsightsScreen: React.FC<NativeStackScreenProps<ConnectionsStackParamList, 'FriendshipInsights'>> = ({
  route,
}) => {
  const { userId } = route.params;
  const { matches } = useMatches();
  const { profile } = useUser();

  const match = matches.find((item) => item.user.id === userId);

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Friendship insights</Text>
      <Text className="mt-3 text-sm text-slate-600">
        Transparency around compatibility, shared values, and interaction streaks.
      </Text>

      {match ? (
        <View className="mt-6 rounded-3xl bg-white p-5 shadow-card">
          <Text className="text-base font-semibold text-on-background">{match.user.name}</Text>
          <Text className="mt-2 text-sm text-slate-600">Compatibility: {Math.round(match.compatibilityScore * 100)}%</Text>
          <Text className="mt-2 text-sm text-slate-600">Shared circles: {match.sharedCircles.length}</Text>
          <Text className="mt-2 text-sm text-slate-600">Values alignment: {Math.round(match.insight.valuesAlignment * 100)}%</Text>
          <Text className="mt-2 text-sm text-slate-600">Interest overlap: {Math.round(match.insight.interestOverlap * 100)}%</Text>
        </View>
      ) : (
        <Text className="mt-6 text-sm text-slate-600">No data yet—keep the conversation going!</Text>
      )}

      {profile && (
        <View className="mt-6 rounded-3xl bg-white p-5 shadow-card">
          <Text className="text-base font-semibold text-on-background">Your trends</Text>
          <Text className="mt-2 text-sm text-slate-600">Authenticity streak: {profile.stats.authenticityStreak} days</Text>
          <Text className="mt-2 text-sm text-slate-600">Connections formed: {profile.stats.friendshipsFormed}</Text>
          <Text className="mt-2 text-sm text-slate-600">Circles joined: {profile.stats.circlesJoined}</Text>
        </View>
      )}
    </ScrollView>
  );
};
