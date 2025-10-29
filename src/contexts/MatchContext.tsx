import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Match, User } from '@/types';
import { useAuth } from './AuthContext';

interface MatchState {
  matches: Match[];
  isLoading: boolean;
}

type MatchAction =
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'SET_LOADING'; payload: boolean };

interface MatchContextValue extends MatchState {
  connectWithMatch: (matchId: string) => Promise<void>;
  passOnMatch: (matchId: string) => Promise<void>;
  fetchMatches: () => Promise<void>;
}

const initialState: MatchState = {
  matches: [],
  isLoading: false,
};

const MatchContext = createContext<MatchContextValue | undefined>(undefined);

function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const MatchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Get potential matches based on shared interests
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .limit(20);

      if (error) throw error;

      // Calculate compatibility scores
      const matches: Match[] = profiles?.map((profile: any) => {
        const userInterests = new Set(user.interests);
        const commonInterests = (profile.interests || []).filter((i: string) => userInterests.has(i));
        const compatibilityScore = Math.min(100, Math.round((commonInterests.length / Math.max(user.interests.length, 1)) * 100) + Math.floor(Math.random() * 20));

        const matchUser: User = {
          id: profile.id,
          email: '',
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
          badges: [],
        };

        return {
          id: profile.id,
          user: matchUser,
          compatibilityScore,
          commonInterests,
          reason: commonInterests.length > 0
            ? `You both love ${commonInterests.slice(0, 2).join(' and ')}`
            : 'Discover new connections!',
        };
      }) || [];

      // Sort by compatibility score
      matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      dispatch({ type: 'SET_MATCHES', payload: matches });
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const connectWithMatch = async (matchId: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      // Create connection request
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          friend_id: matchId,
          status: 'pending',
        });

      if (error) throw error;

      // Create notification for the match
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: matchId,
          type: 'friend_request',
          message: `${user.displayName} sent you a friend request`,
          action_url: `/profile/${user.id}`,
        });

      if (notifError) console.error('Error creating notification:', notifError);

      // Remove from matches list
      dispatch({
        type: 'SET_MATCHES',
        payload: state.matches.filter(m => m.id !== matchId),
      });
    } catch (error) {
      console.error('Error connecting with match:', error);
      throw error;
    }
  };

  const passOnMatch = async (matchId: string) => {
    // Just remove from local state
    dispatch({
      type: 'SET_MATCHES',
      payload: state.matches.filter(m => m.id !== matchId),
    });
  };

  const value = useMemo<MatchContextValue>(() => ({
    ...state,
    connectWithMatch,
    passOnMatch,
    fetchMatches,
  }), [state, user]);

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};

export const useMatches = (): MatchContextValue => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};
