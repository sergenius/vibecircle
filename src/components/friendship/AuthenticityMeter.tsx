import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

interface AuthenticityMeterProps {
  value: number; // 0 - 1
}

export const AuthenticityMeter: React.FC<AuthenticityMeterProps> = ({ value }) => {
  const percentage = Math.round(value * 100);
  const sanitized = Math.min(Math.max(percentage, 0), 100);
  const widthLabel = `${sanitized}%` as `${number}%`;
  const barStyle: StyleProp<ViewStyle> = { width: widthLabel };
  return (
    <View className="mt-4 rounded-3xl bg-white p-4 shadow-subtle">
      <Text className="text-sm font-semibold text-on-background">Authenticity Score</Text>
      <View className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <View
          className="h-full rounded-full bg-success"
          style={barStyle}
        />
      </View>
      <Text className="mt-2 text-xs text-slate-500">{percentage}% of your vibes are rated genuinely expressive.</Text>
    </View>
  );
};
