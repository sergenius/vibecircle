import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { Compass, Zap, Settings } from 'lucide-react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import VibePlayer from '../../components/ui/VibePlayer';
import { useVibe } from '../../contexts/VibeContext';
import { Match } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const { height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const { dailyMatches, matchesLoading, loadDailyMatches, connectWithMatch, passOnMatch } = useVibe();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [vibeCheckMode, setVibeCheckMode] = useState(false);

  useEffect(() => {
    loadDailyMatches();
  }, []);

  const handleConnect = async () => {
    if (dailyMatches.length > 0) {
      const currentMatch = dailyMatches[currentMatchIndex];
      await connectWithMatch(currentMatch.id);
      handleNextMatch();
    }
  };

  const handlePass = () => {
    if (dailyMatches.length > 0) {
      const currentMatch = dailyMatches[currentMatchIndex];
      passOnMatch(currentMatch.id);
      handleNextMatch();
    }
  };

  const handleNextMatch = () => {
    if (currentMatchIndex < dailyMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };

  const currentMatch = dailyMatches[currentMatchIndex];

  if (matchesLoading) {
    return (
      <StyledView className="flex-1 bg-neutral-50 justify-center items-center">
        <StyledText className="text-lg text-neutral-600">
          Finding your perfect matches...
        </StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-neutral-50">
      {/* Header */}
      <StyledView className="flex-row justify-between items-center px-6 pt-16 pb-4 bg-white">
        <StyledView className="flex-row items-center">
          <Compass size={24} color="#14b8a6" />
          <StyledText className="text-xl font-bold text-neutral-800 ml-2">
            Discover
          </StyledText>
        </StyledView>
        
        <StyledView className="flex-row space-x-2">
          <Button
            title=""
            onPress={() => setVibeCheckMode(!vibeCheckMode)}
            variant={vibeCheckMode ? "primary" : "outline"}
            size="sm"
            icon={<Zap size={18} color={vibeCheckMode ? "white" : "#14b8a6"} />}
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

      {vibeCheckMode ? (
        // Vibe Check Mode
        <StyledView className="flex-1 justify-center items-center px-6">
          <Card className="w-full p-6 items-center">
            <StyledText className="text-2xl mb-4">⚡</StyledText>
            <StyledText className="text-xl font-bold text-neutral-800 mb-2">
              Vibe Check Mode
            </StyledText>
            <StyledText className="text-neutral-600 text-center mb-6">
              Get instant matches based on your current mood and energy
            </StyledText>
            
            {/* Mood Selector */}
            <StyledView className="w-full space-y-3">
              {['🔥 Energetic', '😌 Chill', '🎨 Creative', '🤔 Thoughtful', '🎉 Social'].map((mood, index) => (
                <Button
                  key={index}
                  title={mood}
                  onPress={() => {}}
                  variant="outline"
                  className="w-full"
                />
              ))}
            </StyledView>
          </Card>
        </StyledView>
      ) : (
        // Daily Matches
        <>
          {currentMatch ? (
            <StyledScrollView className="flex-1">
              {/* Match Card */}
              <StyledView className="p-6">
                <VibePlayer 
                  vibe={currentMatch.vibe} 
                  autoPlay={true}
                  className="mb-4"
                />

                {/* Match Info */}
                <Card className="mb-4">
                  <StyledView className="flex-row items-center justify-between mb-4">
                    <StyledView className="flex-row items-center">
                      <StyledText className="text-xl font-bold text-neutral-800">
                        {currentMatch.user.firstName}
                      </StyledText>
                      <StyledText className="text-neutral-500 ml-2">
                        @{currentMatch.user.username}
                      </StyledText>
                    </StyledView>
                    
                    <StyledView className="bg-primary-100 rounded-full px-3 py-1">
                      <StyledText className="text-primary-700 font-semibold text-sm">
                        {currentMatch.compatibilityScore}% Match
                      </StyledText>
                    </StyledView>
                  </StyledView>

                  {/* Match Reasons */}
                  <StyledText className="text-neutral-700 font-medium mb-2">
                    Why we think you'll vibe:
                  </StyledText>
                  {currentMatch.reasons.map((reason, index) => (
                    <StyledText key={index} className="text-neutral-600 mb-1">
                      • {reason}
                    </StyledText>
                  ))}

                  {/* Shared Interests */}
                  <StyledView className="flex-row flex-wrap mt-4">
                    {currentMatch.sharedInterests.map((interest, index) => (
                      <StyledView 
                        key={index} 
                        className="bg-secondary-100 rounded-full px-3 py-1 mr-2 mb-2"
                      >
                        <StyledText className="text-secondary-700 text-sm">
                          {interest}
                        </StyledText>
                      </StyledView>
                    ))}
                  </StyledView>
                </Card>

                {/* Actions */}
                <StyledView className="flex-row space-x-4">
                  <Button
                    title="Pass"
                    onPress={handlePass}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  />
                  <Button
                    title="Connect"
                    onPress={handleConnect}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                  />
                </StyledView>

                {/* Match Counter */}
                <StyledText className="text-center text-neutral-500 mt-4">
                  {currentMatchIndex + 1} of {dailyMatches.length} matches today
                </StyledText>
              </StyledView>
            </StyledScrollView>
          ) : (
            // No matches
            <StyledView className="flex-1 justify-center items-center px-6">
              <StyledText className="text-6xl mb-4">🎯</StyledText>
              <StyledText className="text-xl font-bold text-neutral-800 mb-2">
                All caught up!
              </StyledText>
              <StyledText className="text-neutral-600 text-center mb-6">
                Come back tomorrow for fresh matches, or try Vibe Check mode for instant connections.
              </StyledText>
              
              <Button
                title="Try Vibe Check"
                onPress={() => setVibeCheckMode(true)}
                variant="primary"
                size="lg"
                icon={<Zap size={20} color="white" />}
              />
            </StyledView>
          )}
        </>
      )}
    </StyledView>
  );
}