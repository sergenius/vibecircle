import React from 'react';
import { View } from 'react-native';

interface LoadingStateProps {
  lines?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ lines = 3 }) => (
  <View className="mt-6 space-y-4">
    {Array.from({ length: lines }).map((_, index) => (
      <View key={index} className="h-5 rounded-full bg-slate-200" />
    ))}
  </View>
);
