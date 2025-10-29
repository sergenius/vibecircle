
import { supabase } from '../lib/supabase';
import { User, Vibe, Circle, Connection, Message, Event, Notification, Match } from '../types';

// ============= USER ENDPOINTS =============
export const userApi = {
  getCurrentUser: async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  },

  uploadAvatar: async (userId: string, file: File): Promise<string | null> => {
    try {
      const filePath = `avatars/${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  },

  getUsersByInterests: async (interests: string[]): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(interests.map(i => `interests.cs.{"${i}"}`).join(','));
      
      if (error) throw error;
      return (data || []) as User[];
    } catch (error) {
      console.error('Error fetching users by interests:', error);
      return [];
    }
  },
};

// ============= VIBE ENDPOINTS =============
export const vibeApi = {
  createVibe: async (vibeData: Omit<Vibe, 'id' | 'createdAt'>, videoFile: File): Promise<Vibe | null> => {
    try {
      // Upload video first
      const videoUrl = await vibeApi.uploadVibeVideo(vibeData.userId, videoFile);
      if (!videoUrl) throw new Error('Failed to upload video');

      const { data, error } = await supabase
        .from('vibes')
        .insert([{
          ...vibeData,
          videoUrl,
          createdAt: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Vibe;
    } catch (error) {
      console.error('Error creating vibe:', error);
      return null;
    }
  },

  uploadVibeVideo: async (userId: string, file: File): Promise<string | null> => {
    try {
      const filePath = `vibes/${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('vibes')
        .upload(filePath, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage
        .from('vibes')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  },

  getVibeById: async (vibeId: string): Promise<Vibe | null> => {
    try {
      const { data, error } = await supabase
        .from('vibes')
        .select('*')
        .eq('id', vibeId)
        .single();
      
      if (error) throw error;
      return data as Vibe;
    } catch (error) {
      console.error('Error fetching vibe:', error);
      return null;
    }
  },

  getUserVibes: async (userId: string): Promise<Vibe[]> => {
    try {
      const { data, error } = await supabase
        .from('vibes')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Vibe[];
    } catch (error) {
      console.error('Error fetching user vibes:', error);
      return [];
    }
  },

  getFeedVibes: async (userId: string, limit = 10): Promise<Vibe[]> => {
    try {
      const { data, error } = await supabase
        .from('vibes')
        .select('*')
        .neq('userId', userId)
        .eq('isPrivate', false)
        .order('createdAt', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return (data || []) as Vibe[];
    } catch (error) {
      console.error('Error fetching feed vibes:', error);
      return [];
    }
  },

  updateVibe: async (vibeId: string, updates: Partial<Vibe>): Promise<Vibe | null> => {
    try {
      const { data, error } = await supabase
        .from('vibes')
        .update(updates)
        .eq('id', vibeId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Vibe;
    } catch (error) {
      console.error('Error updating vibe:', error);
      return null;
    }
  },

  deleteVibe: async (vibeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('vibes')
        .delete()
        .eq('id', vibeId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting vibe:', error);
      return false;
    }
  },

  likeVibe: async (vibeId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('vibe_likes')
        .insert([{ vibeId, userId }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error liking vibe:', error);
      return false;
    }
  },

  unlikeVibe: async (vibeId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('vibe_likes')
        .delete()
        .eq('vibeId', vibeId)
        .eq('userId', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unliking vibe:', error);
      return false;
    }
  },
};

// ============= CIRCLE ENDPOINTS =============
export const circleApi = {
  createCircle: async (circleData: Omit<Circle, 'id' | 'createdAt'>, coverImage: File | null): Promise<Circle | null> => {
    try {
      let coverImageUrl = circleData.coverImage;
      
      if (coverImage) {
        const filePath = `circles/${Date.now()}_${coverImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from('circle-covers')
          .upload(filePath, coverImage);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('circle-covers')
          .getPublicUrl(filePath);
        
        coverImageUrl = data.publicUrl;
      }

      const { data, error } = await supabase
        .from('circles')
        .insert([{
          ...circleData,
          coverImage: coverImageUrl,
          createdAt: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Circle;
    } catch (error) {
      console.error('Error creating circle:', error);
      return null;
    }
  },

  getCircles: async (filters?: { category?: string; search?: string }): Promise<Circle[]> => {
    try {
      let query = supabase.from('circles').select('*');
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as Circle[];
    } catch (error) {
      console.error('Error fetching circles:', error);
      return [];
    }
  },

  getCircleById: async (circleId: string): Promise<Circle | null> => {
    try {
      const { data, error } = await supabase
        .from('circles')
        .select('*')
        .eq('id', circleId)
        .single();
      
      if (error) throw error;
      return data as Circle;
    } catch (error) {
      console.error('Error fetching circle:', error);
      return null;
    }
  },

  joinCircle: async (circleId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('circle_members')
        .insert([{ circleId, userId }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining circle:', error);
      return false;
    }
  },

  leaveCircle: async (circleId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('circleId', circleId)
        .eq('userId', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error leaving circle:', error);
      return false;
    }
  },

  updateCircle: async (circleId: string, updates: Partial<Circle>): Promise<Circle | null> => {
    try {
      const { data, error } = await supabase
        .from('circles')
        .update(updates)
        .eq('id', circleId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Circle;
    } catch (error) {
      console.error('Error updating circle:', error);
      return null;
    }
  },

  deleteCircle: async (circleId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('circles')
        .delete()
        .eq('id', circleId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting circle:', error);
      return false;
    }
  },
};

// ============= CONNECTION ENDPOINTS =============
export const connectionApi = {
  sendConnectionRequest: async (fromUserId: string, toUserId: string): Promise<Connection | null> => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .insert([{
          userId: fromUserId,
          friendId: toUserId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Connection;
    } catch (error) {
      console.error('Error sending connection request:', error);
      return null;
    }
  },

  acceptConnectionRequest: async (connectionId: string): Promise<Connection | null> => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Connection;
    } catch (error) {
      console.error('Error accepting connection:', error);
      return null;
    }
  },

  declineConnectionRequest: async (connectionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error declining connection:', error);
      return false;
    }
  },

  getUserConnections: async (userId: string, status?: string): Promise<Connection[]> => {
    try {
      let query = supabase
        .from('connections')
        .select('*')
        .or(`userId.eq.${userId},friendId.eq.${userId}`);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data || []) as Connection[];
    } catch (error) {
      console.error('Error fetching connections:', error);
      return [];
    }
  },

  blockUser: async (userId: string, blockedUserId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'blocked' })
        .eq('userId', userId)
        .eq('friendId', blockedUserId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      return false;
    }
  },
};

// ============= EVENT ENDPOINTS =============
export const eventApi = {
  createEvent: async (eventData: Omit<Event, 'id'>): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();
      
      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  getEvents: async (filters?: { upcoming?: boolean; circleId?: string }): Promise<Event[]> => {
    try {
      let query = supabase.from('events').select('*');
      
      if (filters?.upcoming) {
        query = query.gte('date', new Date().toISOString());
      }
      
      if (filters?.circleId) {
        query = query.eq('circleId', filters.circleId);
      }
      
      const { data, error } = await query.order('date', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Event[];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  getEventById: async (eventId: string): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  },

  attendEvent: async (eventId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_attendees')
        .insert([{ eventId, userId }]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error attending event:', error);
      return false;
    }
  },

  unattendEvent: async (eventId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('eventId', eventId)
        .eq('userId', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unattending event:', error);
      return false;
    }
  },

  updateEvent: async (eventId: string, updates: Partial<Event>): Promise<Event | null> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();
      
      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  },

  deleteEvent: async (eventId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  },
};

// ============= MESSAGE ENDPOINTS =============
export const messageApi = {
  sendMessage: async (messageData: Omit<Message, 'id' | 'sentAt'>): Promise<Message | null> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          ...messageData,
          sentAt: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  getConversation: async (userId1: string, userId2: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(senderId.eq.${userId1},receiverId.eq.${userId2}),and(senderId.eq.${userId2},receiverId.eq.${userId1})`
        )
        .order('sentAt', { ascending: true });
      
      if (error) throw error;
      return (data || []) as Message[];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  },

  markMessageAsRead: async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ isRead: true })
        .eq('id', messageId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  },
};

// ============= NOTIFICATION ENDPOINTS =============
export const notificationApi = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  markAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ isRead: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  },
};

// ============= SEARCH ENDPOINTS =============
export const searchApi = {
  search: async (query: string): Promise<{ people: User[]; vibes: Vibe[]; circles: Circle[]; hashtags: string[] }> => {
    try {
      const [peopleResponse, vibesResponse, circlesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .or(`displayName.ilike.%${query}%,username.ilike.%${query}%,interests.cs.{"${query}"}`),
        supabase
          .from('vibes')
          .select('*')
          .or(`description.ilike.%${query}%,tags.cs.{"${query}"}`),
        supabase
          .from('circles')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{"${query}"}`),
      ]);

      return {
        people: (peopleResponse.data || []) as User[],
        vibes: (vibesResponse.data || []) as Vibe[],
        circles: (circlesResponse.data || []) as Circle[],
        hashtags: [], // Hashtags would be extracted from vibes and circles
      };
    } catch (error) {
      console.error('Error searching:', error);
      return { people: [], vibes: [], circles: [], hashtags: [] };
    }
  },
};

// ============= MATCH ENDPOINTS =============
export const matchApi = {
  getMatches: async (userId: string, limit = 10): Promise<Match[]> => {
    try {
      // This would typically call an AI service for compatibility calculation
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('userId', userId)
        .order('compatibilityScore', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return (data || []) as Match[];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },
};

export const api = {
  userApi,
  vibeApi,
  circleApi,
  connectionApi,
  eventApi,
  messageApi,
  notificationApi,
  searchApi,
  matchApi,
};
