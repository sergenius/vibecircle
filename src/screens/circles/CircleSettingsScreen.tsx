import React, { useState } from 'react';
import { ScrollView, Text, Switch, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CirclesStackParamList } from '@/types/navigation';
import { useCircles } from '@/contexts';
import { ActionButton } from '@/components/common/ActionButton';

export const CircleSettingsScreen: React.FC<NativeStackScreenProps<CirclesStackParamList, 'CircleSettings'>> = ({
  route,
  navigation,
}) => {
  const { circleId } = route.params;
  const { joined } = useCircles();
  const circle = joined.find((item) => item.id === circleId);

  const [requestApproval, setRequestApproval] = useState(true);
  const [allowVideoPosts, setAllowVideoPosts] = useState(true);
  const [enableWeeklyPrompts, setEnableWeeklyPrompts] = useState(true);

  if (!circle) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-base text-slate-600">Join the circle to view settings.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-5" contentContainerStyle={{ paddingBottom: 48 }}>
      <Text className="mt-12 text-3xl font-semibold text-on-background">{circle.name} settings</Text>
      <Text className="mt-3 text-sm text-slate-600">Manage moderation features and engagement tools.</Text>

      <View className="mt-8 space-y-4">
        <SettingRow
          title="Requests require approval"
          description="Prevent random drop-ins by approving requests manually."
          value={requestApproval}
          onValueChange={setRequestApproval}
        />
        <SettingRow
          title="Allow video vibe posts"
          description="Members can share 15-second vibes directly inside the circle."
          value={allowVideoPosts}
          onValueChange={setAllowVideoPosts}
        />
        <SettingRow
          title="Weekly AI prompts"
          description="Keep the community active with curated challenges tailored to your circle."
          value={enableWeeklyPrompts}
          onValueChange={setEnableWeeklyPrompts}
        />
      </View>

      <View className="mt-10">
        <ActionButton label="Save changes" onPress={() => navigation.goBack()} />
        <ActionButton label="View members" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

interface SettingRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ title, description, value, onValueChange }) => (
  <View className="flex-row items-start justify-between rounded-3xl bg-white p-4 shadow-subtle">
    <View className="flex-1 pr-4">
      <Text className="text-sm font-semibold text-on-background">{title}</Text>
      <Text className="mt-2 text-sm text-slate-600">{description}</Text>
    </View>
    <Switch value={value} onValueChange={onValueChange} thumbColor={value ? '#14B8A6' : '#CBD5F5'} />
  </View>
);
