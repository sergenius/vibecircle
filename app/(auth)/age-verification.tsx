import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { styled } from 'nativewind';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const ageGroups = [
  { id: '16-18', label: '16-18', description: 'High school & early college' },
  { id: '19-21', label: '19-21', description: 'College & university' },
  { id: '22-25', label: '22-25', description: 'Early career & post-grad' },
  { id: '26-32', label: '26-32', description: 'Career building & life changes' },
  { id: '33+', label: '33+', description: 'Established & growing' },
];

export default function AgeVerificationScreen() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');

  const handleContinue = () => {
    if (selectedAgeGroup) {
      router.push('/(auth)/register');
    }
  };

  return (
    <StyledView className="flex-1 bg-neutral-50">
      <StyledScrollView className="flex-1 px-6 pt-16">
        {/* Header */}
        <StyledView className="mb-8">
          <StyledText className="text-3xl font-bold text-neutral-800 mb-2">
            What's your age group?
          </StyledText>
          <StyledText className="text-neutral-600 text-lg">
            We create age-appropriate spaces for meaningful connections
          </StyledText>
        </StyledView>

        {/* Age Groups */}
        <StyledView className="space-y-3 mb-8">
          {ageGroups.map((group) => (
            <Card
              key={group.id}
              className={`
                border-2 p-4
                ${selectedAgeGroup === group.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-200'
                }
              `}
            >
              <Button
                title=""
                onPress={() => setSelectedAgeGroup(group.id)}
                variant="ghost"
                className="p-0 justify-start"
              >
                <StyledView className="w-full">
                  <StyledView className="flex-row items-center justify-between mb-2">
                    <StyledText className="text-xl font-semibold text-neutral-800">
                      {group.label}
                    </StyledText>
                    
                    <StyledView className={`
                      w-6 h-6 rounded-full border-2
                      ${selectedAgeGroup === group.id 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-neutral-300'
                      }
                    `}>
                      {selectedAgeGroup === group.id && (
                        <StyledView className="w-2 h-2 bg-white rounded-full self-center mt-1" />
                      )}
                    </StyledView>
                  </StyledView>
                  
                  <StyledText className="text-neutral-600">
                    {group.description}
                  </StyledText>
                </StyledView>
              </Button>
            </Card>
          ))}
        </StyledView>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200 border mb-8">
          <StyledView className="flex-row">
            <StyledText className="text-2xl mr-3">🛡️</StyledText>
            <StyledView className="flex-1">
              <StyledText className="font-semibold text-blue-800 mb-1">
                Why we ask this
              </StyledText>
              <StyledText className="text-blue-700 text-sm">
                Age-appropriate matching ensures you connect with people in similar life stages, creating more meaningful friendships.
              </StyledText>
            </StyledView>
          </StyledView>
        </Card>
      </StyledScrollView>

      {/* Continue Button */}
      <StyledView className="px-6 pb-8 pt-4 bg-white border-t border-neutral-200">
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedAgeGroup}
          size="lg"
          className="w-full"
        />
      </StyledView>
    </StyledView>
  );
}