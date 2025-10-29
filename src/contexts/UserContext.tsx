import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { UserProfile } from '@/types';
import { mockUsers } from '@/data/mockData';

interface UserState {
  profile: UserProfile | null;
}

type UserAction =
  | { type: 'SET_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> };

interface UserContextValue extends UserState {
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const initialState: UserState = {
  profile: mockUsers[0],
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { profile: action.payload };
    case 'UPDATE_PROFILE':
      if (!state.profile) return state;
      return { profile: { ...state.profile, ...action.payload } };
    default:
      return state;
  }
}

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const value = useMemo<UserContextValue>(() => ({
    ...state,
    setProfile: (profile) => dispatch({ type: 'SET_PROFILE', payload: profile }),
    updateProfile: (updates) => dispatch({ type: 'UPDATE_PROFILE', payload: updates }),
  }), [state]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
