import { supabase } from '../lib/supabase';
import { Message } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

class MessagingService {
  private messagesChannel: RealtimeChannel | null = null;

  /**
   * Subscribe to real-time messages between two users
   */
  async subscribeToMessages(
    userId: string,
    friendId: string,
    onMessage: (message: Message) => void
  ) {
    try {
      // Create a unique channel name for this conversation
      const channelName = `messages-${[userId, friendId].sort().join('-')}`;

      this.messagesChannel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${userId},receiver_id=eq.${friendId}`,
          },
          (payload) => {
            const message: Message = {
              id: payload.new.id,
              senderId: payload.new.sender_id,
              receiverId: payload.new.receiver_id,
              content: payload.new.content,
              type: payload.new.type || 'text',
              isRead: payload.new.is_read || false,
              sentAt: new Date(payload.new.sent_at),
              readAt: payload.new.read_at ? new Date(payload.new.read_at) : undefined,
            };
            onMessage(message);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${friendId},receiver_id=eq.${userId}`,
          },
          (payload) => {
            const message: Message = {
              id: payload.new.id,
              senderId: payload.new.sender_id,
              receiverId: payload.new.receiver_id,
              content: payload.new.content,
              type: payload.new.type || 'text',
              isRead: payload.new.is_read || false,
              sentAt: new Date(payload.new.sent_at),
              readAt: payload.new.read_at ? new Date(payload.new.read_at) : undefined,
            };
            onMessage(message);
          }
        )
        .subscribe();

      return channelName;
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      throw error;
    }
  }

  /**
   * Fetch message history between two users
   */
  async fetchMessages(userId: string, friendId: string, limit = 50): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`
        )
        .order('sent_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((msg) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        type: msg.type || 'text',
        isRead: msg.is_read || false,
        sentAt: new Date(msg.sent_at),
        readAt: msg.read_at ? new Date(msg.read_at) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    type: 'text' | 'vibe' | 'media' = 'text'
  ): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          type,
          is_read: false,
          sent_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        content: data.content,
        type: data.type || 'text',
        isRead: data.is_read || false,
        sentAt: new Date(data.sent_at),
        readAt: data.read_at ? new Date(data.read_at) : undefined,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from real-time messages
   */
  unsubscribe() {
    if (this.messagesChannel) {
      supabase.removeChannel(this.messagesChannel);
      this.messagesChannel = null;
    }
  }
}

export const messagingService = new MessagingService();
