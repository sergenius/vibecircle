import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import {
  AuthProvider,
  UserProvider,
  VibeProvider,
  MatchProvider,
  CircleProvider,
  ChatProvider,
  NotificationProvider,
} from '@/contexts';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <UserProvider>
            <VibeProvider>
              <MatchProvider>
                <CircleProvider>
                  <ChatProvider>
                    <NotificationProvider>
                      <StatusBar style="dark" />
                      <RootNavigator />
                    </NotificationProvider>
                  </ChatProvider>
                </CircleProvider>
              </MatchProvider>
            </VibeProvider>
          </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
