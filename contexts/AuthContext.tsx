import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthState, User } from '../types';

interface AuthAction {
  type: 'SET_LOADING' | 'LOGIN' | 'LOGOUT' | 'UPDATE_USER' | 'COMPLETE_ONBOARDING';
  payload?: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  hasCompletedOnboarding: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        hasCompletedOnboarding: action.payload.hasCompletedOnboarding,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        hasCompletedOnboarding: true,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, phone: string) => Promise<void>;
  updateUser: (user: User) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userData = await SecureStore.getItemAsync('user_data');
      const onboardingStatus = await SecureStore.getItemAsync('onboarding_complete');

      if (token && userData) {
        dispatch({
          type: 'LOGIN',
          payload: {
            token,
            user: JSON.parse(userData),
            hasCompletedOnboarding: onboardingStatus === 'true',
          },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email,
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        ageGroup: '22-25',
        interests: ['gaming', 'music'],
        values: ['loyalty', 'authenticity'],
        authenticity: 85,
        joinDate: new Date(),
        lastActive: new Date(),
        preferences: {
          maxDistance: 50,
          ageGroups: ['22-25', '26-32'],
          languages: ['en'],
        },
      };

      const token = 'mock_jwt_token';
      
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(mockUser));
      
      dispatch({
        type: 'LOGIN',
        payload: {
          token,
          user: mockUser,
          hasCompletedOnboarding: true,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (email: string, password: string, phone: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Simulate API registration
      // Navigate to onboarding after successful registration
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      await SecureStore.deleteItemAsync('onboarding_complete');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    SecureStore.setItemAsync('user_data', JSON.stringify(user));
  };

  const completeOnboarding = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    SecureStore.setItemAsync('onboarding_complete', 'true');
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateUser,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}