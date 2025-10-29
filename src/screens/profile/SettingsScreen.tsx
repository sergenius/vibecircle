import React from 'react';
import { ScrollView, Text, Pressable, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useAuth } from '@/contexts';

const SETTINGS_ITEMS = [
  { label: 'Notifications', route: 'Notifications' as const },
  { label: 'Premium features', route: 'Premium' as const },
  { label: 'Analytics & insights', route: 'Analytics' as const },
];

export const SettingsScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'Settings'>> = ({ navigation }) => {
  const { logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Settings</Text>
      <Text className="mt-3 text-sm text-slate-600">Tune notifications, privacy, and premium options.</Text>

      <View className="mt-6 space-y-4">
        {SETTINGS_ITEMS.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            className="rounded-3xl bg-white p-4 shadow-subtle"
          >
            <Text className="text-base font-semibold text-on-background">{item.label}</Text>
            <Text className="mt-1 text-sm text-slate-600">Tap to manage {item.label.toLowerCase()} preferences.</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={logout} className="mt-8 rounded-3xl bg-white p-4 shadow-subtle">
        <Text className="text-base font-semibold text-rose-500">Log out</Text>
      </Pressable>
    </ScrollView>
  );
};
