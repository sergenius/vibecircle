import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import clsx from 'clsx';
import { MainTabParamList } from '@/types/navigation';

type IconName =
  | 'compass-outline'
  | 'account-group-outline'
  | 'record-circle-outline'
  | 'chat-processing-outline'
  | 'account-circle-outline'
  | 'circle-outline';

const ICON_MAP: Record<keyof MainTabParamList, IconName> = {
  DiscoverStack: 'compass-outline',
  CirclesStack: 'account-group-outline',
  CreateVibeStack: 'record-circle-outline',
  ConnectionsStack: 'chat-processing-outline',
  ProfileStack: 'account-circle-outline',
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View className="mx-4 mb-6 flex-row items-center justify-between rounded-3xl bg-white p-3 shadow-card">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const animatedStyles = useAnimatedStyle(
          () => ({
            transform: [{ scale: withSpring(isFocused ? 1 : 0.92) }],
          }),
          [isFocused],
        );

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center"
          >
            <Animated.View className="items-center" style={animatedStyles}>
              <View
                className={clsx('mb-2 rounded-full p-2', isFocused ? 'bg-primary/10' : 'bg-transparent')}
              >
                <MaterialCommunityIcons
                  name={ICON_MAP[route.name as keyof MainTabParamList] ?? 'circle-outline'}
                  size={24}
                  color={isFocused ? '#14B8A6' : '#94A3B8'}
                />
              </View>
              <Text className={clsx('text-xs font-medium', isFocused ? 'text-primary' : 'text-slate-400')}>
                {String(label)}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
};
