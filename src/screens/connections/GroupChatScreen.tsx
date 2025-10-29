import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

export const GroupChatScreen: React.FC<NativeStackScreenProps<ConnectionsStackParamList, 'GroupChat'>> = ({
  route,
}) => {
  const { circleId } = route.params;

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Circle chat</Text>
      <Text className="mt-3 text-sm text-slate-600">
        Group conversations for {circleId}. Add prompts, schedule hangouts, and celebrate wins together.
      </Text>

      <View className="mt-6 rounded-3xl bg-white p-4 shadow-subtle">
        <Text className="text-sm text-slate-600">This is a placeholder for threaded messages and audio snippets.</Text>
      </View>

      <ActionButton label="Post a vibe" />
    </ScrollView>
  );
};
