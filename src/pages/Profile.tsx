import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard as Edit3, MapPin, Calendar, Users, Heart, Award, Settings, Share2, Star, Video, Camera } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VibeCard } from '../components/vibe/VibeCard';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { mockVibes } from '../data/mockData';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'vibes' | 'about' | 'badges'>('vibes');
  const [editForm, setEditForm] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    interests: user?.interests || [],
  });

  const userVibes = mockVibes.filter(vibe => vibe.userId === user?.id);

  const handleSaveProfile = () => {
    updateUser(editForm);
    setIsEditModalOpen(false);
  };

  const stats = [
    { label: 'Vibes', value: userVibes.length, icon: Video },
    { label: 'Friends', value: user?.friendsCount || 0, icon: Users },
    { label: 'Circles', value: user?.circlesCount || 0, icon: Heart },
    { label: 'Score', value: `${user?.authenticityScore || 0}%`, icon: Star },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-orange-500 relative">
          <button className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/30 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Avatar
                  src={user?.avatar}
                  alt={user?.displayName}
                  size="xl"
                  className="border-4 border-white dark:border-gray-800 shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-teal-500 rounded-full text-white hover:bg-teal-600 transition-colors shadow-lg">
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.displayName}
                  </h1>
                  {user?.badges && user.badges.length > 0 && (
                    <Badge variant="primary" size="sm">
                      {user.badges[0].icon}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  @{user?.username}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {user?.bio}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user?.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {user?.joinedAt?.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {user?.authenticityScore}% Authentic
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsEditModalOpen(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Icon className="w-4 h-4 text-teal-500 mr-1" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Interests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Interests & Values
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.interests?.map((interest) => (
                <Badge key={interest} variant="primary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Values
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.values?.map((value) => (
                <Badge key={value} variant="secondary">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { key: 'vibes', label: 'My Vibes', count: userVibes.length },
            { key: 'about', label: 'About' },
            { key: 'badges', label: 'Badges', count: user?.badges?.length || 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <Badge variant="gray" size="sm" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {activeTab === 'vibes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {userVibes.length > 0 ? (
              userVibes.map((vibe, index) => (
                <motion.div
                  key={vibe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VibeCard vibe={vibe} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No vibes yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Share your first vibe to let people get to know you!
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/create-vibe'}>
                  Create First Vibe
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  About Me
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user?.bio || 'No bio added yet.'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Basic Info
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Age: {user?.age} years old</div>
                    <div>Location: {user?.location}</div>
                    <div>Member since: {user?.joinedAt?.getFullYear()}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Activity
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>Authenticity Score: {user?.authenticityScore}%</div>
                    <div>Friends: {user?.friendsCount}</div>
                    <div>Circles: {user?.circlesCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Achievements & Badges
            </h3>
            
            {user?.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{ backgroundColor: badge.color + '20', color: badge.color }}
                      >
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {badge.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Earned {badge.earnedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No badges yet
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Start engaging with the community to earn your first badge!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <Input
            label="Display Name"
            value={editForm.displayName}
            onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Tell people about yourself..."
            />
          </div>
          
          <Input
            label="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            placeholder="City, Country"
          />

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}