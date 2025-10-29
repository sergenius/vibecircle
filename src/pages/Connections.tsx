import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Video,
  Phone,
  UserPlus,
  Search,
  Calendar,
  Star,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ChatBox } from '../components/chat/ChatBox';
import { mockUsers } from '../data/mockData';
import { User, Connection, Message } from '../types';

export function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'requests'>('friends');

  // Mock connections data
  useEffect(() => {
    const loadConnections = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConnections: Connection[] = [
        {
          id: '1',
          userId: '1',
          friendId: '2',
          status: 'accepted',
          createdAt: new Date('2024-01-10'),
          user: mockUsers[0],
          friend: mockUsers[0],
        },
        {
          id: '2',
          userId: '1',
          friendId: '3',
          status: 'pending',
          createdAt: new Date('2024-01-14'),
          user: mockUsers[1],
          friend: mockUsers[1],
        },
        {
          id: '3',
          userId: '4',
          friendId: '1',
          status: 'pending',
          createdAt: new Date('2024-01-15'),
          user: mockUsers[2],
          friend: mockUsers[2],
        },
      ];
      
      setConnections(mockConnections);
      setIsLoading(false);
    };

    loadConnections();
  }, []);

  const acceptConnection = (connectionId: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'accepted' as const }
          : conn
      )
    );
  };

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.friend.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'friends':
        return conn.status === 'accepted' && matchesSearch;
      case 'pending':
        return conn.status === 'pending' && conn.userId === '1' && matchesSearch;
      case 'requests':
        return conn.status === 'pending' && conn.friendId === '1' && matchesSearch;
      default:
        return false;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Connections Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Connections
          </h1>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { key: 'friends', label: 'Friends', count: connections.filter(c => c.status === 'accepted').length },
              { key: 'pending', label: 'Sent', count: connections.filter(c => c.status === 'pending' && c.userId === '1').length },
              { key: 'requests', label: 'Requests', count: connections.filter(c => c.status === 'pending' && c.friendId === '1').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label} {tab.count > 0 && (
                  <Badge variant="primary" size="sm" className="ml-1">{tab.count}</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Connections List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConnections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No connections yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start by discovering and connecting with people who share your interests.
              </p>
              <Link to="/discover">
                <Button variant="primary" size="sm">
                  Discover People
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConnections.map((connection) => (
                <motion.div
                  key={connection.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConnection?.id === connection.id
                      ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedConnection(connection)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar src={connection.friend.avatar} alt={connection.friend.displayName} />
                      {connection.friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {connection.friend.displayName}
                        </h3>
                        {connection.status === 'pending' && connection.friendId === '1' && (
                          <Badge variant="warning" size="sm">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{connection.friend.username}
                      </p>
                      {connection.status === 'accepted' && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          Online now
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action buttons for requests */}
                  {connection.status === 'pending' && connection.friendId === '1' && (
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="primary"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptConnection(connection.id);
                        }}
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Decline
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConnection ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar src={selectedConnection.friend.avatar} alt={selectedConnection.friend.displayName} />
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {selectedConnection.friend.displayName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedConnection.friend.isOnline ? 'Online now' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1">
              <ChatBox connectionId={selectedConnection.id} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a friend from your connections to start chatting.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}