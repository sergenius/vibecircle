import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';
import { Chip } from '@/components/common/Chip';
import { INTEREST_CATEGORIES } from '@/constants/interestCategories';
import { MOOD_OPTIONS } from '@/constants/prompts';
import { useMatches } from '@/contexts';

export const DiscoveryFiltersScreen: React.FC<NativeStackScreenProps<DiscoverStackParamList, 'DiscoveryFilters'>> = ({
  navigation,
}) => {
  const { preferences, updatePreferences } = useMatches();
  const [distance, setDistance] = useState(preferences.distanceKm.toString());
  const [selectedInterests, setSelectedInterests] = useState(preferences.selectedInterests);
  const [selectedMoods, setSelectedMoods] = useState(preferences.moods);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest],
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood as typeof MOOD_OPTIONS[number])
        ? prev.filter((item) => item !== mood)
        : [...prev, mood as typeof MOOD_OPTIONS[number]],
    );
  };

  const applyFilters = () => {
    updatePreferences({
      distanceKm: Number(distance) || preferences.distanceKm,
      selectedInterests,
      moods: selectedMoods,
    });
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <View className="mt-12">
        <Text className="text-3xl font-semibold text-on-background">Discovery filters</Text>
        <Text className="mt-3 text-sm text-slate-500">
          Fine-tune who we introduce based on interests, vibes, and distance preferences.
        </Text>
      </View>

      <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-sm font-semibold text-on-background">Maximum distance (km)</Text>
        <TextInput
          value={distance}
          keyboardType="numeric"
          onChangeText={setDistance}
          className="mt-3 rounded-2xl border border-slate-200 px-4 py-3 text-base"
        />
      </View>

      <View className="mt-8">
        <Text className="text-sm font-semibold text-on-background">Interests</Text>
        <View className="mt-3 flex-row flex-wrap">
          {INTEREST_CATEGORIES.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              selected={selectedInterests.includes(interest)}
              onPress={() => toggleInterest(interest)}
            />
          ))}
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-sm font-semibold text-on-background">Current mood</Text>
        <View className="mt-3 flex-row flex-wrap">
          {MOOD_OPTIONS.map((mood) => (
            <Chip
              key={mood}
              label={mood}
              selected={selectedMoods.includes(mood)}
              onPress={() => toggleMood(mood)}
            />
          ))}
        </View>
      </View>

      <View className="mt-10">
        <ActionButton label="Apply filters" onPress={applyFilters} />
        <ActionButton
          variant="ghost"
          label="Reset"
          onPress={() => {
            setDistance(preferences.distanceKm.toString());
            setSelectedInterests(preferences.selectedInterests);
            setSelectedMoods(preferences.moods);
          }}
        />
      </View>
    </ScrollView>
  );
};
