import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/contexts';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { AuthStackNavigator } from './AuthStack';
import { OnboardingStackNavigator } from './OnboardingStack';
import { AppDrawerNavigator } from './AppDrawer';
import { navigationTheme } from '@/theme';
import { MatchModal } from '@/screens/modals/MatchModal';
import { ReportModal } from '@/screens/modals/ReportModal';
import { PremiumModal } from '@/screens/modals/PremiumModal';
import { NotificationPreferencesModal } from '@/screens/modals/NotificationPreferencesModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { status } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {status === 'loading' && <Stack.Screen name="Splash" component={SplashScreen} />}
        {status === 'unauthenticated' && <Stack.Screen name="AuthStack" component={AuthStackNavigator} />}
        {status === 'onboarding' && <Stack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />}
        {status === 'authenticated' && <Stack.Screen name="AppDrawer" component={AppDrawerNavigator} />}

        <Stack.Group screenOptions={{ presentation: 'transparentModal', headerShown: false }}>
          <Stack.Screen name="MatchModal" component={MatchModal} />
          <Stack.Screen name="ReportModal" component={ReportModal} />
          <Stack.Screen name="PremiumModal" component={PremiumModal} />
          <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
