import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Video,
  MessageCircle,
  User,
} from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Discover', path: '/discover', icon: Compass },
  { name: 'Create', path: '/create-vibe', icon: Video },
  { name: 'Chat', path: '/connections', icon: MessageCircle },
  { name: 'Profile', path: '/profile', icon: User },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center space-y-1 py-2 px-3 min-w-0 flex-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-teal-100 dark:bg-teal-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  isActive
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}