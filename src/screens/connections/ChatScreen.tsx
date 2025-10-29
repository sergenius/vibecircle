import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { useChat } from '@/contexts';
import { ActionButton } from '@/components/common/ActionButton';

export const ChatScreen: React.FC<NativeStackScreenProps<ConnectionsStackParamList, 'Chat'>> = ({
  route,
}) => {
  const { conversationId } = route.params;
  const { conversations } = useChat();

  const conversation = conversations.find((item) => item.id === conversationId);

  if (!conversation) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-slate-600">Conversation not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={conversation.lastMessage ? [conversation.lastMessage] : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mx-5 mt-6 rounded-3xl bg-white p-4 shadow-subtle">
            <Text className="text-sm text-slate-600">{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-10 pt-5 shadow-card">
        <ActionButton label="Send a quick vibe" />
      </View>
    </View>
  );
};
