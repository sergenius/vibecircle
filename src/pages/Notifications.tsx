import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Calendar,
  Users,
  X,
  Check,
  Settings,
  Filter,
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification } from '../types';

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  friend_request: UserPlus,
  event: Calendar,
  circle_invite: Users,
};

const notificationColors = {
  like: 'text-red-500',
  comment: 'text-blue-500',
  friend_request: 'text-green-500',
  event: 'text-purple-500',
  circle_invite: 'text-orange-500',
};

export function Notifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Mock notifications if none exist
  const mockNotifications: Notification[] = notifications.length === 0 ? [
    {
      id: '1',
      userId: '1',
      type: 'like',
      message: 'Alex Martinez liked your vibe about the coffee shop discovery',
      isRead: false,
      createdAt: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      userId: '1',
      type: 'friend_request',
      message: 'Sarah Chen sent you a friend request',
      isRead: false,
      createdAt: new Date('2024-01-15T09:15:00'),
      actionUrl: '/connections',
    },
    {
      id: '3',
      userId: '1',
      type: 'comment',
      message: 'Mike Johnson commented on your vibe',
      isRead: true,
      createdAt: new Date('2024-01-14T16:45:00'),
    },
    {
      id: '4',
      userId: '1',
      type: 'circle_invite',
      message: 'You were invited to join Photography Adventures circle',
      isRead: false,
      createdAt: new Date('2024-01-14T14:20:00'),
      actionUrl: '/circles',
    },
    {
      id: '5',
      userId: '1',
      type: 'event',
      message: 'Coffee Cupping Workshop starts in 2 hours',
      isRead: true,
      createdAt: new Date('2024-01-14T12:00:00'),
      actionUrl: '/events',
    },
  ] : notifications;

  const filteredNotifications = mockNotifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with your VibeCircle activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockNotifications.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {unreadCount}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Unread</div>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="primary" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All', count: mockNotifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: mockNotifications.length - unreadCount },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <Badge variant="gray" size="sm" className="ml-2">
                  {filterOption.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type];
            const iconColor = notificationColors[notification.type];

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                  notification.isRead
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        notification.isRead 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-900 dark:text-white font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-teal-500 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                {notification.actionUrl && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : `You don't have any ${filter} notifications right now.`
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Notification Types Guide */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(notificationIcons).map(([type, Icon]) => (
            <div key={type} className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-white dark:bg-gray-700 ${notificationColors[type as keyof typeof notificationColors]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white capitalize">
                  {type.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {type === 'like' && 'Someone liked your vibe'}
                  {type === 'comment' && 'New comment on your content'}
                  {type === 'friend_request' && 'Friend connection requests'}
                  {type === 'event' && 'Event reminders and updates'}
                  {type === 'circle_invite' && 'Circle invitations'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}