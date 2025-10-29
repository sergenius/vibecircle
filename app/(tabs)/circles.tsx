import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { Users, Plus, Search, ListFilter as Filter } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import CircleCard from '../../components/ui/CircleCard';
import Input from '../../components/ui/Input';
import { useCircle } from '../../contexts/CircleContext';
import { Circle } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const categories = [
  'All',
  'Gaming & Esports',
  'Music & Arts', 
  'Books & Literature',
  'Mental Health & Wellness',
  'Tech & Coding',
  'Fitness & Sports',
];

export default function CirclesScreen() {
  const { 
    joinedCircles, 
    discoverCircles, 
    loadJoinedCircles, 
    loadDiscoverCircles,
    joinCircle,
    setCurrentCircle 
  } = useCircle();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJoinedCircles();
    loadDiscoverCircles();
  }, []);

  const filteredDiscoverCircles = discoverCircles.filter(circle => {
    const matchesCategory = selectedCategory === 'All' || circle.category === selectedCategory;
    const matchesSearch = circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         circle.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCirclePress = (circle: Circle) => {
    setCurrentCircle(circle);
    // Navigate to circle detail screen
  };

  return (
    <StyledView className="flex-1 bg-neutral-50">
      {/* Header */}
      <StyledView className="bg-white px-6 pt-16 pb-4">
        <StyledView className="flex-row justify-between items-center mb-4">
          <StyledView className="flex-row items-center">
            <Users size={24} color="#14b8a6" />
            <StyledText className="text-xl font-bold text-neutral-800 ml-2">
              Circles
            </StyledText>
          </StyledView>
          
          <Button
            title=""
            onPress={() => {}}
            variant="primary"
            size="sm"
            icon={<Plus size={18} color="white" />}
          />
        </StyledView>

        {/* Search */}
        <Input
          placeholder="Search circles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color="#9ca3af" />}
          className="mb-0"
        />
      </StyledView>

      <StyledScrollView className="flex-1">
        {/* My Circles */}
        <StyledView className="px-6 py-4">
          <StyledView className="flex-row justify-between items-center mb-4">
            <StyledText className="text-lg font-bold text-neutral-800">
              My Circles ({joinedCircles.length}/5)
            </StyledText>
          </StyledView>
          
          {joinedCircles.length > 0 ? (
            <FlatList
              data={joinedCircles}
              renderItem={({ item }) => (
                <CircleCard
                  circle={item}
                  onPress={() => handleCirclePress(item)}
                  size="medium"
                  className="mr-3"
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <StyledView className="bg-white rounded-2xl p-6 items-center">
              <StyledText className="text-4xl mb-2">🌐</StyledText>
              <StyledText className="text-neutral-600 text-center">
                Join circles to connect with people who share your interests
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        {/* Category Filter */}
        <StyledView className="px-6">
          <StyledText className="text-lg font-bold text-neutral-800 mb-3">
            Discover
          </StyledText>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <StyledView className="flex-row space-x-2 pr-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  title={category}
                  onPress={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                />
              ))}
            </StyledView>
          </ScrollView>
        </StyledView>

        {/* Discover Circles */}
        <StyledView className="px-6 pb-6">
          <StyledView className="flex-row flex-wrap justify-between">
            {filteredDiscoverCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onPress={() => handleCirclePress(circle)}
                size="large"
                className="mb-4"
                style={{ width: '48%' }}
              />
            ))}
          </StyledView>

          {filteredDiscoverCircles.length === 0 && (
            <StyledView className="bg-white rounded-2xl p-6 items-center">
              <StyledText className="text-4xl mb-2">🔍</StyledText>
              <StyledText className="text-neutral-600 text-center">
                No circles found for "{searchQuery}" in {selectedCategory}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}