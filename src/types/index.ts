export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  vibeVideo?: string;
  bio: string;
  age: number;
  location: string;
  interests: string[];
  values: string[];
  authenticityScore: number;
  friendsCount: number;
  circlesCount: number;
  joinedAt: Date;
  isOnline: boolean;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export interface Vibe {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  description: string;
  mood: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
  isPrivate: boolean;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  category: string;
  isPrivate: boolean;
  createdAt: Date;
  adminIds: string[];
  tags: string[];
}

export interface Connection {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  user: User;
  friend: User;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'vibe' | 'media';
  sentAt: Date;
  isRead: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizerId: string;
  attendees: string[];
  circleId?: string;
  isVirtual: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'event' | 'circle_invite';
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  user: User;
  compatibilityScore: number;
  commonInterests: string[];
  reason: string;
}