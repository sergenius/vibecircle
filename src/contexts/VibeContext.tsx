import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Vibe } from '@/types';
import { useAuth } from './AuthContext';

interface RecordingState {
  isRecording: boolean;
  prompt: string | null;
  countdown: number;
}

interface VibeState {
  vibes: Vibe[];
  recording: RecordingState;
  selectedVibeId?: string;
  isLoading: boolean;
}

type VibeAction =
  | { type: 'SET_VIBES'; payload: Vibe[] }
  | { type: 'ADD_VIBE'; payload: Vibe }
  | { type: 'SET_RECORDING'; payload: Partial<RecordingState> }
  | { type: 'SELECT_VIBE'; payload: string | undefined }
  | { type: 'SET_LOADING'; payload: boolean };

interface VibeContextValue extends VibeState {
  setVibes: (items: Vibe[]) => void;
  addVibe: (vibe: Vibe) => void;
  createVibe: (videoUrl: string, description: string, mood: string, tags: string[], isPrivate: boolean) => Promise<void>;
  deleteVibe: (vibeId: string) => Promise<void>;
  likeVibe: (vibeId: string) => Promise<void>;
  startRecording: (prompt: string) => void;
  stopRecording: () => void;
  selectVibe: (id?: string) => void;
  fetchVibes: () => Promise<void>;
  fetchUserVibes: (userId: string) => Promise<void>;
}

const initialState: VibeState = {
  vibes: [],
  recording: {
    isRecording: false,
    prompt: null,
    countdown: 3,
  },
  selectedVibeId: undefined,
  isLoading: false,
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const VibeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(vibeReducer, initialState);
  const { user } = useAuth();

  // Fetch vibes on mount
  useEffect(() => {
    if (user) {
      fetchVibes();
    }
  }, [user]);

  const fetchVibes = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: vibesData, error } = await supabase
        .from('vibes')
        .select(`
          *,
          user:profiles!vibes_user_id_fkey(id, username, display_name, avatar),
          vibe_comments(id, content, created_at, user:profiles!vibe_comments_user_id_fkey(id, username, display_name, avatar))
        `)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const vibes: Vibe[] = vibesData?.map((v: any) => ({
        id: v.id,
        userId: v.user_id,
        user: {
          id: v.user.id,
          username: v.user.username,
          displayName: v.user.display_name,
          avatar: v.user.avatar,
          email: '',
          bio: '',
          age: 0,
          location: '',
          interests: [],
          values: [],
          authenticityScore: 0,
          friendsCount: 0,
          circlesCount: 0,
          joinedAt: new Date(),
          isOnline: false,
          badges: [],
        },
        videoUrl: v.video_url,
        description: v.description,
        mood: v.mood,
        tags: v.tags,
        likes: v.likes,
        comments: v.vibe_comments?.map((c: any) => ({
          id: c.id,
          userId: c.user.id,
          user: {
            id: c.user.id,
            username: c.user.username,
            displayName: c.user.display_name,
            avatar: c.user.avatar,
            email: '',
            bio: '',
            age: 0,
            location: '',
            interests: [],
            values: [],
            authenticityScore: 0,
            friendsCount: 0,
            circlesCount: 0,
            joinedAt: new Date(),
            isOnline: false,
            badges: [],
          },
          content: c.content,
          createdAt: new Date(c.created_at),
        })) || [],
        createdAt: new Date(v.created_at),
        isPrivate: v.is_private,
      })) || [];

      dispatch({ type: 'SET_VIBES', payload: vibes });
    } catch (error) {
      console.error('Error fetching vibes:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchUserVibes = async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: vibesData, error } = await supabase
        .from('vibes')
        .select(`
          *,
          user:profiles!vibes_user_id_fkey(id, username, display_name, avatar),
          vibe_comments(id, content, created_at, user:profiles!vibe_comments_user_id_fkey(id, username, display_name, avatar))
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const vibes: Vibe[] = vibesData?.map((v: any) => ({
        id: v.id,
        userId: v.user_id,
        user: {
          id: v.user.id,
          username: v.user.username,
          displayName: v.user.display_name,
          avatar: v.user.avatar,
          email: '',
          bio: '',
          age: 0,
          location: '',
          interests: [],
          values: [],
          authenticityScore: 0,
          friendsCount: 0,
          circlesCount: 0,
          joinedAt: new Date(),
          isOnline: false,
          badges: [],
        },
        videoUrl: v.video_url,
        description: v.description,
        mood: v.mood,
        tags: v.tags,
        likes: v.likes,
        comments: v.vibe_comments?.map((c: any) => ({
          id: c.id,
          userId: c.user.id,
          user: {
            id: c.user.id,
            username: c.user.username,
            displayName: c.user.display_name,
            avatar: c.user.avatar,
            email: '',
            bio: '',
            age: 0,
            location: '',
            interests: [],
            values: [],
            authenticityScore: 0,
            friendsCount: 0,
            circlesCount: 0,
            joinedAt: new Date(),
            isOnline: false,
            badges: [],
          },
          content: c.content,
          createdAt: new Date(c.created_at),
        })) || [],
        createdAt: new Date(v.created_at),
        isPrivate: v.is_private,
      })) || [];

      dispatch({ type: 'SET_VIBES', payload: vibes });
    } catch (error) {
      console.error('Error fetching user vibes:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createVibe = async (videoUrl: string, description: string, mood: string, tags: string[], isPrivate: boolean) => {
    if (!user) throw new Error('Must be logged in to create vibe');

    try {
      const { data, error } = await supabase
        .from('vibes')
        .insert({
          user_id: user.id,
          video_url: videoUrl,
          description,
          mood,
          tags,
          is_private: isPrivate,
        })
        .select(`
          *,
          user:profiles!vibes_user_id_fkey(id, username, display_name, avatar)
        `)
        .single();

      if (error) throw error;

      const newVibe: Vibe = {
        id: data.id,
        userId: data.user_id,
        user: {
          id: data.user.id,
          username: data.user.username,
          displayName: data.user.display_name,
          avatar: data.user.avatar,
          email: user.email,
          bio: user.bio,
          age: user.age,
          location: user.location,
          interests: user.interests,
          values: user.values,
          authenticityScore: user.authenticityScore,
          friendsCount: user.friendsCount,
          circlesCount: user.circlesCount,
          joinedAt: user.joinedAt,
          isOnline: user.isOnline,
          badges: user.badges,
        },
        videoUrl: data.video_url,
        description: data.description,
        mood: data.mood,
        tags: data.tags,
        likes: data.likes,
        comments: [],
        createdAt: new Date(data.created_at),
        isPrivate: data.is_private,
      };

      dispatch({ type: 'ADD_VIBE', payload: newVibe });
    } catch (error) {
      console.error('Error creating vibe:', error);
      throw error;
    }
  };

  const deleteVibe = async (vibeId: string) => {
    if (!user) throw new Error('Must be logged in');

    try {
      const { error } = await supabase
        .from('vibes')
        .delete()
        .eq('id', vibeId)
        .eq('user_id', user.id);

      if (error) throw error;

      dispatch({ type: 'SET_VIBES', payload: state.vibes.filter(v => v.id !== vibeId) });
    } catch (error) {
      console.error('Error deleting vibe:', error);
      throw error;
    }
  };

  const likeVibe = async (vibeId: string) => {
    try {
      const vibe = state.vibes.find(v => v.id === vibeId);
      if (!vibe) return;

      const { error } = await supabase
        .from('vibes')
        .update({ likes: vibe.likes + 1 })
        .eq('id', vibeId);

      if (error) throw error;

      dispatch({
        type: 'SET_VIBES',
        payload: state.vibes.map(v => v.id === vibeId ? { ...v, likes: v.likes + 1 } : v),
      });
    } catch (error) {
      console.error('Error liking vibe:', error);
      throw error;
    }
  };

  const value = useMemo<VibeContextValue>(() => ({
    ...state,
    setVibes: (items) => dispatch({ type: 'SET_VIBES', payload: items }),
    addVibe: (vibe) => dispatch({ type: 'ADD_VIBE', payload: vibe }),
    createVibe,
    deleteVibe,
    likeVibe,
    startRecording: (prompt) =>
      dispatch({ type: 'SET_RECORDING', payload: { isRecording: true, prompt, countdown: 3 } }),
    stopRecording: () =>
      dispatch({ type: 'SET_RECORDING', payload: { isRecording: false, prompt: null, countdown: 3 } }),
    selectVibe: (id) => dispatch({ type: 'SELECT_VIBE', payload: id }),
    fetchVibes,
    fetchUserVibes,
  }), [state, user]);

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
};

export const useVibes = (): VibeContextValue => {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibes must be used within a VibeProvider');
  }
  return context;
};
