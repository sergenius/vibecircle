import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleCard } from '../components/circle/CircleCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { mockCircles } from '../data/mockData';
import { Circle } from '../types';
import { Search, Plus, Filter, TrendingUp, Sliders } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  'All',
  'Food & Drink',
  'Technology',
  'Arts & Creativity',
  'Wellness',
  'Sports & Fitness',
  'Music',
  'Travel',
  'Books',
  'Gaming',
];

interface CreateCircleFormData {
  name: string;
  description: string;
  category: string;
  privacy: 'public' | 'private';
  tags: string[];
}

interface FilterState {
  memberCountMin: number;
  memberCountMax: number;
  activityLevel: 'all' | 'active' | 'moderate' | 'new';
  verifiedOnly: boolean;
  sortBy: 'trending' | 'newest' | 'mostMembers' | 'active';
}

export function Circles() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [filteredCircles, setFilteredCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [joinedCircles, setJoinedCircles] = useState<string[]>(['1', '2']);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  const [createForm, setCreateForm] = useState<CreateCircleFormData>({
    name: '',
    description: '',
    category: 'Technology',
    privacy: 'public',
    tags: [],
  });

  const [filters, setFilters] = useState<FilterState>({
    memberCountMin: 0,
    memberCountMax: 10000,
    activityLevel: 'all',
    verifiedOnly: false,
    sortBy: 'trending',
  });

  useEffect(() => {
    // Simulate API call
    const loadCircles = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCircles(mockCircles);
      setIsLoading(false);
    };

    loadCircles();
  }, []);

  useEffect(() => {
    let filtered = circles;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(circle => circle.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(circle =>
        circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply advanced filters
    filtered = filtered.filter(circle => {
      const memberCount = circle.members?.length || 0;
      if (memberCount < filters.memberCountMin || memberCount > filters.memberCountMax) {
        return false;
      }
      if (filters.verifiedOnly && !circle.verified) {
        return false;
      }
      return true;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case 'mostMembers':
        filtered = [...filtered].sort((a, b) => 
          (b.members?.length || 0) - (a.members?.length || 0)
        );
        break;
      default:
        break;
    }

    setFilteredCircles(filtered);
  }, [circles, selectedCategory, searchQuery, filters]);

  const handleJoinCircle = (circleId: string) => {
    setJoinedCircles(prev => 
      prev.includes(circleId)
        ? prev.filter(id => id !== circleId)
        : [...prev, circleId]
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !createForm.tags.includes(tagInput.trim())) {
      setCreateForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCreateForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleCreateCircle = async () => {
    if (!createForm.name.trim() || !createForm.description.trim()) {
      addNotification({
        userId: user!.id,
        type: 'like',
        message: 'Please fill in all required fields',
        isRead: false,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCircle: Circle = {
        id: (Math.random() * 1000).toString(),
        name: createForm.name,
        description: createForm.description,
        category: createForm.category,
        members: [{ id: user!.id, username: user!.username }],
        memberCount: 1,
        tags: createForm.tags,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        verified: false,
        createdAt: new Date(),
      };

      setCircles(prev => [newCircle, ...prev]);
      setJoinedCircles(prev => [...prev, newCircle.id]);
      
      addNotification({
        userId: user!.id,
        type: 'like',
        message: `Circle "${createForm.name}" created successfully!`,
        isRead: false,
      });

      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        description: '',
        category: 'Technology',
        privacy: 'public',
        tags: [],
      });
    } catch (error) {
      addNotification({
        userId: user!.id,
        type: 'like',
        message: 'Failed to create circle. Please try again.',
        isRead: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discover Circles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join communities that match your interests and values
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Circle
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
                placeholder="Search circles, topics, or interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)}>
            <Sliders className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Your Circles', value: joinedCircles.length.toString() },
          { label: 'Available', value: circles.length.toString() },
          { label: 'Trending', value: '12' },
          { label: 'New This Week', value: '5' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trending Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Trending Now</h3>
        </div>
        <p className="mb-4 opacity-90">
          Photography Adventures is gaining momentum with 200+ new members this week!
        </p>
        <div className="flex flex-wrap gap-2">
          {['#photography', '#adventure', '#creativity'].map((tag) => (
            <Badge key={tag} variant="gray" size="sm" className="bg-white/20 text-white border-0">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCircles.map((circle, index) => (
          <motion.div
            key={circle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CircleCard
              circle={circle}
              isJoined={joinedCircles.includes(circle.id)}
              onJoin={() => handleJoinCircle(circle.id)}
            />
          </motion.div>
        ))}
      </div>

      {filteredCircles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No circles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters to find more circles.
          </p>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Circle
          </Button>
        </div>
      )}

      {/* Create Circle Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a New Circle"
        maxWidth="lg"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Circle Name *
            </label>
            <Input
              type="text"
              placeholder="Photography Enthusiasts, Coffee Lovers, etc."
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {createForm.name.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              rows={4}
              placeholder="What is this circle about? Who should join?"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {createForm.description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Privacy
              </label>
              <select
                value={createForm.privacy}
                onChange={(e) => setCreateForm({ ...createForm, privacy: e.target.value as 'public' | 'private' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <Input
                type="text"
                placeholder="Enter a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {createForm.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="primary"
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateCircle}
              isLoading={isSubmitting}
            >
              Create Circle
            </Button>
          </div>
        </form>
      </Modal>

      {/* Advanced Filters Modal */}
      <Modal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        title="Advanced Filters"
        maxWidth="md"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Member Count Range
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Min</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.memberCountMin}
                    onChange={(e) => setFilters({ ...filters, memberCountMin: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Max</label>
                  <input
                    type="number"
                    value={filters.memberCountMax}
                    onChange={(e) => setFilters({ ...filters, memberCountMax: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activity Level
            </label>
            <select
              value={filters.activityLevel}
              onChange={(e) => setFilters({ ...filters, activityLevel: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="all">All Activity Levels</option>
              <option value="active">Active (posts daily)</option>
              <option value="moderate">Moderate (posts weekly)</option>
              <option value="new">New Circles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest First</option>
              <option value="mostMembers">Most Members</option>
              <option value="active">Most Active</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="verified"
              checked={filters.verifiedOnly}
              onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="verified" className="text-sm text-gray-700 dark:text-gray-300">
              Show only verified circles
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsFiltersModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsFiltersModalOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}