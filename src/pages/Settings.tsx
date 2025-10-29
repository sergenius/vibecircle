import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'preferences' | 'data'>('account');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    friendRequests: true,
    vibeComments: true,
    circleInvites: true,
    eventReminders: true,
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: true,
    showLocation: true,
    dataDownloadRequested: false,
  });
 
  const [accountForm, setAccountForm] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'preferences', label: 'Preferences', icon: Globe },
    { key: 'data', label: 'Data & Privacy', icon: Download },
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
 
  const handleSaveAccountSettings = async () => {
    if (!accountForm.displayName.trim() || !accountForm.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }
 
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // addNotification({
      //   userId: user!.id,
      //   type: 'like',
      //   message: 'Account settings saved successfully!',
      //   isRead: false,
      // });
    } catch (error) {
      // addNotification({
      //   userId: user!.id,
      //   type: 'like',
      //   message: 'Failed to save account settings',
      //   isRead: false,
      // });
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleChangeLanguage = async (language: string) => {
    setSelectedLanguage(language);
    // addNotification({
    //   userId: user!.id,
    //   type: 'like',
    //   message: `Language changed to ${language}`,
    //   isRead: false,
    // });
  };
 
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
 
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
 
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
 
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // addNotification({
      //   userId: user!.id,
      //   type: 'like',
      //   message: 'Password changed successfully!',
      //   isRead: false,
      // });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // addNotification({
      //   userId: user!.id,
      //   type: 'like',
      //   message: 'Failed to change password',
      //   isRead: false,
      // });
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleSaveNotificationSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // addNotification({
      //   userId: user!.id,
      //   type: 'like',
      //   message: 'Notification settings saved!',
      //   isRead: false,
      // });
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleSavePrivacySettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // addNotification({
      //   userId: user!.id,
      //   type: 'like',
      //   message: 'Privacy settings saved!',
      //   isRead: false,
      // });
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    alert('Account deletion would be processed here with confirmation email');
    // In production, this would call an API endpoint
  };

  const handleDataDownload = () => {
    updateSetting('dataDownloadRequested', true);
    // Simulate download request
    setTimeout(() => {
      updateSetting('dataDownloadRequested', false);
      alert('Your data export will be emailed to you within 24 hours.');
    }, 2000);
  };

  const SettingRow = ({ 
    title, 
    description, 
    children 
  }: { 
    title: string; 
    description?: string; 
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Display Name"
                      value={accountForm.displayName}
                      onChange={(e) => setAccountForm({ ...accountForm, displayName: e.target.value })}
                    />
                    <Input
                      label="Username"
                      value={accountForm.username}
                      onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                      disabled
                    />
                  </div>
                  
                  <Input
                    label="Email"
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={accountForm.bio}
                      onChange={(e) => setAccountForm({ ...accountForm, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <Input
                    label="Location"
                    value={accountForm.location}
                    onChange={(e) => setAccountForm({ ...accountForm, location: e.target.value })}
                  />

                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Change Password</h3>
                    <Input
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <Button 
                      variant="primary"
                      onClick={handleSaveAccountSettings}
                      isLoading={isSaving}
                    >
                      Save Account Settings
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleChangePassword}
                      isLoading={isSaving}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Privacy Settings
                </h2>
                <div className="space-y-1">
                  <SettingRow
                    title="Profile Visibility"
                    description="Who can see your profile"
                  >
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700"
                    >
                      <option value="public">Everyone</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </SettingRow>

                  <SettingRow
                    title="Show Online Status"
                    description="Let others know when you're active"
                  >
                    <button
                      onClick={() => updateSetting('showOnlineStatus', !settings.showOnlineStatus)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.showOnlineStatus ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </SettingRow>

                  <SettingRow
                    title="Allow Direct Messages"
                    description="Who can send you direct messages"
                  >
                    <button
                      onClick={() => updateSetting('allowDirectMessages', !settings.allowDirectMessages)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.allowDirectMessages ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.allowDirectMessages ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </SettingRow>

                  <SettingRow
                    title="Show Location"
                    description="Display your location on your profile"
                  >
                    <button
                      onClick={() => updateSetting('showLocation', !settings.showLocation)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.showLocation ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.showLocation ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </SettingRow>
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Privacy Tip
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    VibeCircle is designed for authentic connections. Your privacy settings help you control who can interact with you while maintaining the friendly, open nature of our community.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="primary"
                    onClick={handleSavePrivacySettings}
                    isLoading={isSaving}
                  >
                    Save Privacy Settings
                  </Button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Notification Settings
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                      Push Notifications
                    </h3>
                    <div className="space-y-1">
                      <SettingRow
                        title="Push Notifications"
                        description="Receive notifications on this device"
                      >
                        <button
                          onClick={() => updateSetting('pushNotifications', !settings.pushNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.pushNotifications ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </SettingRow>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-1">
                      <SettingRow
                        title="Friend Requests"
                        description="When someone wants to connect with you"
                      >
                        <button
                          onClick={() => updateSetting('friendRequests', !settings.friendRequests)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.friendRequests ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              settings.friendRequests ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </SettingRow>

                      <SettingRow
                        title="Vibe Comments"
                        description="When someone comments on your vibes"
                      >
                        <button
                          onClick={() => updateSetting('vibeComments', !settings.vibeComments)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.vibeComments ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              settings.vibeComments ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </SettingRow>

                      <SettingRow
                        title="Circle Invites"
                        description="When you're invited to join a circle"
                      >
                        <button
                          onClick={() => updateSetting('circleInvites', !settings.circleInvites)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.circleInvites ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              settings.circleInvites ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </SettingRow>

                      <SettingRow
                        title="Event Reminders"
                        description="Reminders about upcoming events"
                      >
                        <button
                          onClick={() => updateSetting('eventReminders', !settings.eventReminders)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.eventReminders ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              settings.eventReminders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </SettingRow>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    variant="primary"
                    onClick={handleSaveNotificationSettings}
                    isLoading={isSaving}
                  >
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  App Preferences
                </h2>
                <div className="space-y-1">
                  <SettingRow
                    title="Theme"
                    description="Choose your preferred theme"
                  >
                    <button
                      onClick={toggleTheme}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {theme === 'light' ? (
                        <>
                          <Sun className="w-4 h-4" />
                          <span className="text-sm">Light</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4" />
                          <span className="text-sm">Dark</span>
                        </>
                      )}
                    </button>
                  </SettingRow>

                  <SettingRow
                    title="Language"
                    description="Select your language"
                  >
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => handleChangeLanguage(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </SettingRow>

                  <SettingRow
                    title="Authenticity Score"
                    description="Your current authenticity score"
                  >
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      {user?.authenticityScore}% Authentic
                    </Badge>
                  </SettingRow>
                </div>

                <div className="mt-8 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-teal-900 dark:text-teal-300 mb-2">
                    About Authenticity Score
                  </h3>
                  <p className="text-sm text-teal-700 dark:text-teal-400">
                    Your authenticity score is calculated based on profile completeness, community engagement, and verified interactions. It helps other users understand how genuine your profile is.
                  </p>
                </div>
              </div>
            )}

            {/* Data & Privacy */}
            {activeTab === 'data' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Data & Privacy
                </h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Download Your Data
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Request a copy of all your data including profile information, vibes, messages, and activity history.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleDataDownload}
                      isLoading={settings.dataDownloadRequested}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {settings.dataDownloadRequested ? 'Processing...' : 'Download Data'}
                    </Button>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Data Retention
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We keep your data for as long as your account is active. You can delete specific content or your entire account at any time.
                    </p>
                  </div>

                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <h3 className="text-sm font-medium text-red-900 dark:text-red-300 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Danger Zone
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                      Once you delete your account, there is no going back. This action cannot be undone.
                    </p>
                    <Button
                      variant="danger"
                      onClick={() => setIsDeleteModalOpen(true)}
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h3 className="font-semibold">This action cannot be undone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your profile, vibes, messages, and all data will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              To confirm deletion, please type: <strong>DELETE MY ACCOUNT</strong>
            </p>
            <Input placeholder="Type confirmation text..." />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger">
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}