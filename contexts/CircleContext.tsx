import React, { createContext, useContext, useReducer } from 'react';
import { Circle } from '../types';

interface CircleState {
  joinedCircles: Circle[];
  discoverCircles: Circle[];
  currentCircle: Circle | null;
  loading: boolean;
}

interface CircleAction {
  type: 'SET_JOINED_CIRCLES' | 'SET_DISCOVER_CIRCLES' | 'SET_CURRENT_CIRCLE' | 'SET_LOADING' | 'JOIN_CIRCLE' | 'LEAVE_CIRCLE';
  payload?: any;
}

const initialState: CircleState = {
  joinedCircles: [],
  discoverCircles: [],
  currentCircle: null,
  loading: false,
};

const circleReducer = (state: CircleState, action: CircleAction): CircleState => {
  switch (action.type) {
    case 'SET_JOINED_CIRCLES':
      return { ...state, joinedCircles: action.payload };
    case 'SET_DISCOVER_CIRCLES':
      return { ...state, discoverCircles: action.payload };
    case 'SET_CURRENT_CIRCLE':
      return { ...state, currentCircle: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'JOIN_CIRCLE':
      return { 
        ...state, 
        joinedCircles: [...state.joinedCircles, action.payload],
        discoverCircles: state.discoverCircles.filter(c => c.id !== action.payload.id)
      };
    case 'LEAVE_CIRCLE':
      return { 
        ...state, 
        joinedCircles: state.joinedCircles.filter(c => c.id !== action.payload)
      };
    default:
      return state;
  }
};

interface CircleContextType extends CircleState {
  loadJoinedCircles: () => Promise<void>;
  loadDiscoverCircles: () => Promise<void>;
  joinCircle: (circle: Circle) => Promise<void>;
  leaveCircle: (circleId: string) => Promise<void>;
  setCurrentCircle: (circle: Circle | null) => void;
}

const CircleContext = createContext<CircleContextType | null>(null);

export function CircleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(circleReducer, initialState);

  const loadJoinedCircles = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock joined circles
      const mockJoinedCircles: Circle[] = [
        {
          id: '1',
          name: 'Book Lovers',
          description: 'A community for passionate readers to discuss their favorite books and discover new ones.',
          category: 'Books & Literature',
          imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
          memberCount: 1247,
          isPublic: true,
          tags: ['books', 'reading', 'literature'],
          rules: ['Be respectful', 'No spam', 'Stay on topic'],
          createdAt: new Date(),
          weeklyChallenge: {
            title: 'Share Your Reading Nook',
            description: 'Post a vibe showing your favorite reading spot!',
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          moderators: ['mod1', 'mod2'],
        },
        {
          id: '2',
          name: 'Gaming Squad',
          description: 'Connect with fellow gamers, share gameplay moments, and find new gaming buddies.',
          category: 'Gaming & Esports',
          imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
          memberCount: 892,
          isPublic: true,
          tags: ['gaming', 'esports', 'multiplayer'],
          rules: ['No toxicity', 'Share respectfully', 'Help newcomers'],
          createdAt: new Date(),
          moderators: ['mod3'],
        },
      ];

      dispatch({ type: 'SET_JOINED_CIRCLES', payload: mockJoinedCircles });
    } catch (error) {
      console.error('Error loading joined circles:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadDiscoverCircles = async () => {
    try {
      // Mock discover circles
      const mockDiscoverCircles: Circle[] = [
        {
          id: '3',
          name: 'Indie Music Collective',
          description: 'Discover new indie artists and share your musical finds with like-minded music lovers.',
          category: 'Music & Arts',
          imageUrl: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
          memberCount: 654,
          isPublic: true,
          tags: ['indie', 'music', 'artists'],
          rules: ['Support artists', 'Quality over quantity', 'Discover together'],
          createdAt: new Date(),
          moderators: ['mod4'],
        },
        {
          id: '4',
          name: 'Mental Health Warriors',
          description: 'A safe space for mental health support, resources, and authentic conversations.',
          category: 'Mental Health & Wellness',
          imageUrl: 'https://images.pexels.com/photos/3807733/pexels-photo-3807733.jpeg',
          memberCount: 2156,
          isPublic: true,
          tags: ['mentalhealth', 'wellness', 'support'],
          rules: ['Kindness first', 'No medical advice', 'Respect boundaries'],
          createdAt: new Date(),
          moderators: ['mod5', 'mod6'],
        },
      ];

      dispatch({ type: 'SET_DISCOVER_CIRCLES', payload: mockDiscoverCircles });
    } catch (error) {
      console.error('Error loading discover circles:', error);
    }
  };

  const joinCircle = async (circle: Circle) => {
    try {
      // Simulate API call
      dispatch({ type: 'JOIN_CIRCLE', payload: circle });
    } catch (error) {
      console.error('Error joining circle:', error);
    }
  };

  const leaveCircle = async (circleId: string) => {
    try {
      // Simulate API call
      dispatch({ type: 'LEAVE_CIRCLE', payload: circleId });
    } catch (error) {
      console.error('Error leaving circle:', error);
    }
  };

  const setCurrentCircle = (circle: Circle | null) => {
    dispatch({ type: 'SET_CURRENT_CIRCLE', payload: circle });
  };

  const value: CircleContextType = {
    ...state,
    loadJoinedCircles,
    loadDiscoverCircles,
    joinCircle,
    leaveCircle,
    setCurrentCircle,
  };

  return (
    <CircleContext.Provider value={value}>
      {children}
    </CircleContext.Provider>
  );
}

export function useCircle() {
  const context = useContext(CircleContext);
  if (!context) {
    throw new Error('useCircle must be used within a CircleProvider');
  }
  return context;
}