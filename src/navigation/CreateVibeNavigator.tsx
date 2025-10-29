import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateVibeStackParamList } from '@/types/navigation';
import { CreatePromptScreen } from '@/screens/create/CreatePromptScreen';
import { RecordVibeScreen } from '@/screens/create/RecordVibeScreen';
import { ReviewVibeScreen } from '@/screens/create/ReviewVibeScreen';
import { UploadProcessingScreen } from '@/screens/create/UploadProcessingScreen';

const Stack = createNativeStackNavigator<CreateVibeStackParamList>();

export const CreateVibeNavigator: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="CreatePrompt" component={CreatePromptScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RecordVibe" component={RecordVibeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ReviewVibe" component={ReviewVibeScreen} options={{ title: 'Review vibe' }} />
    <Stack.Screen name="UploadProcessing" component={UploadProcessingScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);
