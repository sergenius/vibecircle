import React, { createContext, useContext, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { useAuth } from './AuthContext';

interface UserContextValue {
  isLoading: boolean;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  getUserProfile: (userId: string) => Promise<User | null>;
  searchUsers: (query: string) => Promise<User[]>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();

  const updateProfile = async (userId: string, updates: Partial<User>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          display_name: updates.displayName,
          avatar: updates.avatar,
          vibe_video: updates.vibeVideo,
          bio: updates.bio,
          age: updates.age,
          location: updates.location,
          interests: updates.interests,
          values: updates.values,
        })
        .eq('id', userId);

      if (error) throw error;

      // Update local auth context
      updateUser(updates);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async (userId: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!profile) return null;

      // Fetch user badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id, badges(*), earned_at')
        .eq('user_id', userId);

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
        email: '', // Email not needed for other users
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
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    setIsLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;

      const users: User[] = profiles?.map((profile: any) => ({
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
      })) || [];

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo<UserContextValue>(() => ({
    isLoading,
    updateProfile,
    getUserProfile,
    searchUsers,
  }), [isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
