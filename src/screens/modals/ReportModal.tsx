import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ActionButton } from '@/components/common/ActionButton';

const REPORT_REASONS = ['Inauthentic content', 'Harassment', 'Impersonation', 'Safety concern'];

export const ReportModal: React.FC = () => (
  <View className="flex-1 items-center justify-center bg-black/60 px-6">
    <View className="w-full rounded-3xl bg-white p-6">
      <Text className="text-lg font-semibold text-on-background">Report content</Text>
      <Text className="mt-2 text-sm text-slate-600">
        Our safety team reviews every report within 12 hours. Select a reason below.
      </Text>

      <View className="mt-4 space-y-3">
        {REPORT_REASONS.map((reason) => (
          <Pressable key={reason} className="rounded-2xl border border-slate-200 px-4 py-3">
            <Text className="text-sm text-on-background">{reason}</Text>
          </Pressable>
        ))}
      </View>

      <ActionButton label="Submit" />
    </View>
  </View>
);
