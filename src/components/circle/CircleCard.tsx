import React from 'react';
import { motion } from 'framer-motion';
import { Users, Lock } from 'lucide-react';
import { Circle } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CircleCardProps {
  circle: Circle;
  onJoin?: () => void;
  isJoined?: boolean;
}

export function CircleCard({ circle, onJoin, isJoined = false }: CircleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Cover Image */}
      <div className="aspect-video relative">
        <img
          src={circle.coverImage}
          alt={circle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Privacy Indicator */}
        {circle.isPrivate && (
          <div className="absolute top-3 right-3">
            <Badge variant="gray" size="sm" className="bg-black/50 text-white border-0">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </Badge>
          </div>
        )}

        {/* Category */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" size="sm" className="bg-teal-500/90 text-white border-0">
            {circle.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {circle.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {circle.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Users className="w-4 h-4 mr-1" />
          <span>{circle.memberCount.toLocaleString()} members</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {circle.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="gray" size="sm">
              {tag}
            </Badge>
          ))}
          {circle.tags.length > 3 && (
            <Badge variant="gray" size="sm">
              +{circle.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={onJoin}
          variant={isJoined ? 'outline' : 'primary'}
          className="w-full"
        >
          {isJoined ? 'Joined' : 'Join Circle'}
        </Button>
      </div>
    </motion.div>
  );
}