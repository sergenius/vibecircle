import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { ProfileHomeScreen } from '@/screens/profile/ProfileHomeScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { AchievementsScreen } from '@/screens/profile/AchievementsScreen';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { NotificationsScreen } from '@/screens/profile/NotificationsScreen';
import { PremiumScreen } from '@/screens/profile/PremiumScreen';
import { AnalyticsScreen } from '@/screens/profile/AnalyticsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit profile' }} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Achievements' }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
    <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: 'VibeCircle+' }} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics dashboard' }} />
  </Stack.Navigator>
);
