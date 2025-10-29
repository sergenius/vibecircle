import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';

export const SplashScreen: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-background">
    <Image
      source={{ uri: 'https://example.com/logo/vibecircle.png' }}
      resizeMode="contain"
      className="h-24 w-24"
    />
    <Text className="mt-6 text-2xl font-semibold text-on-background">VibeCircle</Text>
    <Text className="mt-2 text-sm text-slate-500">Finding people who feel like home...</Text>
    <ActivityIndicator className="mt-8" color="#14B8A6" />
  </View>
);
