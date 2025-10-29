import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CircleCard } from '../components/circle/CircleCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { mockCircles } from '../data/mockData';
import { Circle } from '../types';
import { Search, Plus, Filter, TrendingUp } from 'lucide-react';

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

export function Circles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [filteredCircles, setFilteredCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [joinedCircles, setJoinedCircles] = useState<string[]>(['1', '2']);

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

    setFilteredCircles(filtered);
  }, [circles, selectedCategory, searchQuery]);

  const handleJoinCircle = (circleId: string) => {
    setJoinedCircles(prev => 
      prev.includes(circleId)
        ? prev.filter(id => id !== circleId)
        : [...prev, circleId]
    );
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
        <Button variant="primary">
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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
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
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create New Circle
          </Button>
        </div>
      )}
    </div>
  );
}