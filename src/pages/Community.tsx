
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Heart,
  Eye,
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  User,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

interface CommunityThread {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  views: number;
  replies: number;
  likes: number;
  lastActivity: Date;
  isPinned: boolean;
  tags: string[];
}

export function Community() {
  const [threads, setThreads] = useState<CommunityThread[]>([
    {
      id: '1',
      title: 'Tips for creating authentic vibes',
      description: 'Share your best practices and techniques for creating engaging and authentic vibe videos...',
      authorId: '1',
      authorName: 'Sarah Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      category: 'Tips & Tricks',
      views: 2840,
      replies: 45,
      likes: 128,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isPinned: true,
      tags: ['vibes', 'creative', 'tutorial'],
    },
    {
      id: '2',
      title: 'How to find your interest-based circles?',
      description: 'I\'m new to VibeCircle and looking for tech enthusiasts. What\'s the best way to discover circles?',
      authorId: '2',
      authorName: 'Mike Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      category: 'Getting Started',
      views: 1245,
      replies: 23,
      likes: 67,
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isPinned: false,
      tags: ['circles', 'help', 'beginner'],
    },
  ]);

  const [filteredThreads, setFilteredThreads] = useState<CommunityThread[]>(threads);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'trending' | 'popular'>('recent');

  const categories = [
    'All Topics',
    'Tips & Tricks',
    'Getting Started',
    'Bug Reports',
    'Feature Requests',
    'Connections',
    'Circles',
  ];

  useEffect(() => {
    let filtered = threads;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'trending') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.views - a.views);
    } else {
      filtered.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    }

    setFilteredThreads(filtered);
  }, [searchQuery, selectedCategory, sortBy, threads]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Community Forum
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect, share knowledge, and discuss with the VibeCircle community
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Start a Discussion
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 text-sm"
            >
              <option value="recent">Recent</option>
              <option value="trending">Trending</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All Topics' ? 'all' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (selectedCategory === 'all' && category === 'All Topics') ||
                selectedCategory === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Threads List */}
      <div className="space-y-3">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No discussions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or start a new discussion!
            </p>
          </div>
        ) : (
          filteredThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Author Avatar */}
                <Avatar src={thread.authorAvatar} alt={thread.authorName} className="flex-shrink-0" />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {thread.isPinned && (
                          <Badge variant="primary" size="sm">📌 Pinned</Badge>
                        )}
                        <Badge variant="secondary" size="sm">{thread.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-teal-500 cursor-pointer">
                        {thread.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                        {thread.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {thread.tags.map((tag) => (
                          <Badge key={tag} variant="gray" size="sm">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3 mr-1" />
                        <span className="font-medium">{thread.authorName}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{getTimeAgo(thread.lastActivity)}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {thread.views}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {thread.replies}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {thread.likes}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Discussion Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Start a Discussion"
        maxWidth="lg"
      >
        <form className="space-y-4">
          <Input
            label="Discussion Title"
            placeholder="What do you want to discuss?"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100">
              {categories.filter(c => c !== 'All Topics').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Share your thoughts..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Discussion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
