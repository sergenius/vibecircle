import React from 'react';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { 
  Compass, 
  Users, 
  Plus, 
  MessageCircle, 
  User 
} from 'lucide-react-native';
import { styled } from 'nativewind';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate 
} from 'react-native-reanimated';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

const { width } = Dimensions.get('window');

const tabIcons = {
  'discover': Compass,
  'circles': Users,
  'create': Plus,
  'connections': MessageCircle,
  'profile': User,
};

const tabLabels = {
  'discover': 'Discover',
  'circles': 'Circles',
  'create': 'Create',
  'connections': 'Connections',
  'profile': 'Profile',
};

export default function CustomTabBar({ 
  state, 
  descriptors, 
  navigation 
}: BottomTabBarProps) {
  const indicatorPosition = useSharedValue(0);

  React.useEffect(() => {
    indicatorPosition.value = withSpring(state.index);
  }, [state.index]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      indicatorPosition.value,
      [0, 1, 2, 3, 4],
      [
        width * 0.1,
        width * 0.3,
        width * 0.5,
        width * 0.7,
        width * 0.9,
      ]
    );

    return {
      transform: [{ translateX: translateX - 20 }],
    };
  });

  return (
    <StyledView className="bg-white border-t border-neutral-200 px-4 py-2">
      {/* Animated Indicator */}
      <Animated.View
        className="absolute top-0 w-10 h-1 bg-primary-500 rounded-full"
        style={animatedIndicatorStyle}
      />

      <StyledView className="flex-row justify-around items-center h-16">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const routeName = route.name.toLowerCase();

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = tabIcons[routeName as keyof typeof tabIcons];
          const isCreateTab = routeName === 'create';

          return (
            <StyledPressable
              key={route.key}
              onPress={onPress}
              className={`
                items-center justify-center flex-1 py-2
                ${isCreateTab ? 'bg-primary-500 rounded-2xl mx-2 shadow-lg' : ''}
                active:scale-95
              `}
            >
              <Icon
                size={isCreateTab ? 28 : 24}
                color={
                  isCreateTab 
                    ? 'white'
                    : isFocused 
                      ? '#14b8a6' 
                      : '#9ca3af'
                }
              />
              
              {!isCreateTab && (
                <StyledText
                  className={`
                    text-xs mt-1 font-medium
                    ${isFocused ? 'text-primary-500' : 'text-neutral-400'}
                  `}
                >
                  {tabLabels[routeName as keyof typeof tabLabels]}
                </StyledText>
              )}
            </StyledPressable>
          );
        })}
      </StyledView>
    </StyledView>
  );
}