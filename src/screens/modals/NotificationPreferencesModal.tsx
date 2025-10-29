import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useNotifications } from '@/contexts';

export const NotificationPreferencesModal: React.FC = () => {
  const { preferences, updatePreferences } = useNotifications();

  return (
    <View className="flex-1 items-center justify-center bg-black/60 px-6">
      <View className="w-full rounded-3xl bg-white p-6">
        <Text className="text-lg font-semibold text-on-background">Notification preferences</Text>
        <Text className="mt-2 text-sm text-slate-600">Customize which moments deserve a nudge.</Text>

        <View className="mt-4 space-y-3">
          {Object.entries(preferences).map(([key, value]) => (
            <View key={key} className="flex-row items-center justify-between rounded-2xl border border-slate-200 p-3">
              <Text className="text-sm text-on-background">{key}</Text>
              <Switch
                value={value}
                onValueChange={(next) => updatePreferences({ [key]: next } as Partial<typeof preferences>)}
                thumbColor={value ? '#14B8A6' : '#CBD5F5'}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
