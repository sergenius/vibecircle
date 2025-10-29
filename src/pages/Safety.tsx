import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Flag,
  Eye,
  Lock,
  Users,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export function Safety() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Profile Verification',
      description: 'All profiles go through authenticity checks to ensure genuine connections.',
      status: 'active',
    },
    {
      icon: Eye,
      title: 'Content Moderation',
      description: 'AI-powered and human moderation keeps inappropriate content off the platform.',
      status: 'active',
    },
    {
      icon: Lock,
      title: 'Privacy Controls',
      description: 'Granular privacy settings let you control who can contact and see you.',
      status: 'active',
    },
    {
      icon: Flag,
      title: 'Report System',
      description: 'Easy reporting tools for any concerning behavior or content.',
      status: 'active',
    },
  ];

  const communityGuidelines = [
    {
      title: 'Be Authentic',
      description: 'Use real photos and information. Authenticity builds trust and meaningful connections.',
    },
    {
      title: 'Respect Others',
      description: 'Treat everyone with kindness and respect. Harassment, bullying, or discrimination is not tolerated.',
    },
    {
      title: 'Keep it Appropriate',
      description: 'Share content suitable for all ages. No explicit, harmful, or offensive material.',
    },
    {
      title: 'Stay Safe',
      description: "Don't share personal information like addresses, phone numbers, or financial details.",
    },
    {
      title: 'Build Genuine Connections',
      description: 'Focus on authentic friendships. This is not a dating platform.',
    },
    {
      title: 'Report Concerns',
      description: 'Help us maintain a safe community by reporting inappropriate behavior or content.',
    },
  ];

  const reportReasons = [
    'Harassment or Bullying',
    'Inappropriate Content',
    'Spam or Fake Account',
    'Safety Concerns',
    'Impersonation',
    'Other',
  ];

  const supportResources = [
    {
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741',
      type: 'emergency',
    },
    {
      title: 'National Suicide Prevention Lifeline',
      description: 'Call 988',
      type: 'emergency',
    },
    {
      title: 'VibeCircle Support',
      description: 'support@vibecircle.com',
      type: 'platform',
    },
    {
      title: 'Community Guidelines',
      description: 'Learn more about our rules',
      type: 'info',
    },
  ];

  const handleReportSubmit = () => {
    // Handle report submission
    console.log('Report submitted:', { reportType, reportDetails });
    setIsReportModalOpen(false);
    setReportType('');
    setReportDetails('');
    alert('Thank you for your report. Our team will review it promptly.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Safety Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your safety and well-being are our top priorities. Learn about our safety features, community guidelines, and how to report concerns.
        </p>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-300">
            Need Immediate Help?
          </h2>
        </div>
        <p className="text-red-800 dark:text-red-400 mb-4">
          If you're experiencing harassment, feeling unsafe, or need immediate assistance, don't hesitate to take action.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="danger"
            onClick={() => setIsReportModalOpen(true)}
          >
            <Flag className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <Phone className="w-4 h-4 mr-2" />
            Emergency: 911
          </Button>
          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <MessageCircle className="w-4 h-4 mr-2" />
            Crisis Text: 741741
          </Button>
        </div>
      </motion.div>

      {/* Safety Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-teal-500" />
          Our Safety Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2 text-orange-500" />
          Community Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityGuidelines.map((guideline, index) => (
            <motion.div
              key={guideline.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {guideline.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {guideline.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Safety Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-6 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Safety Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium text-blue-900 dark:text-blue-300">Online Safety</h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li>• Never share personal information like addresses or phone numbers</li>
              <li>• Use VibeCircle's built-in messaging instead of external apps</li>
              <li>• Be cautious of people asking for money or personal favors</li>
              <li>• Trust your instincts - if something feels wrong, it probably is</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-blue-900 dark:text-blue-300">Meeting in Person</h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li>• Meet in public places for the first few times</li>
              <li>• Tell a friend where you're going and when you'll be back</li>
              <li>• Drive yourself or use your own transportation</li>
              <li>• Video chat before meeting to verify identity</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Support Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-purple-500" />
          Support Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                resource.type === 'emergency'
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  : resource.type === 'platform'
                  ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700'
              }`}
            >
              <h3 className={`font-medium mb-2 ${
                resource.type === 'emergency'
                  ? 'text-red-900 dark:text-red-300'
                  : resource.type === 'platform'
                  ? 'text-teal-900 dark:text-teal-300'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {resource.title}
              </h3>
              <p className={`text-sm ${
                resource.type === 'emergency'
                  ? 'text-red-700 dark:text-red-400'
                  : resource.type === 'platform'
                  ? 'text-teal-700 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {resource.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report an Issue"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Help us keep VibeCircle safe by reporting any concerning behavior, content, or safety issues.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What are you reporting?
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">Select a reason</option>
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Details
            </label>
            <textarea
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Please provide any additional context that would help us understand and address this issue..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Note:</strong> All reports are reviewed by our safety team. For immediate emergencies, please contact local authorities or crisis support services.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReportSubmit}
              disabled={!reportType}
            >
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}