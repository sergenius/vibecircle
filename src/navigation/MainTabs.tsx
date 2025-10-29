import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/types/navigation';
import { DiscoverNavigator } from './DiscoverNavigator';
import { CirclesNavigator } from './CirclesNavigator';
import { CreateVibeNavigator } from './CreateVibeNavigator';
import { ConnectionsNavigator } from './ConnectionsNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { CustomTabBar } from '@/components/common/CustomTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => (
  <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="DiscoverStack" component={DiscoverNavigator} options={{ title: 'Discover' }} />
    <Tab.Screen name="CirclesStack" component={CirclesNavigator} options={{ title: 'Circles' }} />
    <Tab.Screen name="CreateVibeStack" component={CreateVibeNavigator} options={{ title: 'Create' }} />
    <Tab.Screen name="ConnectionsStack" component={ConnectionsNavigator} options={{ title: 'Connections' }} />
    <Tab.Screen name="ProfileStack" component={ProfileNavigator} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);
