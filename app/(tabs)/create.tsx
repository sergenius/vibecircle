import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { styled } from 'nativewind';
import { 
  Camera, 
  RotateCcw, 
  Square, 
  Circle as CircleIcon,
  X,
  Check,
  Lightbulb
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence
} from 'react-native-reanimated';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useVibe } from '../../contexts/VibeContext';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const { width, height } = Dimensions.get('window');

const dailyPrompts = [
  "Share something that made you smile today",
  "Show us your favorite corner of your space", 
  "What's a hidden talent you have?",
  "Describe your perfect weekend in 15 seconds",
  "Share a book/song/movie that changed you",
];

export default function CreateVibeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVibe, setRecordedVibe] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const recordButtonScale = useSharedValue(1);
  const timerScale = useSharedValue(0);
  
  const { setRecordedVibe: setContextRecordedVibe } = useVibe();

  const todaysPrompt = dailyPrompts[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % dailyPrompts.length];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 14) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const animatedRecordButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordButtonScale.value }],
  }));

  const animatedTimerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: timerScale.value }],
  }));

  if (!permission) {
    return <StyledView className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-neutral-50 px-6">
        <Camera size={64} color="#14b8a6" />
        <StyledText className="text-xl font-bold text-neutral-800 mt-4 mb-2">
          Camera Access Required
        </StyledText>
        <StyledText className="text-neutral-600 text-center mb-8">
          VibeCircle needs camera access to record your authentic vibes
        </StyledText>
        <Button
          title="Grant Camera Access"
          onPress={requestPermission}
          size="lg"
        />
      </StyledView>
    );
  }

  const startRecording = () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        recordButtonScale.value = withSequence(
          withTiming(0.8, { duration: 100 }),
          withTiming(1.2, { duration: 100 }),
          withTiming(1, { duration: 100 })
        );
        timerScale.value = withTiming(1, { duration: 200 });
        
        // Simulate recording (in real app, use cameraRef.current.recordAsync())
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      try {
        setIsRecording(false);
        setRecordingTime(0);
        timerScale.value = withTiming(0, { duration: 200 });
        
        // Simulate recorded video URI
        const mockVideoUri = 'file://mock-video-uri.mp4';
        setRecordedVibe(mockVideoUri);
        setContextRecordedVibe(mockVideoUri);
        
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const discardVibe = () => {
    setRecordedVibe(null);
    setContextRecordedVibe('');
  };

  if (recordedVibe) {
    return (
      <StyledView className="flex-1 bg-black">
        {/* Review Screen */}
        <StyledView className="flex-1 justify-center items-center">
          <StyledView className="bg-neutral-800 rounded-2xl p-8 m-6">
            <StyledText className="text-white text-xl font-bold text-center mb-4">
              Vibe Recorded! 🎬
            </StyledText>
            <StyledText className="text-neutral-300 text-center mb-8">
              Your authentic 15-second intro is ready to share
            </StyledText>
            
            <StyledView className="flex-row space-x-4">
              <Button
                title="Re-record"
                onPress={discardVibe}
                variant="outline"
                className="flex-1 border-neutral-500"
                textStyle={{ color: 'white' }}
                icon={<X size={18} color="white" />}
              />
              <Button
                title="Continue"
                onPress={() => {}}
                variant="primary"
                className="flex-1"
                icon={<Check size={18} color="white" />}
              />
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-black">
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={facing}
      >
        {/* Top Overlay */}
        <StyledView className="absolute top-0 left-0 right-0 pt-16 pb-4 px-6">
          <Card className="bg-black/70 border-0">
            <StyledView className="flex-row items-start">
              <Lightbulb size={20} color="#fb923c" />
              <StyledView className="flex-1 ml-3">
                <StyledText className="text-white font-semibold mb-1">
                  Today's Prompt:
                </StyledText>
                <StyledText className="text-neutral-200 text-sm">
                  {todaysPrompt}
                </StyledText>
              </StyledView>
            </StyledView>
          </Card>
        </StyledView>

        {/* Recording Timer */}
        {isRecording && (
          <Animated.View 
            style={animatedTimerStyle}
            className="absolute top-32 self-center bg-danger-500 rounded-full px-4 py-2"
          >
            <StyledText className="text-white font-bold">
              0:{(15 - recordingTime).toString().padStart(2, '0')}
            </StyledText>
          </Animated.View>
        )}

        {/* Bottom Controls */}
        <StyledView className="absolute bottom-0 left-0 right-0 pb-12 px-6">
          <StyledView className="flex-row justify-between items-center">
            {/* Camera Flip */}
            <StyledPressable
              onPress={toggleCameraFacing}
              className="bg-black/50 rounded-full p-4"
            >
              <RotateCcw size={24} color="white" />
            </StyledPressable>

            {/* Record Button */}
            <Animated.View style={animatedRecordButtonStyle}>
              <StyledPressable
                onPress={isRecording ? stopRecording : startRecording}
                className={`
                  w-20 h-20 rounded-full border-4 border-white
                  items-center justify-center
                  ${isRecording ? 'bg-danger-500' : 'bg-transparent'}
                `}
              >
                {isRecording ? (
                  <Square size={32} color="white" />
                ) : (
                  <CircleIcon size={32} color="white" fill="white" />
                )}
              </StyledPressable>
            </Animated.View>

            {/* Placeholder for symmetry */}
            <StyledView className="w-14 h-14" />
          </StyledView>

          {/* Recording Instructions */}
          {!isRecording && (
            <StyledText className="text-white text-center mt-4 text-sm">
              Hold to record • 15 seconds max
            </StyledText>
          )}
        </StyledView>

        {/* Grid Overlay */}
        <StyledView className="absolute inset-0 pointer-events-none">
          {/* Vertical lines */}
          <StyledView className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
          <StyledView className="absolute right-1/3 top-0 bottom-0 w-px bg-white/20" />
          
          {/* Horizontal lines */}
          <StyledView className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
          <StyledView className="absolute bottom-1/3 left-0 right-0 h-px bg-white/20" />
        </StyledView>
      </CameraView>
    </StyledView>
  );
}