import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  displayName: string;
  age: number;
  interests: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert user row to User type
const userRowToUser = async (userRow: any): Promise<User> => {
  // Fetch user badges if they exist
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id, badges(*), earned_at')
    .eq('user_id', userRow.id);

  const badges = userBadges?.map((ub: any) => ({
    id: ub.badges.id,
    name: ub.badges.name,
    description: ub.badges.description,
    icon: ub.badges.icon,
    color: ub.badges.color,
    earnedAt: new Date(ub.earned_at),
  })) || [];

  return {
    id: userRow.id,
    email: userRow.email || '',
    username: userRow.username,
    displayName: userRow.display_name,
    avatar: userRow.avatar_url,
    vibeVideo: undefined,
    bio: userRow.bio || '',
    age: userRow.age,
    location: userRow.location || '',
    interests: userRow.interests || [],
    values: userRow.values || [],
    authenticityScore: userRow.authenticity_score || 75,
    friendsCount: userRow.friends_count || 0,
    circlesCount: userRow.circles_count || 0,
    joinedAt: new Date(userRow.created_at),
    isOnline: userRow.is_online || false,
    badges,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      console.log('Attempting login with email:', email);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address before logging in. Check your inbox for the confirmation link.');
        }
        throw authError;
      }
      if (!authData.user) throw new Error('No user returned');

      console.log('User authenticated:', authData.user.id);

      // Fetch user data from public.users
      console.log('Fetching user from public.users:', authData.user.id);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }

      if (!userData) {
        throw new Error('User profile not found. Please try registering again.');
      }

      console.log('User data fetched:', userData);

      const user = await userRowToUser(userData);
      console.log('User object created:', user);

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      console.log('Login complete!');
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_ERROR', payload: error.message || 'Login failed' });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      console.log('Attempting registration for:', data.email);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            display_name: data.displayName,
            age: data.age,
          },
        },
      });

      if (authError) {
        console.error('Supabase signup error:', authError);
        throw authError;
      }
      if (!authData.user) throw new Error('No user returned');

      console.log('User created:', authData.user.id);
      console.log('User email confirmed:', authData.user.email_confirmed_at);
      console.log('Session created:', !!authData.session);

      // Check if email confirmation is required
      if (!authData.session) {
        console.warn('No session returned - email confirmation is required');
        dispatch({ type: 'LOGOUT' });
        throw new Error('Account created successfully! Please check your email and click the confirmation link to activate your account.');
      }

      // Wait a bit for the trigger to create the user record
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user with interests
      const { error: updateError } = await supabase
        .from('users')
        .update({
          interests: data.interests,
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('User update error:', updateError);
        throw updateError;
      }

      console.log('User updated with interests');

      // Fetch complete user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }

      console.log('Complete user data:', userData);

      const user = await userRowToUser(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error: any) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_ERROR', payload: error.message || 'Registration failed' });
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData) {
            const user = await userRowToUser(userData);
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          } else {
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          const user = await userRowToUser(userData);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
