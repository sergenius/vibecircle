import React from 'react';
import { View, Text } from 'react-native';
import { FriendshipMilestone } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FriendshipBadgeProps {
  milestone: FriendshipMilestone;
}

export const FriendshipBadge: React.FC<FriendshipBadgeProps> = ({ milestone }) => (
  <View className="mr-3 mb-3 w-40 rounded-3xl bg-white p-4 shadow-subtle">
    <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
      <MaterialCommunityIcons name="hand-coin" size={22} color="#FB923C" />
    </View>
    <Text className="text-sm font-semibold text-on-background">{milestone.title}</Text>
    <Text className="mt-1 text-xs text-slate-500">{milestone.description}</Text>
    <Text className="mt-2 text-xs font-medium uppercase text-slate-400">{milestone.level}</Text>
  </View>
);
