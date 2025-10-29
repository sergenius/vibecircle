import React from 'react';
import { View, Text, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

export const WelcomeScreen: React.FC<NativeStackScreenProps<AuthStackParamList, 'Welcome'>> = ({ navigation }) => (
  <View className="flex-1 bg-background px-6">
    <View className="mt-16 items-center">
      <Image
        source={{ uri: 'https://example.com/illustrations/friendship.png' }}
        resizeMode="contain"
        className="h-64 w-full"
      />
      <Text className="mt-8 text-center text-3xl font-semibold text-on-background">Find Your People</Text>
      <Text className="mt-4 text-center text-base text-slate-600">
        VibeCircle pairs authentic 15-second video vibes with AI that cares about values, not swipes.
      </Text>
    </View>
    <View className="mt-auto mb-12">
      <ActionButton label="Start Vibing" onPress={() => navigation.navigate('AgeVerification')} />
      <ActionButton
        variant="ghost"
        label="I already have an account"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  </View>
);
