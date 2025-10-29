import React from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { styled } from 'nativewind';
import Button from '../../components/ui/Button';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#14b8a6', '#0d9488', '#0f766e']}
      className="flex-1"
    >
      <StatusBar barStyle="light-content" />
      
      <StyledView className="flex-1 justify-center items-center px-8">
        {/* Logo */}
        <StyledView className="bg-white/20 rounded-full p-8 mb-8">
          <StyledText className="text-6xl">🌟</StyledText>
        </StyledView>

        {/* App Name */}
        <StyledText className="text-white text-4xl font-bold mb-2">
          VibeCircle
        </StyledText>
        
        <StyledText className="text-white/80 text-lg mb-12 text-center">
          Find Your People
        </StyledText>

        {/* Value Proposition */}
        <StyledView className="mb-16">
          <StyledText className="text-white text-center text-lg leading-7 mb-8">
            Connect through authentic 15-second video introductions.{'\n'}
            Build genuine friendships, not followers.
          </StyledText>
          
          <StyledView className="space-y-4">
            {[
              '🎬 Share your authentic self',
              '🤝 AI-powered friendship matching',  
              '🌐 Join interest-based circles',
              '🛡️ Safety-first community',
            ].map((feature, index) => (
              <StyledText key={index} className="text-white/90 text-base">
                {feature}
              </StyledText>
            ))}
          </StyledView>
        </StyledView>

        {/* CTA Buttons */}
        <StyledView className="w-full space-y-4">
          <Button
            title="Start Vibing"
            onPress={() => router.push('/(auth)/age-verification')}
            className="w-full bg-white"
            textStyle={{ color: '#0f766e' }}
            size="lg"
          />
          
          <Button
            title="I already have an account"
            onPress={() => router.push('/(auth)/login')}
            variant="ghost"
            className="w-full"
            textStyle={{ color: 'white' }}
          />
        </StyledView>

        {/* Footer */}
        <StyledText className="text-white/60 text-sm mt-8 text-center">
          By continuing, you agree to our friendship-first community values
        </StyledText>
      </StyledView>
    </LinearGradient>
  );
}