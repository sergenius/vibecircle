import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { ActionButton } from '@/components/common/ActionButton';
import { useAuth, useUser } from '@/contexts';
import { mockUsers } from '@/data/mockData';

interface LoginForm {
  contact: string;
  password: string;
}

export const LoginScreen: React.FC<NativeStackScreenProps<AuthStackParamList, 'Login'>> = ({ navigation }) => {
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      contact: '',
      password: '',
    },
  });

  const { login } = useAuth();
  const { setProfile } = useUser();

  const onSubmit = handleSubmit(() => {
    const profile = mockUsers[0];
    setProfile(profile);
    login(profile);
  });

  return (
    <View className="flex-1 bg-background px-6">
      <View className="mt-16">
        <Text className="text-2xl font-semibold text-on-background">Welcome back</Text>
        <Text className="mt-2 text-base text-slate-600">Jump back into your circles and ongoing vibes.</Text>
      </View>

      <View className="mt-10 space-y-5">
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
            rules={{ required: true }}
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
        <ActionButton label="Log In" onPress={onSubmit} />
        <ActionButton
          variant="ghost"
          label="Forgot password?"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      </View>
    </View>
  );
};
