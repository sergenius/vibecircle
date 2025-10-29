import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  Book,
  Video,
  Users,
  Settings,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Topics', icon: HelpCircle },
    { key: 'getting-started', label: 'Getting Started', icon: Sparkles },
    { key: 'profiles', label: 'Profiles & Vibes', icon: Video },
    { key: 'connections', label: 'Connections & Circles', icon: Users },
    { key: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { key: 'technical', label: 'Technical Issues', icon: Settings },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'getting-started',
      question: 'What is VibeCircle and how does it work?',
      answer: 'VibeCircle is a video-based social platform focused on authentic friendship discovery. Users create short video introductions (called "vibes"), join interest-based communities (circles), and connect with like-minded people through AI-powered matching. Unlike dating apps, VibeCircle is specifically designed for building genuine friendships.',
    },
    {
      id: '2',
      category: 'getting-started',
      question: 'How do I create my first vibe?',
      answer: 'To create your first vibe, click the "Create Vibe" button in the navigation. You can either record a 15-second video using your camera or upload an existing video. Add a description, select your mood, include relevant tags, and choose your privacy settings. Our AI will suggest conversation prompts to help you get started!',
    },
    {
      id: '3',
      category: 'profiles',
      question: 'What is an Authenticity Score?',
      answer: 'Your Authenticity Score is a percentage that reflects how genuine and complete your profile appears. It\'s calculated based on factors like profile completeness, verified interactions, community engagement, and consistency across your content. A higher score helps other users trust your profile and increases your chances of meaningful connections.',
    },
    {
      id: '4',
      category: 'connections',
      question: 'How does the AI matching system work?',
      answer: 'Our AI analyzes your interests, values, communication style, and activity patterns to suggest potential friends who share common ground with you. The system considers factors like shared interests, compatible personalities, geographic proximity, and mutual friends to calculate compatibility scores.',
    },
    {
      id: '5',
      category: 'connections',
      question: 'What are Circles and how do I join them?',
      answer: 'Circles are interest-based communities where people with shared hobbies, values, or goals can connect. You can discover circles by browsing categories, searching for specific topics, or receiving AI recommendations. Most circles are public and you can join instantly, while some private circles require approval from admins.',
    },
    {
      id: '6',
      category: 'privacy',
      question: 'How do I control who can see my profile and vibes?',
      answer: 'VibeCircle offers granular privacy controls. You can set your profile to public, friends-only, or private. For individual vibes, you can choose to share publicly, with specific circles, or keep them private. You can also control who can send you friend requests and direct messages through your privacy settings.',
    },
    {
      id: '7',
      category: 'privacy',
      question: 'Is VibeCircle safe? What safety features do you have?',
      answer: 'Safety is our top priority. We use AI-powered content moderation, profile verification, and human review processes. Users can easily report inappropriate behavior, block others, and access safety resources. We also provide safety tips for online interactions and meeting people in person.',
    },
    {
      id: '8',
      category: 'technical',
      question: 'Why isn\'t my video uploading?',
      answer: 'Video upload issues can occur due to file size (max 100MB), format (we support MP4, MOV, AVI), or internet connection problems. Try reducing your video quality, checking your internet connection, or using a different browser. If problems persist, contact our support team.',
    },
    {
      id: '9',
      category: 'profiles',
      question: 'Can I edit or delete my vibes after posting?',
      answer: 'Yes! You can edit vibe descriptions, tags, and privacy settings anytime. To delete a vibe, go to your profile, click on the vibe, and select the delete option. Note that deleted vibes cannot be recovered, so make sure you really want to remove them.',
    },
    {
      id: '10',
      category: 'connections',
      question: 'How do I organize meetups with my VibeCircle friends?',
      answer: 'Use our Events feature to organize meetups! You can create public or private events, set locations and times, invite specific friends or entire circles, and manage RSVPs. We also provide safety tips for meeting online friends in person.',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email (response within 24 hours)',
      icon: Mail,
      action: 'mailto:support@vibecircle.com',
      primary: false,
    },
    {
      title: 'Community Forum',
      description: 'Ask questions and get help from other users',
      icon: MessageCircle,
      action: '/community',
      primary: true,
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      action: '/tutorials',
      primary: false,
    },
    {
      title: 'User Guide',
      description: 'Comprehensive documentation',
      icon: Book,
      action: 'https://docs.vibecircle.com',
      primary: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
        >
          <HelpCircle className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Help & Support
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to common questions, learn how to use VibeCircle features, and get the help you need.
        </p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help topics, features, or issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Quick Help Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {contactOptions.map((option, index) => {
          const Icon = option.icon;
          const isExternal = option.action.startsWith('http') || option.action.startsWith('mailto');
          const isLink = option.action.startsWith('/');
          
          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-6 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                option.primary
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 hover:border-blue-300'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300'
              }`}
              onClick={() => {
                if (isLink) {
                  window.location.href = option.action;
                } else if (isExternal) {
                  window.open(option.action, '_blank');
                }
              }}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                option.primary 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className={`font-semibold mb-2 ${
                option.primary 
                  ? 'text-blue-900 dark:text-blue-300' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {option.title}
              </h3>
              <p className={`text-sm ${
                option.primary 
                  ? 'text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {option.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Browse by Topic
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.key;
            const count = category.key === 'all' 
              ? faqs.length 
              : faqs.filter(faq => faq.category === category.key).length;
            
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
                <Badge variant="gray" size="sm" className={isActive ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200' : ''}>
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or browse different categories.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Still Need Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Still need help?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:support@vibecircle.com">
            <Button variant="primary">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </a>
          <Link to="/community">
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Community Forum
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}