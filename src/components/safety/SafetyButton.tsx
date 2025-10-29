import React from 'react';
import { Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SafetyButtonProps {
  label?: string;
  onPress?: () => void;
}

export const SafetyButton: React.FC<SafetyButtonProps> = ({ label = 'Safety Center', onPress }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-center rounded-full border border-slate-200 px-5 py-3"
  >
    <MaterialCommunityIcons name="shield-check-outline" size={20} color="#0F172A" />
    <Text className="ml-2 text-sm font-semibold text-on-background">{label}</Text>
  </Pressable>
);
