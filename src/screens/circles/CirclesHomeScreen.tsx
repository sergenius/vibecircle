import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CirclesStackParamList } from '@/types/navigation';
import { useCircles } from '@/contexts';
import { CircleCard } from '@/components/circle/CircleCard';
import { ActionButton } from '@/components/common/ActionButton';

export const CirclesHomeScreen: React.FC<NativeStackScreenProps<CirclesStackParamList, 'CirclesHome'>> = ({
  navigation,
}) => {
  const { joined, recommended } = useCircles();

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 64 }}>
      <View className="mt-12">
        <Text className="text-sm font-medium uppercase tracking-widest text-primary">Your circles</Text>
        <Text className="mt-2 text-3xl font-semibold text-on-background">Spaces where you feel seen</Text>
        <Text className="mt-3 text-sm text-slate-500">
          Weekly challenges and hangouts help move connections from sparked to solid.
        </Text>
      </View>

      <View className="mt-8">
        <Text className="text-base font-semibold text-on-background">Joined ({joined.length}/5)</Text>
        <View className="mt-4">
          {joined.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              actionLabel="View"
              onPress={() => navigation.navigate('CircleDetail', { circleId: circle.id })}
            />
          ))}
          {joined.length === 0 && (
            <Text className="mt-3 text-sm text-slate-600">
              Join up to five circles that reflect your vibe. We’ll tailor challenges to them.
            </Text>
          )}
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-base font-semibold text-on-background">Recommended for you</Text>
        <View className="mt-4">
          {recommended.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              actionLabel="Join"
              onPress={() => navigation.navigate('CircleDetail', { circleId: circle.id })}
            />
          ))}
        </View>
      </View>

      <View className="mt-8">
        <ActionButton label="Create a circle" onPress={() => navigation.navigate('CreateCircle')} />
      </View>
    </ScrollView>
  );
};
