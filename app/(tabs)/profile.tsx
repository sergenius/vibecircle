import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { styled } from 'nativewind';
import { User, CreditCard as Edit3, Settings, Trophy, Users, Video, Heart, Shield, Star } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledPressable = styled(Pressable);

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'vibes' | 'achievements' | 'stats'>('vibes');

  if (!user) return null;

  const achievements = [
    { id: '1', title: 'Authenticity Streak', description: '7 days of genuine vibes', icon: '🔥' },
    { id: '2', title: 'Circle Builder', description: 'Created your first circle', icon: '🌐' },
    { id: '3', title: 'Friend Magnet', description: '10+ successful connections', icon: '🤝' },
  ];

  const stats = [
    { label: 'Profile Views', value: '247', icon: '👁️' },
    { label: 'Connections Made', value: '12', icon: '🤝' },
    { label: 'Circles Joined', value: '3', icon: '🌐' },
    { label: 'Vibes Shared', value: '28', icon: '🎬' },
  ];

  const AuthenticityMeter = ({ score }: { score: number }) => (
    <StyledView className="items-center">
      <StyledView className="relative w-24 h-24 mb-2">
        <StyledView className="absolute inset-0 bg-neutral-200 rounded-full" />
        <StyledView 
          className="absolute inset-0 bg-primary-500 rounded-full"
          style={{ 
            transform: [{ rotate: `${(score / 100) * 360}deg` }],
            clipPath: `polygon(50% 50%, 50% 0%, ${score > 50 ? '100%' : '50%'} 0%, ${score > 50 ? '100%' : '50%'} ${score > 50 ? '50%' : `${score}%`}%, 50% 50%)`,
          }}
        />
        <StyledView className="absolute inset-2 bg-white rounded-full items-center justify-center">
          <StyledText className="text-lg font-bold text-primary-600">
            {score}
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledText className="text-primary-600 font-semibold">
        Authenticity Score
      </StyledText>
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-neutral-50">
      {/* Header */}
      <StyledView className="bg-white pt-16 pb-6">
        <StyledView className="flex-row justify-between items-center px-6 mb-6">
          <StyledView className="flex-row items-center">
            <User size={24} color="#14b8a6" />
            <StyledText className="text-xl font-bold text-neutral-800 ml-2">
              Profile
            </StyledText>
          </StyledView>
          
          <StyledView className="flex-row space-x-2">
            <Button
              title=""
              onPress={() => {}}
              variant="outline"
              size="sm"
              icon={<Edit3 size={18} color="#14b8a6" />}
            />
            <Button
              title=""
              onPress={() => {}}
              variant="outline"
              size="sm"
              icon={<Settings size={18} color="#14b8a6" />}
            />
          </StyledView>
        </StyledView>

        {/* Profile Header */}
        <StyledView className="items-center px-6">
          <StyledView className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <StyledText className="text-3xl">
              {user.firstName[0]}
            </StyledText>
          </StyledView>
          
          <StyledText className="text-2xl font-bold text-neutral-800 mb-1">
            {user.firstName} {user.lastName}
          </StyledText>
          
          <StyledText className="text-neutral-500 mb-1">
            @{user.username}
          </StyledText>
          
          <StyledView className="flex-row items-center space-x-4 mb-4">
            <StyledView className="bg-primary-100 rounded-full px-3 py-1">
              <StyledText className="text-primary-700 font-semibold text-sm">
                {user.ageGroup}
              </StyledText>
            </StyledView>
            
            <StyledView className="flex-row items-center">
              <Star size={16} color="#fb923c" />
              <StyledText className="text-secondary-600 font-semibold text-sm ml-1">
                {user.authenticity}/100
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Quick Stats */}
        <StyledView className="flex-row justify-around px-6 py-4 bg-neutral-50 mx-6 rounded-2xl">
          <StyledView className="items-center">
            <StyledText className="text-lg font-bold text-neutral-800">12</StyledText>
            <StyledText className="text-neutral-500 text-xs">Friends</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-lg font-bold text-neutral-800">3</StyledText>
            <StyledText className="text-neutral-500 text-xs">Circles</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-lg font-bold text-neutral-800">28</StyledText>
            <StyledText className="text-neutral-500 text-xs">Vibes</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1">
        {/* Interests & Values */}
        <StyledView className="px-6 py-4">
          <Card className="mb-4">
            <StyledText className="font-bold text-neutral-800 mb-3">
              Interests
            </StyledText>
            <StyledView className="flex-row flex-wrap">
              {user.interests.map((interest, index) => (
                <StyledView 
                  key={index} 
                  className="bg-primary-100 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <StyledText className="text-primary-700 text-sm">
                    {interest}
                  </StyledText>
                </StyledView>
              ))}
            </StyledView>
          </Card>

          <Card>
            <StyledText className="font-bold text-neutral-800 mb-3">
              Core Values
            </StyledText>
            <StyledView className="flex-row flex-wrap">
              {user.values.map((value, index) => (
                <StyledView 
                  key={index} 
                  className="bg-secondary-100 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <StyledText className="text-secondary-700 text-sm">
                    {value}
                  </StyledText>
                </StyledView>
              ))}
            </StyledView>
          </Card>
        </StyledView>

        {/* Tabs */}
        <StyledView className="px-6">
          <StyledView className="flex-row space-x-2 mb-4">
            {[
              { key: 'vibes', label: 'My Vibes', icon: Video },
              { key: 'achievements', label: 'Achievements', icon: Trophy },
              { key: 'stats', label: 'Stats', icon: Users },
            ].map((tab) => (
              <Button
                key={tab.key}
                title={tab.label}
                onPress={() => setActiveTab(tab.key as any)}
                variant={activeTab === tab.key ? "primary" : "outline"}
                size="sm"
                icon={<tab.icon size={16} color={activeTab === tab.key ? "white" : "#14b8a6"} />}
              />
            ))}
          </StyledView>
        </StyledView>

        {/* Tab Content */}
        <StyledView className="px-6 pb-6">
          {activeTab === 'vibes' && (
            <Card className="items-center p-8">
              <StyledText className="text-4xl mb-4">🎬</StyledText>
              <StyledText className="text-xl font-bold text-neutral-800 mb-2">
                Your Vibe Gallery
              </StyledText>
              <StyledText className="text-neutral-600 text-center mb-6">
                Share more authentic vibes to build your profile
              </StyledText>
              <Button
                title="Create First Vibe"
                onPress={() => {}}
                variant="primary"
              />
            </Card>
          )}

          {activeTab === 'achievements' && (
            <StyledView className="space-y-3">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <StyledView className="flex-row items-center">
                    <StyledText className="text-2xl mr-3">
                      {achievement.icon}
                    </StyledText>
                    <StyledView className="flex-1">
                      <StyledText className="font-semibold text-neutral-800">
                        {achievement.title}
                      </StyledText>
                      <StyledText className="text-neutral-600 text-sm">
                        {achievement.description}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </Card>
              ))}
            </StyledView>
          )}

          {activeTab === 'stats' && (
            <StyledView className="space-y-3">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <StyledView className="flex-row items-center justify-between">
                    <StyledView className="flex-row items-center">
                      <StyledText className="text-xl mr-3">
                        {stat.icon}
                      </StyledText>
                      <StyledText className="text-neutral-700 font-medium">
                        {stat.label}
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-xl font-bold text-primary-600">
                      {stat.value}
                    </StyledText>
                  </StyledView>
                </Card>
              ))}
            </StyledView>
          )}
        </StyledView>

        {/* Settings Actions */}
        <StyledView className="px-6 py-4 space-y-3">
          <Button
            title="Privacy & Safety"
            onPress={() => {}}
            variant="outline"
            className="w-full justify-start"
            icon={<Shield size={18} color="#14b8a6" />}
          />
          
          <Button
            title="Sign Out"
            onPress={logout}
            variant="ghost"
            className="w-full justify-start"
            textStyle={{ color: '#ef4444' }}
          />
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}