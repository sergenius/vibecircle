import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Vibe } from '@/types';
import { mockVibes } from '@/data/mockData';

interface RecordingState {
  isRecording: boolean;
  prompt: string | null;
  countdown: number;
}

interface VibeState {
  vibes: Vibe[];
  recording: RecordingState;
  selectedVibeId?: string;
}

type VibeAction =
  | { type: 'SET_VIBES'; payload: Vibe[] }
  | { type: 'ADD_VIBE'; payload: Vibe }
  | { type: 'SET_RECORDING'; payload: Partial<RecordingState> }
  | { type: 'SELECT_VIBE'; payload: string | undefined };

interface VibeContextValue extends VibeState {
  setVibes: (items: Vibe[]) => void;
  addVibe: (vibe: Vibe) => void;
  startRecording: (prompt: string) => void;
  stopRecording: () => void;
  selectVibe: (id?: string) => void;
}

const initialState: VibeState = {
  vibes: mockVibes,
  recording: {
    isRecording: false,
    prompt: null,
    countdown: 3,
  },
  selectedVibeId: mockVibes[0]?.id,
};

const VibeContext = createContext<VibeContextValue | undefined>(undefined);

function vibeReducer(state: VibeState, action: VibeAction): VibeState {
  switch (action.type) {
    case 'SET_VIBES':
      return { ...state, vibes: action.payload };
    case 'ADD_VIBE':
      return { ...state, vibes: [action.payload, ...state.vibes], selectedVibeId: action.payload.id };
    case 'SET_RECORDING':
      return { ...state, recording: { ...state.recording, ...action.payload } };
    case 'SELECT_VIBE':
      return { ...state, selectedVibeId: action.payload };
    default:
      return state;
  }
}

export const VibeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(vibeReducer, initialState);

  const value = useMemo<VibeContextValue>(() => ({
    ...state,
    setVibes: (items) => dispatch({ type: 'SET_VIBES', payload: items }),
    addVibe: (vibe) => dispatch({ type: 'ADD_VIBE', payload: vibe }),
    startRecording: (prompt) =>
      dispatch({ type: 'SET_RECORDING', payload: { isRecording: true, prompt, countdown: 3 } }),
    stopRecording: () =>
      dispatch({ type: 'SET_RECORDING', payload: { isRecording: false, prompt: null, countdown: 3 } }),
    selectVibe: (id) => dispatch({ type: 'SELECT_VIBE', payload: id }),
  }), [state]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
};

export const useVibes = (): VibeContextValue => {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibes must be used within a VibeProvider');
  }
  return context;
};
