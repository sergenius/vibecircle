import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Match, EnergyMood } from '@/types';
import { mockMatches } from '@/data/mockData';

interface MatchPreferences {
  distanceKm: number;
  ageBrackets: string[];
  selectedInterests: string[];
  moods: EnergyMood[];
}

interface MatchState {
  matches: Match[];
  dailyLimit: number;
  remainingToday: number;
  preferences: MatchPreferences;
}

type MatchAction =
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'RECORD_CONNECT' }
  | { type: 'RECORD_PASS' }
  | { type: 'RESET_DAILY' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<MatchPreferences> };

interface MatchContextValue extends MatchState {
  connectWithMatch: (matchId: string) => void;
  passOnMatch: (matchId: string) => void;
  updatePreferences: (updates: Partial<MatchPreferences>) => void;
}

const initialState: MatchState = {
  matches: mockMatches,
  dailyLimit: 5,
  remainingToday: 5,
  preferences: {
    distanceKm: 25,
    ageBrackets: ['19-21', '22-25'],
    selectedInterests: ['Mindfulness', 'Climate Action'],
    moods: ['creative', 'supportive'],
  },
};

const MatchContext = createContext<MatchContextValue | undefined>(undefined);

function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'RECORD_CONNECT':
    case 'RECORD_PASS':
      return { ...state, remainingToday: Math.max(0, state.remainingToday - 1) };
    case 'RESET_DAILY':
      return { ...state, remainingToday: state.dailyLimit };
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    default:
      return state;
  }
}

export const MatchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  const value = useMemo<MatchContextValue>(() => ({
    ...state,
    connectWithMatch: () => dispatch({ type: 'RECORD_CONNECT' }),
    passOnMatch: () => dispatch({ type: 'RECORD_PASS' }),
    updatePreferences: (updates) => dispatch({ type: 'UPDATE_PREFERENCES', payload: updates }),
  }), [state]);

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};

export const useMatches = (): MatchContextValue => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};
