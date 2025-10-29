import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '@/types/navigation';
import { useMatches, useUser } from '@/contexts';
import { VibeCard } from '@/components/vibe/VibeCard';
import { MatchReasonCard } from '@/components/vibe/MatchReasonCard';
import { ActionButton } from '@/components/common/ActionButton';

export const DiscoverHomeScreen: React.FC<NativeStackScreenProps<DiscoverStackParamList, 'DiscoverHome'>> = ({
  navigation,
}) => {
  const { matches, connectWithMatch, passOnMatch, remainingToday } = useMatches();
  const { profile } = useUser();

  const firstName = profile?.name.split(' ')[0] ?? 'there';

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 120 }}>
      <View className="mt-12">
        <Text className="text-sm font-medium uppercase tracking-widest text-primary">Daily vibe matches</Text>
        <Text className="mt-2 text-3xl font-semibold text-on-background">
          Hey {firstName}, here’s who’s vibing like you
        </Text>
        <Text className="mt-3 text-sm text-slate-500">{remainingToday} matches left today. Refresh at midnight.</Text>
      </View>

      <View className="mt-10 space-y-6">
        {matches.map((match) => {
          const compatibility = Math.round(match.compatibilityScore * 100);
          const compatibilityLabel = compatibility.toString() + '% compatible';

          return (
            <View key={match.id}>
              <VibeCard
                vibe={match.vibe}
                user={match.user}
                onConnect={() => connectWithMatch(match.id)}
                onPass={() => passOnMatch(match.id)}
                contextLabel={compatibilityLabel}
              />
              <MatchReasonCard match={match} />
            </View>
          );
        })}
      </View>

      <View className="mt-10 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-lg font-semibold text-on-background">Vibe Check mode</Text>
        <Text className="mt-2 text-sm text-slate-600">
          Tune matches to your current mood. We factor in energy, interests, and authenticity signals.
        </Text>
        <ActionButton
          label="Open Vibe Check"
          onPress={() => navigation.navigate('MatchDetails', { matchId: matches[0]?.id ?? 'match-1' })}
        />
      </View>

      <ActionButton
        variant="ghost"
        label="Adjust filters"
        onPress={() => navigation.navigate('DiscoveryFilters')}
      />
    </ScrollView>
  );
};
