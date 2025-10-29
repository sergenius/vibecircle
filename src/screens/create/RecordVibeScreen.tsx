import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CreateVibeStackParamList } from '@/types/navigation';
import { useVibes } from '@/contexts';
import { ActionButton } from '@/components/common/ActionButton';

export const RecordVibeScreen: React.FC<NativeStackScreenProps<CreateVibeStackParamList, 'RecordVibe'>> = ({
  navigation,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const { recording } = useVibes();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  return (
    <View className="flex-1 bg-black">
      {permission?.granted ? (
        <CameraView style={{ flex: 1 }}>
          <View className="absolute top-16 left-0 right-0 items-center">
            <Text className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase text-white">
              {recording.prompt ?? 'Authentic vibe mode'}
            </Text>
          </View>
          <View className="absolute bottom-24 left-0 right-0 flex-row items-center justify-center">
            <Pressable className="h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <View className="h-16 w-16 rounded-full bg-primary" />
            </Pressable>
          </View>
        </CameraView>
      ) : (
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text className="text-base text-slate-600">
            We need camera access to record your vibe. Please enable permissions.
          </Text>
          <ActionButton label="Grant permission" onPress={requestPermission} />
        </View>
      )}

      <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-5 pb-12 pt-6">
        <Text className="text-center text-sm text-white">Keep it real. No filters, just your genuine story.</Text>
        <ActionButton label="Preview vibe" onPress={() => navigation.navigate('ReviewVibe')} />
      </View>
    </View>
  );
};
