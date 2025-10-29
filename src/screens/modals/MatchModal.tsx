import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useMatches } from '@/contexts';
import { useNavigation } from '@react-navigation/native';

export const MatchModal: React.FC = () => {
  const { matches } = useMatches();
  const match = matches[0];
  const navigation = useNavigation();

  if (!match) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center bg-black/60 px-6">
      <View className="w-full rounded-3xl bg-white p-6">
        <Text className="text-lg font-semibold text-on-background">You and {match.user.name} vibe!</Text>
        <Text className="mt-2 text-sm text-slate-600">
          Authenticity, values, and interests aligned. Start a chat or invite them to a circle.
        </Text>
        <View className="mt-6 space-y-3">
          <Pressable
            onPress={() => navigation.navigate('ConnectionsStack' as never)}
            className="items-center rounded-2xl bg-primary px-4 py-3"
          >
            <Text className="text-sm font-semibold text-white">Send a message</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            className="items-center rounded-2xl border border-slate-200 px-4 py-3"
          >
            <Text className="text-sm font-semibold text-slate-600">Later</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
