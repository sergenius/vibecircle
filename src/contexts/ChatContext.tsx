import React, { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types';
import { useAuth } from './AuthContext';

interface ChatState {
  messages: Message[];
  conversations: Map<string, Message[]>;
  isLoading: boolean;
}

type ChatAction =
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean };

interface ChatContextValue extends ChatState {
  sendMessage: (receiverId: string, content: string, type?: 'text' | 'vibe' | 'media') => Promise<void>;
  fetchMessages: (otherUserId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
}

const initialState: ChatState = {
  messages: [],
  conversations: new Map(),
  isLoading: false,
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export const ChatProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConversations();

      // Subscribe to real-time messages
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            const newMessage: Message = {
              id: payload.new.id,
              senderId: payload.new.sender_id,
              receiverId: payload.new.receiver_id,
              content: payload.new.content,
              type: payload.new.type,
              sentAt: new Date(payload.new.created_at),
              isRead: payload.new.is_read,
            };
            dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesData: Message[] = messages?.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        content: m.content,
        type: m.type,
        sentAt: new Date(m.created_at),
        isRead: m.is_read,
      })) || [];

      dispatch({ type: 'SET_MESSAGES', payload: messagesData });
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesData: Message[] = messages?.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        content: m.content,
        type: m.type,
        sentAt: new Date(m.created_at),
        isRead: m.is_read,
      })) || [];

      dispatch({ type: 'SET_MESSAGES', payload: messagesData });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const sendMessage = async (receiverId: string, content: string, type: 'text' | 'vibe' | 'media' = 'text') => {
    if (!user) throw new Error('Must be logged in to send messages');

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          type,
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: Message = {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        content: data.content,
        type: data.type,
        sentAt: new Date(data.created_at),
        isRead: data.is_read,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: receiverId,
          type: 'friend_request',
          message: `New message from ${user.displayName}`,
          action_url: `/chat/${user.id}`,
        });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      dispatch({
        type: 'SET_MESSAGES',
        payload: state.messages.map(m => m.id === messageId ? { ...m, isRead: true } : m),
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  const value = useMemo<ChatContextValue>(() => ({
    ...state,
    sendMessage,
    fetchMessages,
    markAsRead,
    fetchConversations,
  }), [state, user]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
