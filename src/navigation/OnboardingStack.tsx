import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/types/navigation';
import { ProfileSetupScreen } from '@/screens/onboarding/ProfileSetupScreen';
import { OnboardingTutorialScreen } from '@/screens/onboarding/OnboardingTutorialScreen';
import { PrivacyAgreementScreen } from '@/screens/onboarding/PrivacyAgreementScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingStackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="OnboardingTutorial" component={OnboardingTutorialScreen} />
    <Stack.Screen name="PrivacyAgreement" component={PrivacyAgreementScreen} />
  </Stack.Navigator>
);
