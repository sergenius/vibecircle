import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Users,
  Video,
  MessageCircle,
  Calendar,
  User,
  Search,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const mainNavItems: SidebarItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Discover', path: '/discover', icon: Compass },
  { name: 'Circles', path: '/circles', icon: Users },
  { name: 'Create Vibe', path: '/create-vibe', icon: Video },
  { name: 'Connections', path: '/connections', icon: MessageCircle, badge: 2 },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Profile', path: '/profile', icon: User },
];

const secondaryNavItems: SidebarItem[] = [
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Safety Center', path: '/safety', icon: Shield },
  { name: 'Help & Support', path: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();

  const NavItem = ({ item }: { item: SidebarItem }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Link to={item.path}>
        <motion.div
          whileHover={{ x: 4 }}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{item.name}</span>
          {item.badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {item.badge}
            </motion.span>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6 space-y-8">
        {/* Main Navigation */}
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Main
          </h3>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Secondary Navigation */}
        <nav className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            More
          </h3>
          {secondaryNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Your Stats
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Friends</span>
              <span className="font-medium text-teal-600 dark:text-teal-400">47</span>
            </div>
            <div className="flex justify-between">
              <span>Circles</span>
              <span className="font-medium text-teal-600 dark:text-teal-400">8</span>
            </div>
            <div className="flex justify-between">
              <span>Authenticity</span>
              <span className="font-medium text-green-600 dark:text-green-400">92%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}