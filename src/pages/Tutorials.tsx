
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  BarChart3,
  Search,
  Filter,
  Star,
  Eye,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  views: number;
  rating: number;
  videoUrl: string;
  thumbnail: string;
  lessons: number;
}

export function Tutorials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isWatchingModalOpen, setIsWatchingModalOpen] = useState(false);

  const categories = ['All', 'Getting Started', 'Vibes', 'Circles', 'Connections', 'Safety', 'Advanced'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Getting Started: Create Your First Vibe',
      description: 'Learn how to record, edit, and share your first authentic vibe video in just 5 minutes.',
      category: 'Getting Started',
      difficulty: 'beginner',
      duration: 5,
      views: 12840,
      rating: 4.8,
      videoUrl: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      lessons: 1,
    },
    {
      id: '2',
      title: 'Mastering the Perfect Vibe Recording',
      description: 'Pro tips for lighting, audio, and framing to make your vibes stand out from the crowd.',
      category: 'Vibes',
      difficulty: 'intermediate',
      duration: 12,
      views: 8920,
      rating: 4.9,
      videoUrl: 'https://example.com/video2.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=500&h=300&fit=crop',
      lessons: 3,
    },
    {
      id: '3',
      title: 'Finding and Joining Circles',
      description: 'Discover interest-based communities and make meaningful connections with like-minded people.',
      category: 'Circles',
      difficulty: 'beginner',
      duration: 4,
      views: 5430,
      rating: 4.7,
      videoUrl: 'https://example.com/video3.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      lessons: 1,
    },
    {
      id: '4',
      title: 'AI Matching: How VibeCircle Finds Your Friends',
      description: 'Understand how our AI algorithm works to match you with compatible friends.',
      category: 'Advanced',
      difficulty: 'intermediate',
      duration: 8,
      views: 3210,
      rating: 4.6,
      videoUrl: 'https://example.com/video4.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
      lessons: 2,
    },
    {
      id: '5',
      title: 'Staying Safe on VibeCircle',
      description: 'Essential safety tips for online interactions and meeting people in person.',
      category: 'Safety',
      difficulty: 'beginner',
      duration: 6,
      views: 9870,
      rating: 5.0,
      videoUrl: 'https://example.com/video5.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1516321497487-e288fb3ce3be?w=500&h=300&fit=crop',
      lessons: 2,
    },
    {
      id: '6',
      title: 'Advanced Profile Optimization',
      description: 'Maximize your authenticity score and attract more genuine connections.',
      category: 'Advanced',
      difficulty: 'advanced',
      duration: 15,
      views: 2190,
      rating: 4.9,
      videoUrl: 'https://example.com/video6.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab655c486?w=500&h=300&fit=crop',
      lessons: 4,
    },
  ];

  const filteredTutorials = tutorials.filter(t => {
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || t.difficulty === selectedDifficulty.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <BookOpen className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Video Tutorials
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn how to make the most of VibeCircle with our comprehensive tutorials
        </p>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? 'all' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (selectedCategory === 'all' && category === 'All') ||
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff === 'All' ? 'all' : diff)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (selectedDifficulty === 'all' && diff === 'All') ||
                selectedDifficulty === diff
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden bg-gray-100 aspect-video">
              <img
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => {
                    setSelectedTutorial(tutorial);
                    setIsWatchingModalOpen(true);
                  }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
                </button>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  <Clock className="w-3 h-3 mr-1" />
                  {tutorial.duration}m
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getDifficultyColor(tutorial.difficulty)}>
                  {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
                </Badge>
                <Badge variant="gray" size="sm">{tutorial.category}</Badge>
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                {tutorial.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {tutorial.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {(tutorial.views / 1000).toFixed(1)}K
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {tutorial.rating}
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  {tutorial.lessons} lessons
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedTutorial(tutorial);
                  setIsWatchingModalOpen(true);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Tutorial
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredTutorials.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No tutorials found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to find more tutorials.
          </p>
        </div>
      )}

      {/* Watch Tutorial Modal */}
      <Modal
        isOpen={isWatchingModalOpen}
        onClose={() => setIsWatchingModalOpen(false)}
        title={selectedTutorial?.title || ''}
        maxWidth="2xl"
      >
        {selectedTutorial && (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <Play className="w-16 h-16 text-white/50" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {selectedTutorial.duration} minutes
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                  {selectedTutorial.rating} rating
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {selectedTutorial.views.toLocaleString()} views
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              {selectedTutorial.description}
            </p>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Continue Watching
              </Button>
              <Button variant="outline">Share</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
