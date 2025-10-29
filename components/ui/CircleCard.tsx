import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Users, Calendar } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Circle } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);
const StyledImage = styled(Image);

interface CircleCardProps {
  circle: Circle;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeStyles = {
  small: {
    container: 'w-32 h-40',
    image: 'h-20',
    text: 'text-sm',
  },
  medium: {
    container: 'w-40 h-48',
    image: 'h-24',
    text: 'text-base',
  },
  large: {
    container: 'flex-1 h-52',
    image: 'h-32',
    text: 'text-lg',
  },
};

export default function CircleCard({ 
  circle, 
  onPress, 
  size = 'medium',
  className = '' 
}: CircleCardProps) {
  const styles = sizeStyles[size];

  return (
    <StyledPressable
      onPress={onPress}
      className={`
        ${styles.container} 
        bg-white rounded-2xl shadow-lg shadow-neutral-200 
        active:scale-95 
        ${className}
      `}
    >
      {/* Circle Image */}
      <StyledImage
        source={{ uri: circle.imageUrl }}
        className={`${styles.image} w-full rounded-t-2xl`}
        resizeMode="cover"
      />

      {/* Circle Info */}
      <StyledView className="flex-1 p-3 justify-between">
        <StyledView>
          <StyledText 
            className={`font-bold text-neutral-800 ${styles.text}`}
            numberOfLines={2}
          >
            {circle.name}
          </StyledText>
          
          <StyledText className="text-neutral-500 text-xs mt-1" numberOfLines={1}>
            {circle.category}
          </StyledText>
        </StyledView>

        {/* Member Count */}
        <StyledView className="flex-row items-center justify-between mt-2">
          <StyledView className="flex-row items-center">
            <Users size={14} color="#6b7280" />
            <StyledText className="text-neutral-500 text-xs ml-1">
              {circle.memberCount}
            </StyledText>
          </StyledView>

          {circle.weeklyChallenge && (
            <StyledView className="bg-secondary-100 rounded-full px-2 py-1">
              <Calendar size={12} color="#fb923c" />
            </StyledView>
          )}
        </StyledView>
      </StyledView>
    </StyledPressable>
  );
}