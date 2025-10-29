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

// Helper function to convert Supabase profile to User type
const profileToUser = async (profile: any, authUserId: string): Promise<User> => {
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id, badges(*), earned_at')
    .eq('user_id', authUserId);

  const badges = userBadges?.map((ub: any) => ({
    id: ub.badges.id,
    name: ub.badges.name,
    description: ub.badges.description,
    icon: ub.badges.icon,
    color: ub.badges.color,
    earnedAt: new Date(ub.earned_at),
  })) || [];

  return {
    id: profile.id,
    email: profile.email || '',
    username: profile.username,
    displayName: profile.display_name,
    avatar: profile.avatar,
    vibeVideo: profile.vibe_video,
    bio: profile.bio,
    age: profile.age,
    location: profile.location,
    interests: profile.interests || [],
    values: profile.values || [],
    authenticityScore: profile.authenticity_score,
    friendsCount: profile.friends_count,
    circlesCount: profile.circles_count,
    joinedAt: new Date(profile.created_at),
    isOnline: profile.is_online,
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
        throw authError;
      }
      if (!authData.user) throw new Error('No user returned');

      console.log('User authenticated:', authData.user.id);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      console.log('Profile fetched:', profile);

      const user = await profileToUser({ ...profile, email: authData.user.email }, authData.user.id);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
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

      // Wait a bit for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update profile with interests
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          interests: data.interests,
        })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated with interests');

      // Fetch complete profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      console.log('Complete profile:', profile);

      const user = await profileToUser({ ...profile, email: authData.user.email }, authData.user.id);
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const user = await profileToUser({ ...profile, email: session.user.email }, session.user.id);
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          } else {
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user = await profileToUser({ ...profile, email: session.user.email }, session.user.id);
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
