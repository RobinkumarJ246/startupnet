'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, Users, MapPin, Search, TrendingUp, Star, Clock, Building2, 
  Sparkles, Globe2, Filter, ChevronDown, Share2, MoreHorizontal, 
  CalendarRange, Code, Presentation, Target, Laptop, Megaphone, 
  Briefcase, UserPlus, Music, Heart, ChevronLeft, ChevronRight, Ticket, Bell 
} from 'lucide-react';

// Utility function for Haversine distance calculation
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Mock user location (San Francisco)
const userLocation = { lat: 37.7749, lng: -122.4194 };

// Mock data generator for events
const generateMockEvents = () => {
  const eventTypes = [
    { type: 'Hackathon', icon: Code },
    { type: 'Conference', icon: Presentation },
    { type: 'Symposium', icon: Target },
    { type: 'Project Expo', icon: Laptop },
    { type: 'Pitch Event', icon: Megaphone },
    { type: 'Job Fair', icon: Briefcase },
    { type: 'Networking', icon: UserPlus },
    { type: 'Cultural Event', icon: Music },
    { type: 'Non-Profit', icon: Heart }
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Boston, MA', 'Austin, TX', 
    'Virtual Event', 'Hybrid - London'
  ];

  const tags = [
    'Innovation', 'AI/ML', 'Blockchain', 'Web3', 'Sustainability', 
    'FinTech', 'Healthcare', 'EdTech', 'Social Impact', 'Networking', 
    'Career Growth', 'Startup'
  ];

  const today = new Date();
  return Array.from({ length: 20 }, (_, i) => {
    const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isVirtual = Math.random() > 0.7;
    const isHybrid = !isVirtual && Math.random() > 0.8;
    const mode = isVirtual ? 'Virtual' : isHybrid ? 'Hybrid' : 'In-Person';

    const daysOffset = Math.random() * 90 - 30; // -30 to +60 days
    const startDate = new Date(today.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    const isMultiDay = Math.random() < 0.3;
    const endDate = isMultiDay
      ? new Date(startDate.getTime() + (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000)
      : new Date(startDate);

    const isReleased = Math.random() > 0.3;

    return {
      id: i + 1,
      title: `${randomEventType.type} - ${['Global', 'Tech', 'Innovation', 'Future'][Math.floor(Math.random() * 4)]} ${randomEventType.type}`,
      description: `Join us for an exciting ${randomEventType.type.toLowerCase()} focusing on innovation and collaboration.`,
      startDate,
      endDate,
      time: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'} EST`,
      location: locations[Math.floor(Math.random() * locations.length)],
      type: randomEventType.type,
      typeIcon: randomEventType.icon,
      mode,
      organizer: ['TechHub', 'StartupNet', 'InnovateNow', 'FutureWorks'][Math.floor(Math.random() * 4)],
      isSpotlight: Math.random() > 0.8,
      isTrending: Math.random() > 0.8,
      isEarlyBird: Math.random() > 0.8,
      tags: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => 
        tags[Math.floor(Math.random() * tags.length)]
      ),
      imageUrl: 'https://cdn.textstudio.com/output/sample/normal/6/3/2/5/event-logo-182-5236.png',
      price: Math.random() > 0.5 ? 'Free' : `$${Math.floor(Math.random() * 200) + 49}`,
      attendees: Math.floor(Math.random() * 1000) + 100,
      maxCapacity: Math.floor(Math.random() * 2000) + 500,
      lat: 37.7749 + (Math.random() - 0.5) * 0.1, // Around San Francisco
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
      isReleased,
    };
  });
};

const EventsPage = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    mode: [],
    price: [],
    dateRange: { start: null, end: null },
    duration: [],
    location: false, // Changed to a boolean for simplicity
  });
  const [locationSettings, setLocationSettings] = useState({
    useDeviceLocation: true,
    radius: 15, // in km
  });
  const [loading, setLoading] = useState(true);

  const eventsPerPage = 9;
  const sections = [
    { id: 'all', label: 'All Events', icon: Calendar },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'live', label: 'Live Now', icon: Sparkles },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarRange },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  const filterOptions = {
    type: [
      { id: 'hackathon', label: 'Hackathon', icon: Code },
      { id: 'conference', label: 'Conference', icon: Presentation },
      { id: 'symposium', label: 'Symposium', icon: Target },
      { id: 'project-expo', label: 'Project Expo', icon: Laptop },
      { id: 'pitch-event', label: 'Pitch Event', icon: Megaphone },
      { id: 'job-fair', label: 'Job Fair', icon: Briefcase },
      { id: 'networking', label: 'Networking', icon: UserPlus },
      { id: 'cultural-event', label: 'Cultural Event', icon: Music },
      { id: 'non-profit', label: 'Non-Profit', icon: Heart },
    ],
    mode: [
      { id: 'in-person', label: 'In-Person', icon: MapPin },
      { id: 'virtual', label: 'Virtual', icon: Globe2 },
      { id: 'hybrid', label: 'Hybrid', icon: Laptop },
    ],
    price: [
      { id: 'free', label: 'Free', icon: Sparkles },
      { id: 'paid', label: 'Paid', icon: Ticket },
      { id: 'early-bird', label: 'Early Bird', icon: Clock },
    ],
    duration: [
      { id: 'single-day', label: 'Single-Day', icon: Calendar },
      { id: 'multi-day', label: 'Multi-Day', icon: CalendarRange },
    ],
    location: [
      { id: 'location', label: 'Location', icon: MapPin },
    ],
  };

  useEffect(() => {
    setLoading(true);
    const fetchedEvents = generateMockEvents();
    setEvents(fetchedEvents);
    setLoading(false);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const now = new Date();
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const status = now < start ? 'upcoming' : now > end ? 'past' : 'live';

      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const normalizedType = event.type.toLowerCase().replace(/\s+/g, '-');
      const matchesType = !selectedFilters.type.length || 
        selectedFilters.type.includes(normalizedType);

      const matchesMode = !selectedFilters.mode.length || 
        selectedFilters.mode.includes(event.mode.toLowerCase());

      const matchesPrice = !selectedFilters.price.length || 
        (selectedFilters.price.includes('free') && event.price === 'Free') ||
        (selectedFilters.price.includes('paid') && event.price !== 'Free') ||
        (selectedFilters.price.includes('early-bird') && event.isEarlyBird);

      const matchesDate = !selectedFilters.dateRange.start || 
        (start >= new Date(selectedFilters.dateRange.start) && 
         (!selectedFilters.dateRange.end || end <= new Date(selectedFilters.dateRange.end)));

      const matchesSection = activeSection === 'all' || 
        (activeSection === 'featured' && event.isSpotlight) || 
        (activeSection === 'trending' && event.isTrending) || 
        (activeSection === 'live' && status === 'live') || 
        (activeSection === 'upcoming' && status === 'upcoming');

      const isSingleDay = start.getTime() === end.getTime();
      const matchesDuration = !selectedFilters.duration.length ||
        (selectedFilters.duration.includes('single-day') && isSingleDay) ||
        (selectedFilters.duration.includes('multi-day') && !isSingleDay);

      const referenceLocation = locationSettings.useDeviceLocation ? userLocation : userLocation; // Mocked for now
      const matchesLocation = !selectedFilters.location || 
        haversineDistance(referenceLocation.lat, referenceLocation.lng, event.lat, event.lng) <= locationSettings.radius;

      return matchesSearch && matchesType && matchesMode && matchesPrice && matchesDate && matchesSection && matchesDuration && matchesLocation;
    });
  }, [events, searchQuery, selectedFilters, activeSection, locationSettings]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      mode: [],
      price: [],
      dateRange: { start: null, end: null },
      duration: [],
      location: false,
    });
    setLocationSettings({ useDeviceLocation: true, radius: 15 });
    setSearchQuery('');
  };

  const toggleLocationFilter = () => {
    setSelectedFilters(prev => ({
      ...prev,
      location: !prev.location,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Discover & Join Amazing Events
          </h1>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl">
            Connect with innovators, showcase your talents, and grow your network in the startup ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/host-event"
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap focus:ring-2 focus:ring-indigo-300"
              aria-label="Host an event"
            >
              <Calendar className="w-5 h-5" />
              Host Event
            </Link>

            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, topics, tags..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                aria-label="Search events"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Tabs & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-300'
                }`}
                aria-label={`Show ${section.label}`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-300 transition-all"
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Filters */}
              {Object.entries(filterOptions).map(([category, options]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-3 capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (category === 'location') {
                            toggleLocationFilter();
                          } else {
                            setSelectedFilters(prev => ({
                              ...prev,
                              [category]: prev[category].includes(option.id)
                                ? prev[category].filter(id => id !== option.id)
                                : [...prev[category], option.id]
                            }));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors duration-200 ${
                          (category === 'location' ? selectedFilters.location : selectedFilters[category].includes(option.id))
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-indigo-300'
                        }`}
                        aria-label={`Filter by ${option.label}`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Location Settings Sub-Panel */}
                  {category === 'location' && selectedFilters.location && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={locationSettings.useDeviceLocation}
                            onChange={() => setLocationSettings(prev => ({ ...prev, useDeviceLocation: true }))}
                            className="form-radio"
                          />
                          Device Location
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={!locationSettings.useDeviceLocation}
                            onChange={() => setLocationSettings(prev => ({ ...prev, useDeviceLocation: false }))}
                            className="form-radio"
                          />
                          Account Location
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Radius: {locationSettings.radius} km</label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          step="5"
                          value={locationSettings.radius}
                          onChange={(e) => setLocationSettings(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Date Range Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Date Range</h3>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={selectedFilters.dateRange.start || ''}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value || null }
                    }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
                    aria-label="Start date"
                  />
                  <input
                    type="date"
                    value={selectedFilters.dateRange.end || ''}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value || null }
                    }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
                    aria-label="End date"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : currentEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found. Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:text-gray-400 disabled:border-gray-100 hover:bg-gray-50 disabled:hover:bg-white focus:ring-2 focus:ring-indigo-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {totalPages <= 5 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300'
                  }`}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300'
                  }`}
                  aria-label="Page 1"
                >
                  1
                </button>
                {currentPage > 3 && <span className="text-gray-600">...</span>}
                {Array.from({ length: 3 }, (_, i) => {
                  const page = currentPage - 1 + i;
                  return page > 1 && page < totalPages ? (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300'
                      }`}
                      aria-label={`Page ${page}`}
                    >
                      {page}
                    </button>
                  ) : null;
                })}
                {currentPage < totalPages - 2 && <span className="text-gray-600">...</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300'
                  }`}
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:text-gray-400 disabled:border-gray-100 hover:bg-gray-50 disabled:hover:bg-white focus:ring-2 focus:ring-indigo-300"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const EventCard = ({ event }) => {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const status = now < start ? 'upcoming' : now > end ? 'past' : 'live';

  const formatDateRange = (start, end, isReleased) => {
    if (!isReleased) {
      return 'Coming Soon';
    }
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    if (start.getTime() === end.getTime()) {
      return start.toLocaleDateString('en-US', options);
    } else {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', options)}`;
    }
  };

  const TypeIcon = event.typeIcon;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 right-4 flex flex-row gap-2">
          {event.isSpotlight && (
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-medium rounded-full flex items-center gap-1">
              <Star className="w-4 h-4" />
              Featured
            </span>
          )}
          {event.isTrending && (
            <span className="px-3 py-1 bg-rose-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Trending
            </span>
          )}
          {event.isEarlyBird && (
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Early Bird
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
          <p className="text-gray-200 text-sm line-clamp-2">{event.description}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-6">
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Calendar className="w-4 h-4 text-indigo-600" />
            {formatDateRange(start, end, event.isReleased)}
          </span>
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4 text-indigo-600" />
            {event.location}
          </span>
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <TypeIcon className="w-4 h-4 text-indigo-600" />
            {event.type}
          </span>
          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4 text-indigo-600" />
            {event.attendees} / {event.maxCapacity}
          </span>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {event.tags.map((tag, index) => (
            <span
              key={`${event.id}-tag-${index}`}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === 'upcoming' ? (
              <button
                onClick={() => alert('Notification set for this event!')}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 flex items-center gap-2"
                aria-label={`Set notification for ${event.title}`}
              >
                <Bell className="w-5 h-5" />
                Notify
              </button>
            ) : (
              <Link
                href={`/register-event/${event.id}`}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 flex items-center gap-2"
                aria-label={`Register for ${event.title}`}
              >
                <Ticket className="w-5 h-5" />
                Register
              </Link>
            )}
            <button
              className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label={`Share ${event.title}`}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${event.price === 'Free' ? 'text-green-600' : 'text-gray-900'}`}>
              {event.price}
            </span>
            <button
              className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Custom Tailwind animations */
const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default EventsPage;