import React, { createContext, useContext, useReducer } from 'react';
import { Vibe, Match } from '../types';

interface VibeState {
  currentVibe: Vibe | null;
  isPlaying: boolean;
  isRecording: boolean;
  recordedVibe: string | null;
  dailyMatches: Match[];
  matchesLoading: boolean;
  recordingProgress: number;
}

interface VibeAction {
  type: 
    | 'SET_CURRENT_VIBE' 
    | 'TOGGLE_PLAYING' 
    | 'START_RECORDING' 
    | 'STOP_RECORDING' 
    | 'SET_RECORDED_VIBE'
    | 'SET_DAILY_MATCHES'
    | 'SET_MATCHES_LOADING'
    | 'UPDATE_RECORDING_PROGRESS'
    | 'CLEAR_RECORDED_VIBE';
  payload?: any;
}

const initialState: VibeState = {
  currentVibe: null,
  isPlaying: false,
  isRecording: false,
  recordedVibe: null,
  dailyMatches: [],
  matchesLoading: false,
  recordingProgress: 0,
};

const vibeReducer = (state: VibeState, action: VibeAction): VibeState => {
  switch (action.type) {
    case 'SET_CURRENT_VIBE':
      return { ...state, currentVibe: action.payload };
    case 'TOGGLE_PLAYING':
      return { ...state, isPlaying: !state.isPlaying };
    case 'START_RECORDING':
      return { ...state, isRecording: true, recordingProgress: 0 };
    case 'STOP_RECORDING':
      return { ...state, isRecording: false, recordingProgress: 0 };
    case 'SET_RECORDED_VIBE':
      return { ...state, recordedVibe: action.payload };
    case 'CLEAR_RECORDED_VIBE':
      return { ...state, recordedVibe: null };
    case 'SET_DAILY_MATCHES':
      return { ...state, dailyMatches: action.payload };
    case 'SET_MATCHES_LOADING':
      return { ...state, matchesLoading: action.payload };
    case 'UPDATE_RECORDING_PROGRESS':
      return { ...state, recordingProgress: action.payload };
    default:
      return state;
  }
};

interface VibeContextType extends VibeState {
  setCurrentVibe: (vibe: Vibe | null) => void;
  togglePlaying: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setRecordedVibe: (uri: string) => void;
  clearRecordedVibe: () => void;
  loadDailyMatches: () => Promise<void>;
  connectWithMatch: (matchId: string) => Promise<void>;
  passOnMatch: (matchId: string) => Promise<void>;
}

const VibeContext = createContext<VibeContextType | null>(null);

export function VibeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(vibeReducer, initialState);

  const setCurrentVibe = (vibe: Vibe | null) => {
    dispatch({ type: 'SET_CURRENT_VIBE', payload: vibe });
  };

  const togglePlaying = () => {
    dispatch({ type: 'TOGGLE_PLAYING' });
  };

  const startRecording = () => {
    dispatch({ type: 'START_RECORDING' });
  };

  const stopRecording = () => {
    dispatch({ type: 'STOP_RECORDING' });
  };

  const setRecordedVibe = (uri: string) => {
    dispatch({ type: 'SET_RECORDED_VIBE', payload: uri });
  };

  const clearRecordedVibe = () => {
    dispatch({ type: 'CLEAR_RECORDED_VIBE' });
  };

  const loadDailyMatches = async () => {
    dispatch({ type: 'SET_MATCHES_LOADING', payload: true });
    
    try {
      // Simulate API call to get daily matches
      const mockMatches: Match[] = [
        {
          id: '1',
          user: {
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
          vibe: {
            id: 'v1',
            userId: '2',
            user: {} as User,
            videoUrl: 'https://example.com/vibe1.mp4',
            thumbnailUrl: 'https://example.com/thumb1.jpg',
            title: 'Love for books and nature',
            tags: ['books', 'nature', 'introvert'],
            mood: 'thoughtful',
            duration: 15,
            createdAt: new Date(),
            views: 12,
            connections: 3,
            circles: [],
            isProfileVibe: true,
          },
          compatibilityScore: 89,
          reasons: ['You both love reading and value authenticity', 'Similar interests in nature and personal growth'],
          sharedInterests: ['books', 'hiking'],
          valuesAlignment: 85,
          createdAt: new Date(),
          viewed: false,
          status: 'pending',
        },
      ];

      dispatch({ type: 'SET_DAILY_MATCHES', payload: mockMatches });
    } catch (error) {
      console.error('Error loading daily matches:', error);
    } finally {
      dispatch({ type: 'SET_MATCHES_LOADING', payload: false });
    }
  };

  const connectWithMatch = async (matchId: string) => {
    try {
      // Simulate API call to connect with match
    } catch (error) {
      console.error('Error connecting with match:', error);
    }
  };

  const passOnMatch = async (matchId: string) => {
    try {
      // Simulate API call to pass on match
      const updatedMatches = state.dailyMatches.filter(match => match.id !== matchId);
      dispatch({ type: 'SET_DAILY_MATCHES', payload: updatedMatches });
    } catch (error) {
      console.error('Error passing on match:', error);
    }
  };

  const value: VibeContextType = {
    ...state,
    setCurrentVibe,
    togglePlaying,
    startRecording,
    stopRecording,
    setRecordedVibe,
    clearRecordedVibe,
    loadDailyMatches,
    connectWithMatch,
    passOnMatch,
  };

  return (
    <VibeContext.Provider value={value}>
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
}