import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VibeCard } from '../components/vibe/VibeCard';
import { CircleCard } from '../components/circle/CircleCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { mockVibes, mockCircles } from '../data/mockData';
import { Vibe, Circle } from '../types';
import { Sparkles, TrendingUp, Users, Calendar } from 'lucide-react';

export function Home() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [recommendedCircles, setRecommendedCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVibes(mockVibes);
      setRecommendedCircles(mockCircles.slice(0, 3));
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Sparkles className="w-6 h-6 mr-2" />
              Welcome back to VibeCircle!
            </h1>
            <p className="opacity-90">
              Discover new friends, share your authentic self, and join amazing communities.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right space-y-1">
              <div className="text-sm opacity-90">Your Authenticity Score</div>
              <div className="text-3xl font-bold">92%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Matches', value: '3', icon: Sparkles, color: 'text-teal-600' },
          { label: 'Trending', value: '12', icon: TrendingUp, color: 'text-orange-600' },
          { label: 'Active Circles', value: '8', icon: Users, color: 'text-green-600' },
          { label: 'Upcoming Events', value: '2', icon: Calendar, color: 'text-purple-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommended Circles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recommended Circles
          </h2>
          <button className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCircles.map((circle, index) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CircleCard circle={circle} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Vibes */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Friend Vibes
          </h2>
          <button className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            See All
          </button>
        </div>
        <div className="space-y-6">
          {vibes.map((vibe, index) => (
            <motion.div
              key={vibe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <VibeCard vibe={vibe} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}