import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/navigation/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="circles" />
      <Tabs.Screen name="create" />
      <Tabs.Screen name="connections" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}