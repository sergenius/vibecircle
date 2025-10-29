import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length,
      };
    case 'ADD_NOTIFICATION':
      return {
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
        isLoading: state.isLoading,
      };
    case 'MARK_AS_READ':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      const wasUnread = state.notifications.find(n => n.id === action.payload && !n.isRead);
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      };
    case 'DELETE_NOTIFICATION':
      const notification = state.notifications.find(n => n.id === action.payload);
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: notification && !notification.isRead ? state.unreadCount - 1 : state.unreadCount,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Subscribe to real-time notifications
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification: Notification = {
              id: payload.new.id,
              userId: payload.new.user_id,
              type: payload.new.type,
              message: payload.new.message,
              isRead: payload.new.is_read,
              createdAt: new Date(payload.new.created_at),
              actionUrl: payload.new.action_url,
            };
            dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const notifications: Notification[] = data?.map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        message: n.message,
        isRead: n.is_read,
        createdAt: new Date(n.created_at),
        actionUrl: n.action_url,
      })) || [];

      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'MARK_AS_READ', payload: id });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
