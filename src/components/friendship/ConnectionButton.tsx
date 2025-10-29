import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ConnectionButtonProps {
  label?: string;
  onPress?: () => void;
}

export const ConnectionButton: React.FC<ConnectionButtonProps> = ({ label = 'Send Connection Request', onPress }) => {
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <Animated.View style={animatedStyles} className="overflow-hidden rounded-full">
      <Pressable
        className="flex-row items-center justify-center rounded-full bg-primary px-6 py-3"
        onPress={onPress}
      >
        <Text className="text-sm font-semibold text-white">{label}</Text>
      </Pressable>
    </Animated.View>
  );
};
