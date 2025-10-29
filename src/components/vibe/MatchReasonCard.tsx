import React from 'react';
import { View, Text } from 'react-native';
import { Match } from '@/types';

interface MatchReasonCardProps {
  match: Match;
}

export const MatchReasonCard: React.FC<MatchReasonCardProps> = ({ match }) => (
  <View className="rounded-3xl bg-primary/5 p-4">
    <Text className="text-sm font-semibold uppercase tracking-wide text-primary">AI Match Insight</Text>
    <Text className="mt-2 text-base text-slate-700">{match.insight.message}</Text>
    <View className="mt-4 flex-row flex-wrap gap-y-2">
      <InsightPill label="Sentiment" value={match.insight.sentimentMatch} />
      <InsightPill label="Values" value={match.insight.valuesAlignment} />
      <InsightPill label="Interests" value={match.insight.interestOverlap} />
      <InsightPill label="Authenticity" value={match.insight.authenticityMatch} />
    </View>
  </View>
);

const InsightPill: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <View className="mr-3 rounded-full bg-white px-3 py-1 shadow-subtle">
    <Text className="text-xs font-medium text-slate-500">{label}</Text>
    <Text className="text-sm font-semibold text-primary">{Math.round(value * 100)}%</Text>
  </View>
);
