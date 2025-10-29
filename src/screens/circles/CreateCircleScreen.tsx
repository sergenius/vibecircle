import React, { useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CirclesStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';
import { Chip } from '@/components/common/Chip';
import { INTEREST_CATEGORIES } from '@/constants/interestCategories';

export const CreateCircleScreen: React.FC<NativeStackScreenProps<CirclesStackParamList, 'CreateCircle'>> = ({
  navigation,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Create a circle</Text>
      <Text className="mt-3 text-sm text-slate-600">
        Set the tone, themes, and safety rules. We will help moderate with AI tools.
      </Text>

      <Text className="mt-8 text-sm font-semibold text-on-background">Circle name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Mindful Makers"
        className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
      />

      <Text className="mt-6 text-sm font-semibold text-on-background">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the vibe, goals, and type of conversations you want."
        multiline
        className="mt-2 h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
      />

      <Text className="mt-6 text-sm font-semibold text-on-background">Tags</Text>
      <Text className="mt-1 text-xs text-slate-500">Select up to five tags that help the right friends find you.</Text>
      <Text className="mt-3 text-xs uppercase tracking-wide text-slate-500">Popular</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
        {INTEREST_CATEGORIES.map((tag) => (
          <Chip key={tag} label={tag} selected={selectedTags.includes(tag)} onPress={() => toggleTag(tag)} />
        ))}
      </ScrollView>

      <ActionButton
        label="Launch circle"
        onPress={() => navigation.goBack()}
        disabled={!name || !description}
      />
    </ScrollView>
  );
};
