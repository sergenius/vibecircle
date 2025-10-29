import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Hash,
  Users,
  Video,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { VibeCard } from '../components/vibe/VibeCard';
import { CircleCard } from '../components/circle/CircleCard';
import { mockUsers, mockVibes, mockCircles } from '../data/mockData';

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'vibes' | 'circles' | 'hashtags'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    people: mockUsers,
    vibes: mockVibes,
    circles: mockCircles,
    hashtags: ['#coffee', '#photography', '#mindfulness', '#travel', '#cooking', '#music'],
  });

  const trendingSearches = [
    'coffee enthusiasts',
    'photography adventures',
    'mindful living',
    'weekend vibes',
    'tech meetups',
    'book clubs',
  ];

  const recentSearches = [
    'alex photography',
    'coffee circles',
    '#mindfulness',
    'yoga events',
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        // Filter results based on search query
        const filteredResults = {
          people: mockUsers.filter(user => 
            user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.interests.some(interest => 
              interest.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ),
          vibes: mockVibes.filter(vibe => 
            vibe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vibe.tags.some(tag => 
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ),
          circles: mockCircles.filter(circle => 
            circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            circle.tags.some(tag => 
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
          ),
          hashtags: ['#coffee', '#photography', '#mindfulness', '#travel', '#cooking', '#music']
            .filter(tag => 
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        };
        setSearchResults(filteredResults);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSearchResults({
        people: mockUsers,
        vibes: mockVibes,
        circles: mockCircles,
        hashtags: ['#coffee', '#photography', '#mindfulness', '#travel', '#cooking', '#music'],
      });
    }
  }, [searchQuery]);

  const totalResults = Object.values(searchResults).reduce((total, results) => {
    return total + (Array.isArray(results) ? results.length : 0);
  }, 0);

  const tabs = [
    { key: 'all', label: 'All', count: totalResults },
    { key: 'people', label: 'People', count: searchResults.people.length },
    { key: 'vibes', label: 'Vibes', count: searchResults.vibes.length },
    { key: 'circles', label: 'Circles', count: searchResults.circles.length },
    { key: 'hashtags', label: 'Hashtags', count: searchResults.hashtags.length },
  ];

  const SearchSection = ({ title, children, count }: { title: string; children: React.ReactNode; count?: number }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
          {count && count > 0 && (
            <Badge variant="gray" size="sm" className="ml-2">
              {count}
            </Badge>
          )}
        </h3>
        {count && count > 3 && (
          <Button variant="ghost" size="sm">
            View All
          </Button>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Search VibeCircle
        </h1>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for people, circles, vibes, or hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
          <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {!searchQuery && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
              Trending Searches
            </h3>
            <div className="space-y-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="flex items-center w-full p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Search className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{term}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500" />
              Recent Searches
            </h3>
            <div className="space-y-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="flex items-center w-full p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Clock className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <>
          {/* Results Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
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
                  {tab.count > 0 && (
                    <Badge variant="gray" size="sm" className="ml-2">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* All Results */}
              {activeTab === 'all' && (
                <div className="space-y-8">
                  {searchResults.people.length > 0 && (
                    <SearchSection title="People" count={searchResults.people.length}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.people.slice(0, 3).map((user) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar src={user.avatar} alt={user.displayName} />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                  {user.displayName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  @{user.username}
                                </p>
                                <div className="flex items-center text-xs text-gray-400 mt-1">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {user.location}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {user.interests.slice(0, 2).map((interest) => (
                                <Badge key={interest} variant="primary" size="sm">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="primary" size="sm" className="w-full mt-3">
                              Connect
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </SearchSection>
                  )}

                  {searchResults.circles.length > 0 && (
                    <SearchSection title="Circles" count={searchResults.circles.length}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.circles.slice(0, 3).map((circle) => (
                          <CircleCard key={circle.id} circle={circle} />
                        ))}
                      </div>
                    </SearchSection>
                  )}

                  {searchResults.vibes.length > 0 && (
                    <SearchSection title="Vibes" count={searchResults.vibes.length}>
                      <div className="space-y-6">
                        {searchResults.vibes.slice(0, 2).map((vibe) => (
                          <VibeCard key={vibe.id} vibe={vibe} />
                        ))}
                      </div>
                    </SearchSection>
                  )}

                  {searchResults.hashtags.length > 0 && (
                    <SearchSection title="Hashtags" count={searchResults.hashtags.length}>
                      <div className="flex flex-wrap gap-3">
                        {searchResults.hashtags.map((hashtag) => (
                          <button
                            key={hashtag}
                            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Hash className="w-4 h-4 text-teal-500" />
                            <span className="text-gray-900 dark:text-white">{hashtag.slice(1)}</span>
                            <Badge variant="gray" size="sm">
                              {Math.floor(Math.random() * 1000) + 100}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </SearchSection>
                  )}
                </div>
              )}

              {/* People Tab */}
              {activeTab === 'people' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.people.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="text-center">
                        <Avatar src={user.avatar} alt={user.displayName} size="lg" className="mx-auto mb-4" />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {user.displayName}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          @{user.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {user.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {user.interests.slice(0, 3).map((interest) => (
                            <Badge key={interest} variant="primary" size="sm">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="primary" size="sm" className="w-full">
                          Connect
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Other tabs would follow similar patterns... */}
              {activeTab === 'vibes' && (
                <div className="space-y-6">
                  {searchResults.vibes.map((vibe) => (
                    <VibeCard key={vibe.id} vibe={vibe} />
                  ))}
                </div>
              )}

              {activeTab === 'circles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.circles.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} />
                  ))}
                </div>
              )}

              {activeTab === 'hashtags' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.hashtags.map((hashtag) => (
                    <motion.div
                      key={hashtag}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                            <Hash className="w-6 h-6 text-teal-500" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {hashtag}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {Math.floor(Math.random() * 1000) + 100} posts
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Discover content related to {hashtag.slice(1)} and connect with like-minded people.
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading && totalResults === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search terms or explore trending content.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {trendingSearches.slice(0, 3).map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}