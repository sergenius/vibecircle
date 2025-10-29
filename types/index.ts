export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  ageGroup: '16-18' | '19-21' | '22-25' | '26-32' | '33+';
  pronouns?: string;
  profileVibe?: string; // Video URL
  interests: string[];
  values: string[];
  authenticity: number; // 0-100
  joinDate: Date;
  lastActive: Date;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  preferences: {
    maxDistance: number;
    ageGroups: string[];
    languages: string[];
  };
}

export interface Vibe {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  tags: string[];
  mood: string;
  duration: number; // seconds
  createdAt: Date;
  views: number;
  connections: number;
  circles: string[]; // Circle IDs where this vibe is shared
  isProfileVibe: boolean;
}

export interface Match {
  id: string;
  user: User;
  vibe: Vibe;
  compatibilityScore: number;
  reasons: string[];
  sharedInterests: string[];
  valuesAlignment: number;
  createdAt: Date;
  viewed: boolean;
  status: 'pending' | 'connected' | 'passed';
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  memberCount: number;
  isPublic: boolean;
  tags: string[];
  rules: string[];
  createdAt: Date;
  weeklyChallenge?: {
    title: string;
    description: string;
    endDate: Date;
  };
  moderators: string[]; // User IDs
}

export interface Connection {
  id: string;
  users: [string, string]; // User IDs
  level: 'new' | 'growing' | 'established' | 'close';
  connectedAt: Date;
  lastInteraction: Date;
  interactions: number;
  sharedCircles: string[];
  milestones: Milestone[];
  status: 'active' | 'inactive' | 'blocked';
}

export interface Milestone {
  id: string;
  type: 'first_message' | 'week_streak' | 'month_friend' | 'shared_interest' | 'video_call';
  achievedAt: Date;
  title: string;
  description: string;
  icon: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice' | 'vibe' | 'system';
  attachments?: {
    type: 'vibe' | 'voice';
    url: string;
    duration?: number;
  }[];
  sentAt: Date;
  readAt?: Date;
  reactions: {
    emoji: string;
    userId: string;
  }[];
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  type: 'direct' | 'group' | 'circle';
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: number;
  circleId?: string; // For circle conversations
  name?: string; // For group/circle conversations
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'milestone' | 'circle' | 'system';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  hasCompletedOnboarding: boolean;
}

export interface OnboardingData {
  step: number;
  totalSteps: number;
  basicInfo?: {
    firstName: string;
    username: string;
    pronouns?: string;
  };
  interests?: string[];
  values?: string[];
  profileVibe?: string;
  ageVerified?: boolean;
  privacyAgreed?: boolean;
}