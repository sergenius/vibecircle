import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Circle } from '@/types';
import { useAuth } from './AuthContext';

interface CircleState {
  circles: Circle[];
  joined: Circle[];
  recommended: Circle[];
  isLoading: boolean;
}

type CircleAction =
  | { type: 'SET_CIRCLES'; payload: Circle[] }
  | { type: 'SET_JOINED'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean };

interface CircleContextValue extends CircleState {
  joinCircle: (circleId: string) => Promise<void>;
  leaveCircle: (circleId: string) => Promise<void>;
  createCircle: (name: string, description: string, category: string, isPrivate: boolean, tags: string[], coverImage?: string) => Promise<void>;
  fetchCircles: () => Promise<void>;
  fetchUserCircles: (userId: string) => Promise<void>;
}

const initialState: CircleState = {
  circles: [],
  joined: [],
  recommended: [],
  isLoading: false,
};

const CircleContext = createContext<CircleContextValue | undefined>(undefined);

function circleReducer(state: CircleState, action: CircleAction): CircleState {
  switch (action.type) {
    case 'SET_CIRCLES':
      return { ...state, circles: action.payload };
    case 'SET_JOINED': {
      const joinedIds = new Set(action.payload);
      return {
        ...state,
        joined: state.circles.filter(c => joinedIds.has(c.id)),
        recommended: state.circles.filter(c => !joinedIds.has(c.id)),
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const CircleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(circleReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCircles();
    }
  }, [user]);

  const fetchCircles = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Fetch all public circles
      const { data: circlesData, error } = await supabase
        .from('circles')
        .select(`
          *,
          circle_members!inner(user_id, is_admin)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate member counts
      const circleMap = new Map<string, any>();
      circlesData?.forEach((item: any) => {
        if (!circleMap.has(item.id)) {
          circleMap.set(item.id, {
            ...item,
            memberCount: 0,
            adminIds: [],
          });
        }
        const circle = circleMap.get(item.id);
        circle.memberCount++;
        if (item.circle_members.is_admin) {
          circle.adminIds.push(item.circle_members.user_id);
        }
      });

      const circles: Circle[] = Array.from(circleMap.values()).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        coverImage: c.cover_image,
        memberCount: c.memberCount,
        category: c.category,
        isPrivate: c.is_private,
        createdAt: new Date(c.created_at),
        adminIds: c.adminIds,
        tags: c.tags || [],
      }));

      dispatch({ type: 'SET_CIRCLES', payload: circles });

      // Fetch user's joined circles
      if (user) {
        const { data: memberData } = await supabase
          .from('circle_members')
          .select('circle_id')
          .eq('user_id', user.id);

        const joinedIds = memberData?.map(m => m.circle_id) || [];
        dispatch({ type: 'SET_JOINED', payload: joinedIds });
      }
    } catch (error) {
      console.error('Error fetching circles:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUserCircles = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: memberData, error } = await supabase
        .from('circle_members')
        .select(`
          circle_id,
          circles(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const circles: Circle[] = memberData?.map((m: any) => ({
        id: m.circles.id,
        name: m.circles.name,
        description: m.circles.description,
        coverImage: m.circles.cover_image,
        memberCount: 0, // Will need separate query for count
        category: m.circles.category,
        isPrivate: m.circles.is_private,
        createdAt: new Date(m.circles.created_at),
        adminIds: [],
        tags: m.circles.tags || [],
      })) || [];

      dispatch({ type: 'SET_CIRCLES', payload: circles });
    } catch (error) {
      console.error('Error fetching user circles:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const joinCircle = async (circleId: string) => {
    if (!user) throw new Error('Must be logged in to join circle');

    try {
      const { error } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circleId,
          user_id: user.id,
          is_admin: false,
        });

      if (error) throw error;

      // Update local state
      const joined = [...state.joined.map(c => c.id), circleId];
      dispatch({ type: 'SET_JOINED', payload: joined });

      // Update member count
      const { error: updateError } = await supabase.rpc('increment_circle_members', { circle_id: circleId });
      if (updateError) console.error('Error updating member count:', updateError);
    } catch (error) {
      console.error('Error joining circle:', error);
      throw error;
    }
  };

  const leaveCircle = async (circleId: string) => {
    if (!user) throw new Error('Must be logged in to leave circle');

    try {
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circle_id', circleId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      const joined = state.joined.map(c => c.id).filter(id => id !== circleId);
      dispatch({ type: 'SET_JOINED', payload: joined });
    } catch (error) {
      console.error('Error leaving circle:', error);
      throw error;
    }
  };

  const createCircle = async (
    name: string,
    description: string,
    category: string,
    isPrivate: boolean,
    tags: string[],
    coverImage?: string
  ) => {
    if (!user) throw new Error('Must be logged in to create circle');

    try {
      const { data, error } = await supabase
        .from('circles')
        .insert({
          name,
          description,
          category,
          is_private: isPrivate,
          tags,
          cover_image: coverImage,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('circle_members')
        .insert({
          circle_id: data.id,
          user_id: user.id,
          is_admin: true,
        });

      if (memberError) throw memberError;

      await fetchCircles();
    } catch (error) {
      console.error('Error creating circle:', error);
      throw error;
    }
  };

  const value = useMemo<CircleContextValue>(() => ({
    ...state,
    joinCircle,
    leaveCircle,
    createCircle,
    fetchCircles,
    fetchUserCircles,
  }), [state, user]);

  return <CircleContext.Provider value={value}>{children}</CircleContext.Provider>;
};

export const useCircles = (): CircleContextValue => {
  const context = useContext(CircleContext);
  if (!context) {
    throw new Error('useCircles must be used within a CircleProvider');
  }
  return context;
};
