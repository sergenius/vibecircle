import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { VibeProvider } from '../contexts/VibeContext';
import { CircleProvider } from '../contexts/CircleContext';

function RootLayoutContent() {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();

  if (isLoading) {
    return <Stack.Screen name="loading" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth flow
        <Stack.Screen name="(auth)" />
      ) : !hasCompletedOnboarding ? (
        // Onboarding flow
        <Stack.Screen name="onboarding" />
      ) : (
        // Main app
        <Stack.Screen name="(tabs)" />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <VibeProvider>
        <CircleProvider>
          <RootLayoutContent />
          <StatusBar style="auto" />
        </CircleProvider>
      </VibeProvider>
    </AuthProvider>
  );
}