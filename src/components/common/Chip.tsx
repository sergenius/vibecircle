import React from 'react';
import { Pressable, Text } from 'react-native';
import clsx from 'clsx';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  iconLeft?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress, iconLeft }) => (
  <Pressable
    onPress={onPress}
    className={clsx(
      'mr-2 mb-2 flex-row items-center rounded-full border px-4 py-2',
      selected ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white',
    )}
  >
    {iconLeft}
    <Text className={clsx('text-sm font-medium', selected ? 'text-primary' : 'text-slate-600')}>{label}</Text>
  </Pressable>
);
