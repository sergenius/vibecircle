# VibeCircle - Implementation Guide for Critical Features

## Overview
This guide provides step-by-step implementation instructions for the most critical underdeveloped features in VibeCircle.

---

## 1. REAL-TIME MESSAGING SYSTEM (Connections Page)

### Current Status
- UI is complete and looks beautiful
- ChatBox component exists but is not implemented
- No backend message storage or retrieval
- Accept/Decline buttons only update local state

### Implementation Steps

#### Step 1: Create Message Type and Database Schema
```typescript
// src/types/index.ts - Add this
export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  type: 'text' | 'vibe' | 'image';
  sentAt: Date;
  isRead: boolean;
  readAt?: Date;
}
```

#### Step 2: Implement ChatBox Component
```typescript
// src/components/chat/ChatBox.tsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types';
import { Send, Smile, Paperclip } from 'lucide-react';

interface ChatBoxProps {
  connectionId: string;
}

export function ChatBox({ connectionId }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('connection_id', connectionId)
          .order('sent_at', { ascending: true });

        if (error) throw error;
        setMessages(data as Message[]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [connectionId]);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `connection_id=eq.${connectionId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [connectionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          connection_id: connectionId,
          sender_id: user.id,
          content: newMessage,
          type: 'text',
          sent_at: new Date(),
          is_read: false,
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderId === user?.id
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.sentAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button type="button" className="p-2 hover:bg-gray-100 rounded">
            <Paperclip className="w-5 h-5 text-gray-400" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button type="button" className="p-2 hover:bg-gray-100 rounded">
            <Smile className="w-5 h-5 text-gray-400" />
          </button>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
```

#### Step 3: Update Connections Page to Accept Connections
```typescript
// In src/pages/Connections.tsx - Update the acceptConnection function
const acceptConnection = async (connectionId: string) => {
  try {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);

    if (error) throw error;
    
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'accepted' as const }
          : conn
      )
    );
  } catch (error) {
    console.error('Error accepting connection:', error);
  }
};
```

**Estimated Time:** 4-6 hours

---

## 2. VIDEO VIBE UPLOAD (Create Vibe Page)

### Current Status
- Video recording works
- No upload to cloud storage
- Form submission doesn't save to database
- No progress indication

### Implementation Steps

#### Step 1: Extend CreateVibe Form Submission
```typescript
// src/pages/CreateVibe.tsx - Update onSubmit function

const onSubmit = async (data: VibeFormData) => {
  if (!recordedVideo || !user) return;

  try {
    setIsSubmitting(true);

    // Step 1: Upload video to Supabase Storage
    const videoFile = await fetch(recordedVideo).then(r => r.blob());
    const fileName = `vibes/${user.id}/${Date.now()}.webm`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('vibe-videos')
      .upload(fileName, videoFile);

    if (uploadError) throw uploadError;

    // Step 2: Get public URL
    const { data: publicURL } = supabase
      .storage
      .from('vibe-videos')
      .getPublicUrl(uploadData.path);

    // Step 3: Generate thumbnail (optional but recommended)
    const thumbnailUrl = await generateThumbnail(recordedVideo);

    // Step 4: Save vibe metadata to database
    const { error: dbError } = await supabase
      .from('vibes')
      .insert({
        user_id: user.id,
        video_url: publicURL.publicUrl,
        thumbnail_url: thumbnailUrl,
        description: data.description,
        mood: data.mood,
        tags: data.tags,
        is_private: data.isPrivate,
        shared_to_circles: data.shareToCircles,
        created_at: new Date(),
      });

    if (dbError) throw dbError;

    addNotification({
      userId: user.id,
      type: 'like',
      message: 'Your vibe has been shared successfully!',
      isRead: false,
    });

    navigate('/');
  } catch (error) {
    console.error('Error creating vibe:', error);
    addNotification({
      userId: user!.id,
      type: 'like',
      message: 'Failed to upload vibe. Please try again.',
      isRead: false,
    });
  } finally {
    setIsSubmitting(false);
  }
};

// Helper function to generate thumbnail
async function generateThumbnail(videoUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    
    video.src = videoUrl;
    video.currentTime = 5; // Get frame at 5 seconds
  });
}
```

**Estimated Time:** 3-4 hours

---

## 3. CIRCLE CREATION & MANAGEMENT

### Current Status
- Display works well
- Creation modal not implemented
- Join/Leave only updates local state
- No circle detail page

### Implementation Steps

#### Step 1: Create Circle Types
```typescript
// src/types/index.ts - Update Circle interface
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
  rules?: string;
  joinedAt?: Date; // User-specific
}
```

#### Step 2: Create Circle Creation Modal
```typescript
// src/components/modals/CreateCircleModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const circleSchema = z.object({
  name: z.string().min(3, 'Circle name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  isPrivate: z.boolean(),
  tags: z.array(z.string()),
});

type CircleFormData = z.infer<typeof circleSchema>;

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCircleCreated?: () => void;
}

export function CreateCircleModal({ 
  isOpen, 
  onClose, 
  onCircleCreated 
}: CreateCircleModalProps) {
  const { user } = useAuth();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = 
    useForm<CircleFormData>({
      resolver: zodResolver(circleSchema),
      defaultValues: {
        isPrivate: false,
        tags: [],
      },
    });

  const watchedTags = watch('tags');
  const [tagInput, setTagInput] = useState('');

  const onSubmit = async (data: CircleFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('circles')
        .insert({
          name: data.name,
          description: data.description,
          category: data.category,
          is_private: data.isPrivate,
          tags: data.tags,
          admin_ids: [user.id],
          member_count: 1,
          created_at: new Date(),
        });

      if (error) throw error;

      onCircleCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating circle:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', watchedTags.filter(t => t !== tag));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Circle" maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Circle Name"
          placeholder="e.g., Coffee Enthusiasts"
          {...register('name')}
          error={errors.name?.message}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={3}
            placeholder="Describe what this circle is about..."
            {...register('description')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select a category</option>
            <option value="food">Food & Drink</option>
            <option value="tech">Technology</option>
            <option value="arts">Arts & Creativity</option>
            <option value="wellness">Wellness</option>
            <option value="sports">Sports & Fitness</option>
            <option value="music">Music</option>
            <option value="travel">Travel</option>
            <option value="books">Books</option>
            <option value="gaming">Gaming</option>
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="private"
            {...register('isPrivate')}
            className="rounded"
          />
          <label htmlFor="private" className="text-sm">
            Make this circle private (members require approval)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add a tag and press Enter"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button type="button" onClick={addTag} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedTags.map((tag) => (
              <span
                key={tag}
                className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Create Circle
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

#### Step 3: Implement Join/Leave Circle
```typescript
// src/services/api.ts - Add these functions

export async function joinCircle(userId: string, circleId: string) {
  return supabase
    .from('circle_members')
    .insert({
      user_id: userId,
      circle_id: circleId,
      joined_at: new Date(),
    });
}

export async function leaveCircle(userId: string, circleId: string) {
  return supabase
    .from('circle_members')
    .delete()
    .eq('user_id', userId)
    .eq('circle_id', circleId);
}

export async function fetchCircleMembers(circleId: string) {
  return supabase
    .from('circle_members')
    .select('*, user_id')
    .eq('circle_id', circleId);
}
```

**Estimated Time:** 6-8 hours

---

## 4. PROFILE PHOTO UPLOAD & EDITING

### Current Status
- Edit modal exists but no submission
- No file upload
- Changes not persisted

### Implementation Steps

```typescript
// src/pages/Profile.tsx - Update edit handler

const handleSaveProfile = async () => {
  try {
    let avatarUrl = user?.avatar;

    // Handle avatar upload if changed
    if (editForm.avatar instanceof File) {
      const fileName = `avatars/${user?.id}/${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, editForm.avatar);

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(data.path);

      avatarUrl = publicData.publicUrl;
    }

    // Update profile in database
    const { error } = await supabase
      .from('users')
      .update({
        display_name: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location,
        interests: editForm.interests,
        avatar: avatarUrl,
      })
      .eq('id', user?.id);

    if (error) throw error;

    updateUser({
      ...editForm,
      avatar: avatarUrl,
    });

    setIsEditModalOpen(false);
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};
```

**Estimated Time:** 2-3 hours

---

## 5. NOTIFICATION SYSTEM

### Current Status
- Display works with mock data
- No real backend notifications
- Mark as read not functional

### Implementation Steps

```typescript
// src/contexts/NotificationContext.tsx - Update implementation

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();
  }, [user?.id]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // ... return context
}
```

**Estimated Time:** 3-4 hours

---

## 📚 Database Schema Requirements

```sql
-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES connections(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  sent_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vibes table
CREATE TABLE vibes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  mood TEXT,
  tags TEXT[],
  is_private BOOLEAN DEFAULT FALSE,
  shared_to_circles UUID[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Circles table
CREATE TABLE circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cover_image TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  admin_ids UUID[] NOT NULL,
  member_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Circle members table
CREATE TABLE circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  role TEXT DEFAULT 'member', -- 'member' or 'moderator'
  UNIQUE(circle_id, user_id)
);
```

---

## ✅ Quick Reference Checklist

- [ ] Implement ChatBox real-time messaging
- [ ] Set up video upload to Supabase Storage
- [ ] Create circle creation modal and API
- [ ] Implement profile editing with file upload
- [ ] Connect notifications to real backend
- [ ] Add connection acceptance/decline functionality
- [ ] Implement event creation form
- [ ] Add blocking and reporting system
- [ ] Set up search backend
- [ ] Implement settings persistence
