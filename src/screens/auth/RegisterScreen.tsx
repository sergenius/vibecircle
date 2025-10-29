import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';

interface RegisterForm {
  name: string;
  contact: string;
  password: string;
}

export const RegisterScreen: React.FC<NativeStackScreenProps<AuthStackParamList, 'Register'>> = ({ navigation }) => {
  const { control, handleSubmit } = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      contact: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit((data) => {
    navigation.navigate('Verification', { contact: data.contact });
  });

  return (
    <View className="flex-1 bg-background px-6">
      <View className="mt-16">
        <Text className="text-2xl font-semibold text-on-background">Create your vibe profile</Text>
        <Text className="mt-2 text-base text-slate-600">
          We’ll walk you through values, interests, and your first vibe video.
        </Text>
      </View>

      <View className="mt-10 space-y-5">
        <View>
          <Text className="text-sm font-medium text-slate-600">Full name</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
                onChangeText={onChange}
                value={value}
                placeholder="Ava Reyes"
              />
            )}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-slate-600">Email or phone</Text>
          <Controller
            control={control}
            name="contact"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                placeholder="you@example.com"
              />
            )}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-slate-600">Password</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: true, minLength: 6 }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base"
                onChangeText={onChange}
                value={value}
                secureTextEntry
                placeholder="••••••••"
              />
            )}
          />
        </View>
      </View>

      <View className="mt-6">
        <ActionButton label="Create Account" onPress={onSubmit} />
        <Text className="mt-4 text-xs text-slate-500">
          By continuing you agree to keep VibeCircle friendship-only and honor community guidelines.
        </Text>
      </View>
    </View>
  );
};
