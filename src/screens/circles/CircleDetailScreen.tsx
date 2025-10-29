import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CirclesStackParamList } from '@/types/navigation';
import { useCircles } from '@/contexts';
import { ActionButton } from '@/components/common/ActionButton';
import { SafetyButton } from '@/components/safety/SafetyButton';

export const CircleDetailScreen: React.FC<NativeStackScreenProps<CirclesStackParamList, 'CircleDetail'>> = ({
  route,
  navigation,
}) => {
  const { circleId } = route.params;
  const { joined, recommended } = useCircles();
  const circle = [...joined, ...recommended].find((item) => item.id === circleId);

  if (!circle) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-slate-600">Circle not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <View className="mt-12">
        <Text className="text-xs font-medium uppercase tracking-widest text-primary">Interest circle</Text>
        <Text className="mt-2 text-3xl font-semibold text-on-background">{circle.name}</Text>
        <Text className="mt-3 text-base text-slate-600">{circle.description}</Text>
        <Text className="mt-3 text-sm text-slate-500">{circle.memberCount} members · {circle.category}</Text>
      </View>

      {circle.weeklyChallenge && (
        <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
          <Text className="text-sm font-semibold text-on-background">Weekly challenge</Text>
          <Text className="mt-2 text-base text-slate-700">{circle.weeklyChallenge.title}</Text>
          <Text className="mt-2 text-sm text-slate-600">{circle.weeklyChallenge.description}</Text>
          {circle.weeklyChallenge.rewardBadge && (
            <Text className="mt-3 text-xs uppercase tracking-wide text-secondary">
              Reward: {circle.weeklyChallenge.rewardBadge}
            </Text>
          )}
          <Text className="mt-2 text-xs text-slate-500">Due {new Date(circle.weeklyChallenge.dueDate).toDateString()}</Text>
        </View>
      )}

      <View className="mt-8 rounded-3xl bg-white p-5 shadow-subtle">
        <Text className="text-sm font-semibold text-on-background">Recent vibes</Text>
        <Text className="mt-2 text-sm text-slate-600">
          Placeholder feed showing how members respond to prompts. Swap in real data when backend connects.
        </Text>
        <ActionButton variant="ghost" label="Share a vibe" onPress={() => navigation.navigate('CreateCircle')} />
      </View>

      <View className="mt-8 flex-row items-center justify-between">
        <ActionButton
          label={circle.isJoined ? 'Invite friends' : 'Join circle'}
          onPress={() => navigation.navigate('CircleSettings', { circleId })}
        />
        <SafetyButton label="Circle rules" onPress={() => navigation.navigate('CircleSettings', { circleId })} />
      </View>
    </ScrollView>
  );
};
