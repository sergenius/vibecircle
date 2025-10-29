import React from 'react';
import { ScrollView, Text, View, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useNotifications } from '@/contexts';

export const NotificationsScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'Notifications'>> = () => {
  const { preferences, updatePreferences, notifications } = useNotifications();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Notifications</Text>
      <Text className="mt-3 text-sm text-slate-600">Choose the moments that deserve a ping.</Text>

      <View className="mt-6 space-y-4">
        {Object.entries(preferences).map(([key, value]) => (
          <View key={key} className="flex-row items-center justify-between rounded-3xl bg-white p-4 shadow-subtle">
            <View className="flex-1 pr-4">
              <Text className="text-sm font-semibold text-on-background">{key}</Text>
              <Text className="mt-1 text-xs text-slate-500">Toggle alerts for {key} moments.</Text>
            </View>
            <Switch
              value={value}
              onValueChange={(next) => updatePreferences({ [key]: next } as Partial<typeof preferences>)}
              thumbColor={value ? '#14B8A6' : '#CBD5F5'}
            />
          </View>
        ))}
      </View>

      <View className="mt-10 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-base font-semibold text-on-background">Recent notifications</Text>
        {notifications.map((notification) => (
          <View key={notification.id} className="mt-3 rounded-2xl border border-slate-200 p-3">
            <Text className="text-sm font-semibold text-on-background">{notification.title}</Text>
            <Text className="mt-1 text-sm text-slate-600">{notification.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
