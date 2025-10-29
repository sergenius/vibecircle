import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CirclesStackParamList } from '@/types/navigation';
import { CirclesHomeScreen } from '@/screens/circles/CirclesHomeScreen';
import { CircleDetailScreen } from '@/screens/circles/CircleDetailScreen';
import { CreateCircleScreen } from '@/screens/circles/CreateCircleScreen';
import { CircleSettingsScreen } from '@/screens/circles/CircleSettingsScreen';

const Stack = createNativeStackNavigator<CirclesStackParamList>();

export const CirclesNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="CirclesHome" component={CirclesHomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CircleDetail" component={CircleDetailScreen} options={{ title: 'Circle detail' }} />
    <Stack.Screen name="CreateCircle" component={CreateCircleScreen} options={{ title: 'Create circle' }} />
    <Stack.Screen name="CircleSettings" component={CircleSettingsScreen} options={{ title: 'Circle settings' }} />
  </Stack.Navigator>
);
