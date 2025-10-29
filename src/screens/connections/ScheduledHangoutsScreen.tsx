import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConnectionsStackParamList } from '@/types/navigation';
import { useChat } from '@/contexts';
import { ActionButton } from '@/components/common/ActionButton';

export const ScheduledHangoutsScreen: React.FC<NativeStackScreenProps<ConnectionsStackParamList, 'ScheduledHangouts'>> = ({
  navigation,
}) => {
  const { hangouts } = useChat();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Planned hangouts</Text>
      <Text className="mt-3 text-sm text-slate-600">Keep momentum by celebrating shared experiences.</Text>

      <View className="mt-6 space-y-4">
        {hangouts.map((hangout) => (
          <View key={hangout.id} className="rounded-3xl bg-white p-4 shadow-subtle">
            <Text className="text-base font-semibold text-on-background">{hangout.title}</Text>
            <Text className="mt-1 text-sm text-slate-600">{new Date(hangout.scheduledFor).toLocaleString()}</Text>
            <Text className="mt-1 text-xs text-slate-500">{hangout.isVirtual ? 'Virtual' : 'In person'} · {hangout.location}</Text>
            {hangout.notes && <Text className="mt-2 text-sm text-slate-500">{hangout.notes}</Text>}
          </View>
        ))}
      </View>

      <ActionButton label="Plan new hangout" onPress={() => navigation.navigate('FriendshipInsights', { userId: 'user-1' })} />
    </ScrollView>
  );
};
