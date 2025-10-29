import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import { styled } from 'nativewind';
import { Vibe } from '../../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

interface VibePlayerProps {
  vibe: Vibe;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function VibePlayer({ 
  vibe, 
  autoPlay = false, 
  showControls = true,
  className = '' 
}: VibePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StyledView className={`relative ${className}`}>
      {/* Video Player */}
      <Video
        source={{ uri: vibe.videoUrl }}
        style={{ 
          width: screenWidth - 32, 
          height: (screenWidth - 32) * (16/9),
          borderRadius: 16 
        }}
        isLooping
        shouldPlay={isPlaying}
        isMuted={isMuted}
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={(status) => {
          if ('isLoaded' in status && status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying || false);
          }
        }}
      />

      {/* Overlay Controls */}
      {showControls && (
        <StyledView className="absolute inset-0 justify-between p-4">
          {/* Top Info */}
          <StyledView className="flex-row justify-between items-start">
            <StyledView className="bg-black/50 rounded-full px-3 py-1">
              <StyledText className="text-white text-sm font-medium">
                @{vibe.user.username}
              </StyledText>
            </StyledView>
            <StyledView className="bg-black/50 rounded-full px-3 py-1">
              <StyledText className="text-white text-sm">
                {formatTime(duration)}
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Center Play Button */}
          <StyledView className="items-center">
            <StyledPressable
              onPress={togglePlay}
              className="bg-black/50 rounded-full p-4"
            >
              {isPlaying ? (
                <Pause size={32} color="white" />
              ) : (
                <Play size={32} color="white" />
              )}
            </StyledPressable>
          </StyledView>

          {/* Bottom Controls */}
          <StyledView className="flex-row justify-between items-end">
            <StyledView className="flex-1">
              {vibe.title && (
                <StyledText className="text-white font-semibold text-lg mb-1">
                  {vibe.title}
                </StyledText>
              )}
              {vibe.tags.length > 0 && (
                <StyledView className="flex-row flex-wrap">
                  {vibe.tags.slice(0, 3).map((tag, index) => (
                    <StyledView key={index} className="bg-primary-500/80 rounded-full px-2 py-1 mr-2 mb-1">
                      <StyledText className="text-white text-xs">#{tag}</StyledText>
                    </StyledView>
                  ))}
                </StyledView>
              )}
            </StyledView>
            
            <StyledPressable
              onPress={toggleMute}
              className="bg-black/50 rounded-full p-2 ml-4"
            >
              {isMuted ? (
                <VolumeX size={20} color="white" />
              ) : (
                <Volume2 size={20} color="white" />
              )}
            </StyledPressable>
          </StyledView>

          {/* Progress Bar */}
          <StyledView className="absolute bottom-0 left-0 right-0 bg-black/20 h-1">
            <StyledView 
              className="bg-primary-500 h-1 rounded-full"
              style={{ 
                width: duration > 0 ? `${(position / duration) * 100}%` : '0%' 
              }}
            />
          </StyledView>
        </StyledView>
      )}
    </StyledView>
  );
}