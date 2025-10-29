import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from '../components/match/MatchCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { mockMatches } from '../data/mockData';
import { Match } from '../types';
import { Sparkles, Filter, RefreshCw } from 'lucide-react';

export function Discover() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyMatchesUsed, setDailyMatchesUsed] = useState(0);

  useEffect(() => {
    // Simulate API call
    const loadMatches = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMatches(mockMatches);
      setIsLoading(false);
    };

    loadMatches();
  }, []);

  const handleConnect = () => {
    setDailyMatchesUsed(prev => prev + 1);
    nextMatch();
  };

  const handlePass = () => {
    nextMatch();
  };

  const nextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(prev => prev + 1);
    } else {
      // No more matches
      setCurrentMatchIndex(matches.length);
    }
  };

  const refreshMatches = async () => {
    setIsLoading(true);
    // Simulate getting new matches
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentMatchIndex(0);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">
            Finding your perfect friendship matches...
          </p>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentMatchIndex];
  const hasMoreMatches = currentMatchIndex < matches.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
          <Sparkles className="w-6 h-6 mr-2 text-teal-500" />
          Daily Discoveries
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered friendship matching based on your interests and values
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {dailyMatchesUsed} connections made today
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="ghost" size="sm" onClick={refreshMatches}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Match Cards */}
      <div className="relative h-96">
        <AnimatePresence mode="wait">
          {hasMoreMatches ? (
            <MatchCard
              key={currentMatch.id}
              match={currentMatch}
              onConnect={handleConnect}
              onPass={handlePass}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  That's all for today!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You've seen all your daily matches. Come back tomorrow for more discoveries!
                </p>
                <Button onClick={refreshMatches} variant="primary">
                  Get More Matches
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Match Progress */}
      {hasMoreMatches && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Progress</span>
            <span>{currentMatchIndex + 1} of {matches.length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-teal-500 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentMatchIndex + 1) / matches.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">
          💡 Discovery Tips
        </h4>
        <ul className="text-sm text-teal-700 dark:text-teal-400 space-y-1">
          <li>• Take time to read profiles thoroughly</li>
          <li>• Common interests are just the beginning</li>
          <li>• Authenticity scores indicate genuine profiles</li>
          <li>• Connect with people who share your values</li>
        </ul>
      </div>
    </div>
  );
}