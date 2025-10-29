import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip, Image, Video as VideoIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Message } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ChatBoxProps {
  connectionId: string;
}

export function ChatBox({ connectionId }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        receiverId: '1',
        content: "Hey! I loved your latest vibe about the coffee shop discovery. That place looks amazing! ☕",
        type: 'text',
        sentAt: new Date('2024-01-15T10:30:00'),
        isRead: true,
      },
      {
        id: '2',
        senderId: '1',
        receiverId: '2',
        content: "Thanks! You should definitely check it out. Their latte art is incredible and the atmosphere is so cozy.",
        type: 'text',
        sentAt: new Date('2024-01-15T10:32:00'),
        isRead: true,
      },
      {
        id: '3',
        senderId: '2',
        receiverId: '1',
        content: "I'm actually planning to go there this weekend. Want to meet up? We could grab coffee and chat about photography!",
        type: 'text',
        sentAt: new Date('2024-01-15T10:35:00'),
        isRead: true,
      },
      {
        id: '4',
        senderId: '1',
        receiverId: '2',
        content: "That sounds perfect! I'd love to. Saturday afternoon works for me. I can bring my camera too 📸",
        type: 'text',
        sentAt: new Date('2024-01-15T10:38:00'),
        isRead: true,
      },
      {
        id: '5',
        senderId: '2',
        receiverId: '1',
        content: "Awesome! How about 2 PM? I'll send you the exact address.",
        type: 'text',
        sentAt: new Date('2024-01-15T10:40:00'),
        isRead: false,
      },
    ];

    setMessages(mockMessages);
  }, [connectionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      receiverId: connectionId,
      content: newMessage,
      type: 'text',
      sentAt: new Date(),
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: connectionId,
        receiverId: user!.id,
        content: "That's great! Thanks for sharing 😊",
        type: 'text',
        sentAt: new Date(),
        isRead: false,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
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
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}

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
            disabled={!newMessage.trim()}
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