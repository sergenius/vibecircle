import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '@/types/navigation';
import { useMatches } from '@/contexts';
import { MatchReasonCard } from '@/components/vibe/MatchReasonCard';
import { VibeCard } from '@/components/vibe/VibeCard';
import { ActionButton } from '@/components/common/ActionButton';

export const MatchDetailsScreen: React.FC<NativeStackScreenProps<DiscoverStackParamList, 'MatchDetails'>> = ({
  route,
  navigation,
}) => {
  const { matchId } = route.params;
  const { matches } = useMatches();

  const match = matches.find((item) => item.id === matchId) ?? matches[0];

  if (!match) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-slate-600">No match data available.</Text>
      </View>
    );
  }

  const compatibility = Math.round(match.compatibilityScore * 100);

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <View className="mt-12">
        <Text className="text-sm font-medium uppercase tracking-widest text-primary">Compatibility breakdown</Text>
        <Text className="mt-2 text-3xl font-semibold text-on-background">{match.user.name}</Text>
        <Text className="mt-2 text-base text-slate-600">{compatibility}% match · {match.sharedCircles.length} shared circles</Text>
      </View>

      <View className="mt-8">
        <VibeCard vibe={match.vibe} user={match.user} />
      </View>

      <View className="mt-6">
        <MatchReasonCard match={match} />
      </View>

      <View className="mt-6 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-lg font-semibold text-on-background">Shared circles</Text>
        {match.sharedCircles.length === 0 ? (
          <Text className="mt-2 text-sm text-slate-600">No shared circles yet—try joining more communities.</Text>
        ) : (
          match.sharedCircles.map((circleId) => (
            <Text key={circleId} className="mt-2 text-sm text-slate-600">
              • {circleId}
            </Text>
          ))
        )}
      </View>

      <View className="mt-6">
        <ActionButton label="Send vibe invite" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};
