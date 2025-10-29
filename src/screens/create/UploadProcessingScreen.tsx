import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateVibeStackParamList } from '@/types/navigation';

export const UploadProcessingScreen: React.FC<NativeStackScreenProps<CreateVibeStackParamList, 'UploadProcessing'>> = ({
  navigation,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.popToTop();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <ActivityIndicator size="large" color="#14B8A6" />
      <Text className="mt-6 text-xl font-semibold text-on-background">Processing your vibe</Text>
      <Text className="mt-2 text-sm text-slate-600">
        We are generating authenticity markers and finding friends who will love this.
      </Text>
    </View>
  );
};
