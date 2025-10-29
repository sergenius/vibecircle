import React, { useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useUser } from '@/contexts';
import { Chip } from '@/components/common/Chip';
import { ActionButton } from '@/components/common/ActionButton';
import { INTEREST_CATEGORIES } from '@/constants/interestCategories';

export const EditProfileScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>> = ({
  navigation,
}) => {
  const { profile, updateProfile } = useUser();
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);

  if (!profile) {
    return null;
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]));
  };

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">Edit profile</Text>
      <Text className="mt-3 text-sm text-slate-600">Fine tune your vibe so the right friends connect.</Text>

      <Text className="mt-6 text-sm font-semibold text-on-background">Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        multiline
        className="mt-2 min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
      />

      <Text className="mt-6 text-sm font-semibold text-on-background">Interests</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
        {INTEREST_CATEGORIES.map((interest) => (
          <Chip key={interest} label={interest} selected={interests.includes(interest)} onPress={() => toggleInterest(interest)} />
        ))}
      </ScrollView>

      <ActionButton
        label="Save"
        onPress={() => {
          updateProfile({ bio, interests });
          navigation.goBack();
        }}
      />
    </ScrollView>
  );
};
