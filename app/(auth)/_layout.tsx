import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="age-verification" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}