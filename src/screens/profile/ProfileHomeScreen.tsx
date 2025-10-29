import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useUser } from '@/contexts';
import { VibePlayer } from '@/components/vibe/VibePlayer';
import { AuthenticityMeter } from '@/components/friendship/AuthenticityMeter';
import { ActionButton } from '@/components/common/ActionButton';

export const ProfileHomeScreen: React.FC<NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>> = ({
  navigation,
}) => {
  const { profile } = useUser();

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-slate-600">Profile not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 64 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">@{profile.username}</Text>
      <Text className="mt-3 text-base text-slate-600">{profile.bio}</Text>

      <View className="mt-6 rounded-3xl bg-white p-4 shadow-card">
        <Text className="text-sm font-semibold uppercase tracking-widest text-primary">Profile vibe</Text>
        <VibePlayer source="https://example.com/vibes/profile.mp4" />
      </View>

      <AuthenticityMeter value={profile.authenticityScore} />

      <View className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <Text className="text-base font-semibold text-on-background">Stats</Text>
        <View className="mt-4 space-y-2">
          <Text className="text-sm text-slate-600">Connections formed: {profile.stats.friendshipsFormed}</Text>
          <Text className="text-sm text-slate-600">Circles joined: {profile.stats.circlesJoined}/5</Text>
          <Text className="text-sm text-slate-600">Authenticity streak: {profile.stats.authenticityStreak} days</Text>
          <Text className="text-sm text-slate-600">Vibes shared: {profile.stats.vibesShared}</Text>
        </View>
      </View>

      <View className="mt-8">
        <ActionButton label="Edit profile" onPress={() => navigation.navigate('EditProfile')} />
        <ActionButton
          variant="ghost"
          label="View achievements"
          onPress={() => navigation.navigate('Achievements')}
        />
      </View>
    </ScrollView>
  );
};
