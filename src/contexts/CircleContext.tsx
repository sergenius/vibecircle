import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Circle } from '@/types';
import { mockCircles } from '@/data/mockData';

interface CircleState {
  joined: Circle[];
  recommended: Circle[];
}

type CircleAction =
  | { type: 'JOIN_CIRCLE'; payload: string }
  | { type: 'LEAVE_CIRCLE'; payload: string }
  | { type: 'SET_CIRCLES'; payload: { joined: Circle[]; recommended: Circle[] } };

interface CircleContextValue extends CircleState {
  joinCircle: (circleId: string) => void;
  leaveCircle: (circleId: string) => void;
}

const partitionCircles = () => {
  const joined = mockCircles.filter((circle) => circle.isJoined);
  const recommended = mockCircles.filter((circle) => !circle.isJoined);
  return { joined, recommended };
};

const initialState: CircleState = partitionCircles();

const CircleContext = createContext<CircleContextValue | undefined>(undefined);

function circleReducer(state: CircleState, action: CircleAction): CircleState {
  switch (action.type) {
    case 'JOIN_CIRCLE': {
      const all = [...state.joined, ...state.recommended];
      return {
        joined: all
          .map((circle) => (circle.id === action.payload ? { ...circle, isJoined: true } : circle))
          .filter((circle) => circle.isJoined),
        recommended: all
          .map((circle) => (circle.id === action.payload ? { ...circle, isJoined: true } : circle))
          .filter((circle) => !circle.isJoined),
      };
    }
    case 'LEAVE_CIRCLE': {
      const all = [...state.joined, ...state.recommended];
      return {
        joined: all
          .map((circle) => (circle.id === action.payload ? { ...circle, isJoined: false } : circle))
          .filter((circle) => circle.isJoined),
        recommended: all
          .map((circle) => (circle.id === action.payload ? { ...circle, isJoined: false } : circle))
          .filter((circle) => !circle.isJoined),
      };
    }
    case 'SET_CIRCLES':
      return action.payload;
    default:
      return state;
  }
}

export const CircleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(circleReducer, initialState);

  const value = useMemo<CircleContextValue>(() => ({
    ...state,
    joinCircle: (circleId) => dispatch({ type: 'JOIN_CIRCLE', payload: circleId }),
    leaveCircle: (circleId) => dispatch({ type: 'LEAVE_CIRCLE', payload: circleId }),
  }), [state]);

  return <CircleContext.Provider value={value}>{children}</CircleContext.Provider>;
};

export const useCircles = (): CircleContextValue => {
  const context = useContext(CircleContext);
  if (!context) {
    throw new Error('useCircles must be used within a CircleProvider');
  }
  return context;
};
