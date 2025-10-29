import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { useChat } from '@/contexts';
import { ActionButton } from '@/components/common/ActionButton';

export const ChatListScreen: React.FC<NativeStackScreenProps<ConnectionsStackParamList, 'ChatList'>> = ({
  navigation,
}) => {
  const { conversations } = useChat();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Messages</Text>
      <Text className="mt-3 text-sm text-slate-600">Pick up where you left off with your circles and friends.</Text>

      <View className="mt-6 space-y-4">
        {conversations.map((conversation) => (
          <View key={conversation.id} className="rounded-3xl bg-white p-4 shadow-subtle">
            <Text className="text-sm font-semibold text-on-background">{conversation.friendshipLevel}</Text>
            <Text className="mt-1 text-sm text-slate-600">{conversation.lastMessage?.content ?? 'No messages yet'}</Text>
            <ActionButton
              label="Open chat"
              variant="ghost"
              onPress={() => navigation.navigate('Chat', { conversationId: conversation.id })}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
