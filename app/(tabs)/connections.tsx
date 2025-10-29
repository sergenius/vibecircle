import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, Image } from 'react-native';
import { styled } from 'nativewind';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  Search,
  Clock,
  Heart,
  Star
} from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Connection, User } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledImage = styled(Image);

// Mock data
const connections: Connection[] = [
  {
    id: '1',
    users: ['user1', 'user2'],
    level: 'established',
    connectedAt: new Date(2024, 0, 15),
    lastInteraction: new Date(),
    interactions: 45,
    sharedCircles: ['circle1', 'circle2'],
    milestones: [],
    status: 'active',
  },
];

const mockConnectedUsers: User[] = [
  {
    id: '2',
    username: 'sarah_reads',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    age: 24,
    ageGroup: '22-25',
    interests: ['books', 'coffee', 'hiking'],
    values: ['authenticity', 'growth'],
    authenticity: 92,
    joinDate: new Date(),
    lastActive: new Date(),
    preferences: {
      maxDistance: 30,
      ageGroups: ['22-25'],
      languages: ['en'],
    },
  },
  {
    id: '3',
    username: 'alex_codes',
    email: 'alex@example.com',
    firstName: 'Alex',
    lastName: 'Chen',
    age: 26,
    ageGroup: '26-32',
    interests: ['coding', 'gaming', 'music'],
    values: ['innovation', 'collaboration'],
    authenticity: 88,
    joinDate: new Date(),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    preferences: {
      maxDistance: 50,
      ageGroups: ['22-25', '26-32'],
      languages: ['en'],
    },
  },
];

const levelStyles = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🌱' },
  growing: { bg: 'bg-green-100', text: 'text-green-700', icon: '🌿' },
  established: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🌳' },
  close: { bg: 'bg-pink-100', text: 'text-pink-700', icon: '💜' },
};

export default function ConnectionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const ConnectionCard = ({ user }: { user: User }) => {
    const levelInfo = levelStyles['established']; // Mock level
    
    return (
      <Card className="mb-3">
        <StyledView className="flex-row items-center">
          {/* Avatar */}
          <StyledView className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
            <StyledText className="text-lg">{user.firstName[0]}</StyledText>
          </StyledView>
          
          {/* User Info */}
          <StyledView className="flex-1">
            <StyledView className="flex-row items-center mb-1">
              <StyledText className="font-semibold text-neutral-800 text-base">
                {user.firstName}
              </StyledText>
              <StyledText className="text-neutral-500 text-sm ml-1">
                @{user.username}
              </StyledText>
              <StyledView className={`${levelInfo.bg} rounded-full px-2 py-1 ml-2`}>
                <StyledText className={`${levelInfo.text} text-xs font-medium`}>
                  {levelInfo.icon}
                </StyledText>
              </StyledView>
            </StyledView>
            
            <StyledText className="text-neutral-500 text-sm">
              {formatLastActive(user.lastActive)}
            </StyledText>
          </StyledView>
          
          {/* Quick Actions */}
          <StyledView className="flex-row space-x-2">
            <Button
              title=""
              onPress={() => {}}
              variant="outline"
              size="sm"
              icon={<MessageCircle size={16} color="#14b8a6" />}
            />
          </StyledView>
        </StyledView>
      </Card>
    );
  };

  return (
    <StyledView className="flex-1 bg-neutral-50">
      {/* Header */}
      <StyledView className="bg-white px-6 pt-16 pb-4">
        <StyledView className="flex-row justify-between items-center mb-4">
          <StyledView className="flex-row items-center">
            <MessageCircle size={24} color="#14b8a6" />
            <StyledText className="text-xl font-bold text-neutral-800 ml-2">
              Connections
            </StyledText>
          </StyledView>
          
          <Button
            title=""
            onPress={() => {}}
            variant="outline"
            size="sm"
            icon={<Calendar size={18} color="#14b8a6" />}
          />
        </StyledView>

        {/* Search */}
        <Input
          placeholder="Search connections..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color="#9ca3af" />}
          className="mb-4"
        />

        {/* Tabs */}
        <StyledView className="flex-row space-x-2">
          {[
            { key: 'all', label: 'All', count: mockConnectedUsers.length },
            { key: 'recent', label: 'Recent', count: 3 },
            { key: 'favorites', label: 'Favorites', count: 1 },
          ].map((tab) => (
            <Button
              key={tab.key}
              title={`${tab.label} (${tab.count})`}
              onPress={() => setActiveTab(tab.key as any)}
              variant={activeTab === tab.key ? "primary" : "outline"}
              size="sm"
            />
          ))}
        </StyledView>
      </StyledView>

      <StyledScrollView className="flex-1">
        {/* Stats Cards */}
        <StyledView className="px-6 py-4">
          <StyledView className="flex-row space-x-3 mb-6">
            <Card className="flex-1 items-center p-4">
              <StyledText className="text-2xl font-bold text-primary-600">
                {mockConnectedUsers.length}
              </StyledText>
              <StyledText className="text-neutral-600 text-sm">
                Total Friends
              </StyledText>
            </Card>
            
            <Card className="flex-1 items-center p-4">
              <StyledText className="text-2xl font-bold text-secondary-600">
                3
              </StyledText>
              <StyledText className="text-neutral-600 text-sm">
                New This Week
              </StyledText>
            </Card>
            
            <Card className="flex-1 items-center p-4">
              <StyledText className="text-2xl font-bold text-success-600">
                89%
              </StyledText>
              <StyledText className="text-neutral-600 text-sm">
                Avg. Match
              </StyledText>
            </Card>
          </StyledView>
        </StyledView>

        {/* Friendship Levels Guide */}
        <StyledView className="px-6 mb-4">
          <Card className="p-4">
            <StyledText className="font-bold text-neutral-800 mb-3">
              Friendship Levels
            </StyledText>
            
            <StyledView className="space-y-2">
              {Object.entries(levelStyles).map(([level, style]) => (
                <StyledView key={level} className="flex-row items-center">
                  <StyledView className={`${style.bg} rounded-full px-2 py-1 mr-3`}>
                    <StyledText className={`${style.text} text-xs font-medium`}>
                      {style.icon}
                    </StyledText>
                  </StyledView>
                  <StyledText className="text-neutral-600 text-sm capitalize">
                    {level === 'new' && 'New Friend (< 1 week)'}
                    {level === 'growing' && 'Growing Connection (1-4 weeks)'}
                    {level === 'established' && 'Established Friend (1-3 months)'}
                    {level === 'close' && 'Close Circle (3+ months)'}
                  </StyledText>
                </StyledView>
              ))}
            </StyledView>
          </Card>
        </StyledView>

        {/* Connections List */}
        <StyledView className="px-6 pb-6">
          <StyledText className="text-lg font-bold text-neutral-800 mb-4">
            Your Friends
          </StyledText>
          
          {mockConnectedUsers.length > 0 ? (
            mockConnectedUsers.map((user) => (
              <ConnectionCard key={user.id} user={user} />
            ))
          ) : (
            <Card className="items-center p-8">
              <StyledText className="text-4xl mb-4">👋</StyledText>
              <StyledText className="text-xl font-bold text-neutral-800 mb-2">
                Start Making Friends!
              </StyledText>
              <StyledText className="text-neutral-600 text-center mb-6">
                Connect with people through Discover to see them here
              </StyledText>
              <Button
                title="Discover Friends"
                onPress={() => {}}
                variant="primary"
              />
            </Card>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}