import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Vibe } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { VibePlayer } from './VibePlayer';

interface VibeCardProps {
  vibe: Vibe;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function VibeCard({ vibe, onLike, onComment, onShare }: VibeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(vibe.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    -Math.round((Date.now() - vibe.createdAt.getTime()) / (1000 * 60 * 60)),
    'hour'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar src={vibe.user.avatar} alt={vibe.user.displayName} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {vibe.user.displayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{vibe.user.username} • {timeAgo}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Video */}
      <div className="aspect-video">
        <VibePlayer src={vibe.videoUrl} className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-gray-900 dark:text-white">{vibe.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" size="sm">
            {vibe.mood}
          </Badge>
          {vibe.tags.map((tag) => (
            <Badge key={tag} variant="gray" size="sm">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onComment}
              className="flex items-center space-x-2 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{vibe.comments.length}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}