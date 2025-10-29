import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '@/types/navigation';
import { DiscoverHomeScreen } from '@/screens/discover/DiscoverHomeScreen';
import { MatchDetailsScreen } from '@/screens/discover/MatchDetailsScreen';
import { DiscoveryFiltersScreen } from '@/screens/discover/DiscoveryFiltersScreen';

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export const DiscoverNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DiscoverHome"
      component={DiscoverHomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MatchDetails"
      component={MatchDetailsScreen}
      options={{ title: 'Match details' }}
    />
    <Stack.Screen
      name="DiscoveryFilters"
      component={DiscoveryFiltersScreen}
      options={{ title: 'Discovery filters' }}
    />
  </Stack.Navigator>
);
