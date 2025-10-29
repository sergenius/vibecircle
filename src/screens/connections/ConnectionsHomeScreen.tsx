import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { useChat, useUser } from '@/contexts';
import { FriendshipBadge } from '@/components/friendship/FriendshipBadge';
import { AuthenticityMeter } from '@/components/friendship/AuthenticityMeter';
import { ActionButton } from '@/components/common/ActionButton';

export const ConnectionsHomeScreen: React.FC<NativeStackScreenProps<ConnectionsStackParamList, 'ConnectionsHome'>> = ({
  navigation,
}) => {
  const { conversations, hangouts } = useChat();
  const { profile } = useUser();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 64 }}>
      <View className="mt-12">
        <Text className="text-sm font-medium uppercase tracking-widest text-primary">Connections</Text>
        <Text className="mt-2 text-3xl font-semibold text-on-background">Friendships in full bloom</Text>
        <Text className="mt-3 text-sm text-slate-500">
          Celebrate milestones, check in on vibes, and plan IRL hangouts together.
        </Text>
      </View>

      <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-base font-semibold text-on-background">Friendship milestones</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {profile?.milestones.map((milestone) => (
            <FriendshipBadge key={milestone.id} milestone={milestone} />
          ))}
        </ScrollView>
      </View>

      {profile && <AuthenticityMeter value={profile.authenticityScore} />}

      <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-base font-semibold text-on-background">Active chats</Text>
        {conversations.map((conversation) => (
          <View key={conversation.id} className="mt-3 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-on-background">{conversation.friendshipLevel}</Text>
              <Text className="mt-1 text-sm text-slate-600">{conversation.lastMessage?.content ?? 'Start a convo'}</Text>
            </View>
            <ActionButton
              label="Open"
              variant="ghost"
              onPress={() => navigation.navigate('Chat', { conversationId: conversation.id })}
            />
          </View>
        ))}
      </View>

      <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-base font-semibold text-on-background">Upcoming hangouts</Text>
        {hangouts.length === 0 ? (
          <Text className="mt-2 text-sm text-slate-600">Plan a micro-hangout to deepen the connection.</Text>
        ) : (
          hangouts.map((hangout) => (
            <Text key={hangout.id} className="mt-3 text-sm text-slate-600">
              {hangout.title} · {new Date(hangout.scheduledFor).toLocaleString()}
            </Text>
          ))
        )}
        <ActionButton
          label="Schedule hangout"
          variant="ghost"
          onPress={() => navigation.navigate('ScheduledHangouts')}
        />
      </View>
    </ScrollView>
  );
};
