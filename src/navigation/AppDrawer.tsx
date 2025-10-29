import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppDrawerParamList } from '@/types/navigation';
import { MainTabs } from './MainTabs';
import { SafetyCenterScreen } from '@/screens/profile/SafetyCenterScreen';
import { SupportCenterScreen } from '@/screens/profile/SupportCenterScreen';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export const AppDrawerNavigator: React.FC = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="MainTabs" component={MainTabs} options={{ drawerLabel: 'Home' }} />
    <Drawer.Screen name="SafetyCenter" component={SafetyCenterScreen} options={{ drawerLabel: 'Safety center' }} />
    <Drawer.Screen name="SupportCenter" component={SupportCenterScreen} options={{ drawerLabel: 'Support' }} />
  </Drawer.Navigator>
);
