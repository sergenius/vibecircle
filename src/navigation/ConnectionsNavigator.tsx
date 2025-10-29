import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { ConnectionsHomeScreen } from '@/screens/connections/ConnectionsHomeScreen';
import { ChatListScreen } from '@/screens/connections/ChatListScreen';
import { ChatScreen } from '@/screens/connections/ChatScreen';
import { GroupChatScreen } from '@/screens/connections/GroupChatScreen';
import { ScheduledHangoutsScreen } from '@/screens/connections/ScheduledHangoutsScreen';
import { FriendshipInsightsScreen } from '@/screens/connections/FriendshipInsightsScreen';

const Stack = createNativeStackNavigator<ConnectionsStackParamList>();

export const ConnectionsNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="ConnectionsHome" component={ConnectionsHomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Conversation' }} />
    <Stack.Screen name="GroupChat" component={GroupChatScreen} options={{ title: 'Circle chat' }} />
    <Stack.Screen name="ScheduledHangouts" component={ScheduledHangoutsScreen} options={{ title: 'Hangouts' }} />
    <Stack.Screen name="FriendshipInsights" component={FriendshipInsightsScreen} options={{ title: 'Insights' }} />
  </Stack.Navigator>
);
