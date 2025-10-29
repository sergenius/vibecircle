import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search,
  Globe,
  Video,
  CheckCircle,
  X,
  Sliders,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { mockEvents, mockUsers } from '../data/mockData';
import { Event } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface CreateEventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  maxAttendees: number;
  category: string;
}

interface EventFilters {
  sortBy: 'upcoming' | 'popular' | 'nearby';
  eventType: 'all' | 'virtual' | 'inperson';
  dateRange: 'week' | 'month' | 'all';
}

export function Events() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'attending' | 'hosting' | 'upcoming'>('upcoming');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [attendingEvents, setAttendingEvents] = useState<string[]>(['1', '2']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createForm, setCreateForm] = useState<CreateEventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isVirtual: false,
    maxAttendees: 50,
    category: 'Social',
  });

  const [filters, setFilters] = useState<EventFilters>({
    sortBy: 'upcoming',
    eventType: 'all',
    dateRange: 'month',
  });

  useEffect(() => {
    const loadEvents = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  const toggleAttendance = (eventId: string) => {
    setAttendingEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const now = new Date();
    const isUpcoming = event.date > now;
    
    let matchesFilter = true;
    switch (filter) {
      case 'upcoming':
        matchesFilter = isUpcoming && matchesSearch;
        break;
      case 'attending':
        matchesFilter = attendingEvents.includes(event.id) && matchesSearch;
        break;
      case 'hosting':
        matchesFilter = event.organizerId === user?.id && matchesSearch;
        break;
      default:
        matchesFilter = matchesSearch;
    }

    // Apply advanced filters
    if (matchesFilter) {
      if (filters.eventType === 'virtual' && !event.isVirtual) matchesFilter = false;
      if (filters.eventType === 'inperson' && event.isVirtual) matchesFilter = false;
    }

    return matchesFilter;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleCreateEvent = async () => {
    if (!createForm.title.trim() || !createForm.description.trim() || !createForm.date || !createForm.time) {
      addNotification({
        userId: user!.id,
        type: 'like',
        message: 'Please fill in all required fields',
        isRead: false,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const [year, month, day] = createForm.date.split('-');
      const [hours, minutes] = createForm.time.split(':');
      const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));

      const newEvent: Event = {
        id: (Math.random() * 1000).toString(),
        title: createForm.title,
        description: createForm.description,
        date: eventDate,
        location: createForm.location || (createForm.isVirtual ? 'Online' : 'TBD'),
        isVirtual: createForm.isVirtual,
        organizerId: user!.id,
        attendees: [{ id: user!.id, username: user!.username }],
        maxAttendees: createForm.maxAttendees,
      };

      setEvents(prev => [newEvent, ...prev]);
      setAttendingEvents(prev => [...prev, newEvent.id]);

      addNotification({
        userId: user!.id,
        type: 'like',
        message: `Event "${createForm.title}" created successfully!`,
        isRead: false,
      });

      setIsCreateModalOpen(false);
      setCreateForm({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        isVirtual: false,
        maxAttendees: 50,
        category: 'Social',
      });
    } catch (error) {
      addNotification({
        userId: user!.id,
        type: 'like',
        message: 'Failed to create event. Please try again.',
        isRead: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Events & Meetups
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and join exciting events in your community
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)}>
            <Sliders className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'upcoming', label: 'Upcoming', count: events.filter(e => e.date > new Date()).length },
            { key: 'attending', label: 'Attending', count: attendingEvents.length },
            { key: 'hosting', label: 'Hosting', count: events.filter(e => e.organizerId === user?.id).length },
            { key: 'all', label: 'All Events', count: events.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="gray" size="sm" className="ml-2 bg-white/20">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Event */}
      {filteredEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 mb-4">
              Featured Event
            </Badge>
            <h2 className="text-2xl font-bold mb-2">{filteredEvents[0].title}</h2>
            <p className="opacity-90 mb-4 max-w-2xl">{filteredEvents[0].description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(filteredEvents[0].date)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(filteredEvents[0].date)}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {filteredEvents[0].location}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {filteredEvents[0].attendees.length} attending
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                variant={attendingEvents.includes(filteredEvents[0].id) ? 'outline' : 'secondary'}
                onClick={() => toggleAttendance(filteredEvents[0].id)}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                {attendingEvents.includes(filteredEvents[0].id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Attending
                  </>
                ) : (
                  'Join Event'
                )}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.slice(1).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Event Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>
                <div className="ml-4">
                  {event.isVirtual ? (
                    <Badge variant="primary" className="bg-blue-100 text-blue-800">
                      <Video className="w-3 h-3 mr-1" />
                      Virtual
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      In-Person
                    </Badge>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(event.date)} at {formatTime(event.date)}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees.length} people attending
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center space-x-2 mb-4">
                <Avatar
                  src={mockUsers.find(u => u.id === event.organizerId)?.avatar}
                  size="xs"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hosted by {mockUsers.find(u => u.id === event.organizerId)?.displayName}
                </span>
              </div>

              {/* Action Button */}
              <Button
                variant={attendingEvents.includes(event.id) ? 'outline' : 'primary'}
                className="w-full"
                onClick={() => toggleAttendance(event.id)}
              >
                {attendingEvents.includes(event.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Attending
                  </>
                ) : (
                  'Join Event'
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Events State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No events found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filter === 'all' 
              ? "There are no events matching your search."
              : `No ${filter} events found.`}
          </p>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Event
          </Button>
        </div>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event"
        maxWidth="lg"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title *
            </label>
            <Input
              type="text"
              placeholder="Coffee Tasting Workshop"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {createForm.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Describe your event..."
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {createForm.description.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date *
              </label>
              <Input
                type="date"
                value={createForm.date}
                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time *
              </label>
              <Input
                type="time"
                value={createForm.time}
                onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {createForm.isVirtual ? 'Zoom/Video Link' : 'Location'}
            </label>
            <Input
              type="text"
              placeholder={createForm.isVirtual ? 'https://zoom.us/..." : "City, Venue Name, or Address"}
              value={createForm.location}
              onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Attendees
              </label>
              <Input
                type="number"
                min="1"
                value={createForm.maxAttendees}
                onChange={(e) => setCreateForm({ ...createForm, maxAttendees: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option>Social</option>
                <option>Workshop</option>
                <option>Party</option>
                <option>Sports</option>
                <option>Educational</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="virtual"
              checked={createForm.isVirtual}
              onChange={(e) => setCreateForm({ ...createForm, isVirtual: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="virtual" className="text-sm text-gray-700 dark:text-gray-300">
              This is a virtual event
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateEvent}
              isLoading={isSubmitting}
            >
              Create Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* Advanced Filters Modal */}
      <Modal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        title="Advanced Filters"
        maxWidth="md"
      >
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="upcoming">Upcoming First</option>
              <option value="popular">Most Popular</option>
              <option value="nearby">Nearby</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Type
            </label>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              <option value="virtual">Virtual Only</option>
              <option value="inperson">In-Person Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Upcoming</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsFiltersModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsFiltersModalOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}