import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, ViewProps } from 'react-native';

interface ScreenContainerProps extends ViewProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  title,
  subtitle,
  headerRight,
  children,
  scrollable = true,
  style,
  ...rest
}) => {
  const Wrapper = scrollable ? ScrollView : View;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background" style={style} {...rest}>
      <Wrapper className="flex-1 px-5" contentContainerStyle={scrollable ? { paddingBottom: 32 } : undefined}>
        {(title || subtitle) && (
          <View className="mt-8 mb-6 flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              {title && <Text className="text-2xl font-semibold text-on-background">{title}</Text>}
              {subtitle && <Text className="mt-2 text-base text-slate-500">{subtitle}</Text>}
            </View>
            {headerRight}
          </View>
        )}
        {children}
      </Wrapper>
    </SafeAreaView>
  );
};
