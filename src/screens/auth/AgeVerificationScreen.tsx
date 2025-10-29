import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import clsx from 'clsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

const AGE_OPTIONS = ['16-18', '19-21', '22-25', '26-32'];

export const AgeVerificationScreen: React.FC<NativeStackScreenProps<AuthStackParamList, 'AgeVerification'>> = ({
  navigation,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-background px-6">
      <View className="mt-16">
        <Text className="text-2xl font-semibold text-on-background">Choose your age group</Text>
        <Text className="mt-2 text-base text-slate-600">
          We match friends in age-appropriate circles for the safest possible vibe.
        </Text>
      </View>

      <View className="mt-8 space-y-3">
        {AGE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            className={clsx(
              'rounded-3xl border px-4 py-5',
              selected === option ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white',
            )}
            onPress={() => setSelected(option)}
          >
            <Text className="text-lg font-semibold text-on-background">{option}</Text>
            <Text className="mt-1 text-sm text-slate-500">Curated circles, prompts, and moderation for this stage.</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-auto mb-12">
        <ActionButton
          label="Continue"
          onPress={() => navigation.navigate('Register')}
          disabled={!selected}
        />
      </View>
    </View>
  );
};
