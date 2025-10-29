import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useUser } from '@/contexts';
import { FriendshipBadge } from '@/components/friendship/FriendshipBadge';

export const AchievementsScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'Achievements'>> = () => {
  const { profile } = useUser();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Achievements</Text>
      <Text className="mt-3 text-sm text-slate-600">Every milestone celebrates consistent, authentic connection.</Text>

      <View className="mt-6 flex-row flex-wrap">
        {profile?.milestones.map((milestone) => (
          <FriendshipBadge key={milestone.id} milestone={milestone} />
        ))}
      </View>
    </ScrollView>
  );
};
