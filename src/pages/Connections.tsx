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
  AlertTriangle,
  Copy,
  Ban,
} from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ChatBox } from '../components/chat/ChatBox';
import { Modal } from '../components/ui/Modal';
import { mockUsers } from '../data/mockData';
import { User, Connection, Message } from '../types';
import { useNotifications } from '../contexts/NotificationContext';

interface ScheduleData {
  date: string;
  time: string;
  title: string;
}

interface ActiveCall {
  connectionId: string;
  type: 'phone' | 'video';
  isInitiated: boolean;
}

export function Connections() {
  const { addNotification } = useNotifications();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'requests'>('friends');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [scheduleForm, setScheduleForm] = useState<ScheduleData>({
    date: '',
    time: '',
    title: 'Hangout',
  });

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

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const acceptConnection = (connectionId: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'accepted' as const }
          : conn
      )
    );
    addNotification({
      userId: '1',
      type: 'friend_request',
      message: 'Connection request accepted!',
      isRead: false,
    });
  };

  const handleInitiateCall = (type: 'phone' | 'video') => {
    if (!selectedConnection) return;
    
    setActiveCall({
      connectionId: selectedConnection.id,
      type,
      isInitiated: true,
    });
    setIsCallModalOpen(true);
    setCallDuration(0);

    addNotification({
      userId: '1',
      type: 'like',
      message: `${type === 'video' ? 'Video' : 'Phone'} call initiated with ${selectedConnection.friend.displayName}...`,
      isRead: false,
    });
  };

  const handleEndCall = () => {
    if (activeCall && callDuration > 0) {
      addNotification({
        userId: '1',
        type: 'like',
        message: `${activeCall.type === 'video' ? 'Video' : 'Phone'} call ended. Duration: ${formatDuration(callDuration)}`,
        isRead: false,
      });
    }
    setActiveCall(null);
    setIsCallModalOpen(false);
    setCallDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const handleScheduleHangout = async () => {
    if (!scheduleForm.date || !scheduleForm.time || !selectedConnection) return;

    const [year, month, day] = scheduleForm.date.split('-');
    const scheduledDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    addNotification({
      userId: '1',
      type: 'like',
      message: `Hangout scheduled with ${selectedConnection.friend.displayName} for ${scheduleForm.date} at ${scheduleForm.time}!`,
      isRead: false,
    });

    setIsScheduleModalOpen(false);
    setScheduleForm({
      date: '',
      time: '',
      title: 'Hangout',
    });
  };

  const handleBlockUser = () => {
    if (!selectedConnection) return;
    
    addNotification({
      userId: '1',
      type: 'like',
      message: `${selectedConnection.friend.displayName} has been blocked.`,
      isRead: false,
    });

    setConnections(prev => prev.filter(c => c.id !== selectedConnection.id));
    setSelectedConnection(null);
    setIsOptionsMenuOpen(false);
  };

  const handleShareProfile = () => {
    if (!selectedConnection) return;
    
    const profileLink = `${window.location.origin}/vibecircle/profile/${selectedConnection.friend.id}`;
    navigator.clipboard.writeText(profileLink);

    addNotification({
      userId: '1',
      type: 'like',
      message: 'Profile link copied to clipboard!',
      isRead: false,
    });
    setIsOptionsMenuOpen(false);
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleInitiateCall('phone')}
                    title="Phone Call"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleInitiateCall('video')}
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsScheduleModalOpen(true)}
                    title="Schedule Hangout"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                      title="More Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>

                    {/* Options Menu */}
                    {isOptionsMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleShareProfile();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Share Profile</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsOptionsMenuOpen(false);
                              // View profile logic
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            View Full Profile
                          </button>
                          <hr className="my-1 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={() => {
                              handleBlockUser();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                          >
                            <Ban className="w-4 h-4" />
                            <span>Block User</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
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

      {/* Call Modal */}
      <Modal
        isOpen={isCallModalOpen && activeCall !== null}
        onClose={handleEndCall}
        title={`${activeCall?.type === 'video' ? 'Video' : 'Phone'} Call`}
        maxWidth="md"
      >
        <div className="space-y-6">
          {/* Call Status */}
          <div className="text-center space-y-4">
            <Avatar
              src={selectedConnection?.friend.avatar}
              alt={selectedConnection?.friend.displayName}
              size="xl"
              className="mx-auto"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedConnection?.friend.displayName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activeCall?.isInitiated ? 'Calling...' : 'Connected'}
              </p>
            </div>

            {/* Call Duration */}
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {formatDuration(callDuration)}
            </div>
          </div>

          {/* Call Visualization */}
          <div className="bg-gradient-to-br from-teal-500 to-orange-500 rounded-lg p-8 text-white text-center">
            {activeCall?.type === 'video' ? (
              <div className="space-y-4">
                <div className="text-4xl">📹</div>
                <p>Video call in progress...</p>
                <p className="text-sm opacity-90">Your camera and microphone are active</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-4xl">📱</div>
                <p>Phone call in progress...</p>
                <p className="text-sm opacity-90">Your microphone is active</p>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 flex items-center justify-center"
              title="Mute"
            >
              🔇
            </Button>
            <Button 
              variant="danger"
              size="lg"
              className="rounded-full w-16 h-16 flex items-center justify-center"
              onClick={handleEndCall}
              title="End Call"
            >
              ✕
            </Button>
            {activeCall?.type === 'video' && (
              <Button 
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16 flex items-center justify-center"
                title="End Video"
              >
                📹
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Click the red button to end the call
          </p>
        </div>
      </Modal>

      {/* Schedule Hangout Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Hangout"
        maxWidth="md"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hangout Title
            </label>
            <Input
              type="text"
              placeholder="Coffee meetup"
              value={scheduleForm.title}
              onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <Input
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time *
              </label>
              <Input
                type="time"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleScheduleHangout}>
              Schedule Hangout
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}