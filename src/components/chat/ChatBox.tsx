import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip, Image, Video as VideoIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Message } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { messagingService } from '../../services/messaging';

interface ChatBoxProps {
  connectionId: string;
  friendId?: string;
}

export function ChatBox({ connectionId, friendId }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages and subscribe to real-time updates
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      if (!user || !friendId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch message history
        const messageHistory = await messagingService.fetchMessages(user.id, friendId, 50);
        setMessages(messageHistory);

        // Subscribe to real-time messages
        await messagingService.subscribeToMessages(user.id, friendId, (newMsg) => {
          setMessages((prev) => [...prev, newMsg]);
          
          // Auto-mark as read if not from current user
          if (newMsg.receiverId === user.id && !newMsg.isRead) {
            messagingService.markAsRead(newMsg.id).catch(console.error);
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
        setIsLoading(false);
      }
    };

    fetchAndSubscribe();

    return () => {
      messagingService.unsubscribe();
    };
  }, [user, friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !friendId) return;

    try {
      const sentMessage = await messagingService.sendMessage(
        user.id,
        friendId,
        newMessage,
        'text'
      );

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === user?.id;
            const showDate = index === 0 || 
              formatDate(message.sentAt) !== formatDate(messages[index - 1].sentAt);

            return (
              <div key={message.id}>
                {/* Date Separator */}
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.sentAt)}
                    </span>
                  </div>
                )}

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isCurrentUser && (
                      <Avatar size="sm" className="mr-2 mt-1" />
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-teal-500 text-white rounded-br-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser 
                          ? 'text-teal-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(message.sentAt)}
                        {isCurrentUser && message.isRead && ' ✓✓'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <Avatar size="sm" />
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <VideoIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-2 pr-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm max-h-32"
              style={{ minHeight: '40px' }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
            variant="primary"
            size="sm"
            className="rounded-full w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}