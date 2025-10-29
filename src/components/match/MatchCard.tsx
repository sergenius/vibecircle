import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X, Sparkles } from 'lucide-react';
import { Match } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface MatchCardProps {
  match: Match;
  onConnect: () => void;
  onPass: () => void;
}

export function MatchCard({ match, onConnect, onPass }: MatchCardProps) {
  const { user, compatibilityScore, commonInterests, reason } = match;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: 180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -300 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-sm mx-auto"
    >
      {/* Header with Avatar and Score */}
      <div className="relative p-6 bg-gradient-to-br from-teal-500 to-orange-500 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar src={user.avatar} alt={user.displayName} size="lg" />
            <div>
              <h3 className="text-xl font-bold">{user.displayName}</h3>
              <p className="text-sm opacity-90">@{user.username}</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{compatibilityScore}%</div>
            <div className="text-xs opacity-90">Match</div>
          </div>
        </div>
        
        {/* Sparkles for high compatibility */}
        {compatibilityScore >= 90 && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 right-4"
          >
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Bio */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {user.bio}
        </p>

        {/* Common Interests */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Common Interests
          </h4>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => (
              <Badge key={interest} variant="primary" size="sm">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* AI Reason */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-teal-500" />
            Why you might click
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "{reason}"
          </p>
        </div>

        {/* User Stats */}
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>{user.age} years old</span>
          <span>{user.location}</span>
          <span>{user.friendsCount} friends</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex p-4 space-x-3 bg-gray-50 dark:bg-gray-900">
        <Button
          variant="outline"
          size="lg"
          onClick={onPass}
          className="flex-1 border-gray-300 hover:border-red-300 hover:text-red-600"
        >
          <X className="w-5 h-5 mr-2" />
          Pass
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onConnect}
          className="flex-1 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600"
        >
          <Heart className="w-5 h-5 mr-2" />
          Connect
        </Button>
      </div>
    </motion.div>
  );
}