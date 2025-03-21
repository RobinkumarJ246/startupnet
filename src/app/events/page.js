'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Users, MapPin, Search, Star, Clock, 
  Sparkles, Globe2, Filter, ChevronDown, Share2, 
  CalendarRange, Code, Presentation, Target, Laptop, Megaphone, 
  Briefcase, UserPlus, Music, Heart, ChevronLeft, ChevronRight, 
  Ticket, Bell, Building, School, Coffee, ArrowRight, Plus, BadgeCheck, Tag
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';

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

// Function to format date
const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Function to format time
const formatTime = (timeString) => {
  return timeString;
};

const EventsPage = () => {
  const router = useRouter();
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
    location: false,
  });
  const [locationSettings, setLocationSettings] = useState({
    useDeviceLocation: true,
    radius: 15, // in km
  });
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [eventsCount, setEventsCount] = useState(0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    mode: 'all',
    search: '',
    page: 1,
    limit: 12,
    sort: 'startDate',
    order: 'asc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const eventsPerPage = 9;
  const sections = [
    { id: 'all', label: 'All Events', icon: Calendar },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'live', label: 'Live Now', icon: Sparkles },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarRange },
    { id: 'trending', label: 'Trending', icon: Star },
  ];

  const filterOptions = {
    type: [
      { id: 'hackathon', label: 'Hackathon', icon: Code },
      { id: 'conference', label: 'Conference', icon: Presentation },
      { id: 'symposium', label: 'Symposium', icon: Target },
      { id: 'workshop', label: 'Workshop', icon: Laptop },
      { id: 'pitch-event', label: 'Pitch Event', icon: Megaphone },
      { id: 'job-fair', label: 'Job Fair', icon: Briefcase },
      { id: 'networking', label: 'Networking', icon: UserPlus },
      { id: 'cultural-event', label: 'Cultural Event', icon: Music },
      { id: 'ngo-event', label: 'NGO Event', icon: Heart },
      { id: 'expert-lecture', label: 'Expert Lecture', icon: Presentation },
      { id: 'expo', label: 'Expo', icon: Globe2 },
      { id: 'music-fest', label: 'Music Fest', icon: Music },
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

  // Get user type from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserType(parsedUser.type);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build the API URL with filters
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', eventsPerPage);
      params.append('sort', filters.sort);
      params.append('order', filters.order);
      
      if (filters.type !== 'all') {
        params.append('type', filters.type);
      }
      
      if (filters.mode !== 'all' && filters.mode.length > 0) {
        params.append('mode', filters.mode.join(','));
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }

      // Make the API request
      const response = await fetch(`/api/events/types?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Skip filtering if no events
      if (!events.length) return true;
      
      const now = new Date();
      const start = new Date(event.startDate);
      const end = new Date(event.endDate || event.startDate);
      const status = now < start ? 'upcoming' : now > end ? 'past' : 'live';

      const matchesSearch = !searchQuery || 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const normalizedType = event.type?.toLowerCase().replace(/\s+/g, '-') || '';
      const matchesType = !selectedFilters.type.length || 
        selectedFilters.type.includes(normalizedType);

      const matchesMode = !selectedFilters.mode.length || 
        selectedFilters.mode.includes(event.mode?.toLowerCase() || '');

      const matchesPrice = !selectedFilters.price.length || 
        (selectedFilters.price.includes('free') && event.isFree) ||
        (selectedFilters.price.includes('paid') && !event.isFree) ||
        (selectedFilters.price.includes('early-bird') && event.hasEarlyBird);

      const matchesDate = !selectedFilters.dateRange.start || 
        (start >= new Date(selectedFilters.dateRange.start) && 
         (!selectedFilters.dateRange.end || end <= new Date(selectedFilters.dateRange.end)));

      const matchesSection = activeSection === 'all' || 
        (activeSection === 'featured' && event.isFeatured) || 
        (activeSection === 'trending' && event.isTrending) || 
        (activeSection === 'live' && status === 'live') || 
        (activeSection === 'upcoming' && status === 'upcoming');

      const isSingleDay = !event.endDate || start.toDateString() === new Date(event.endDate).toDateString();
      const matchesDuration = !selectedFilters.duration.length ||
        (selectedFilters.duration.includes('single-day') && isSingleDay) ||
        (selectedFilters.duration.includes('multi-day') && !isSingleDay);

      // Location filtering logic - needs user's location
      const matchesLocation = !selectedFilters.location || 
        (event.lat && event.lng && locationSettings.radius && 
         haversineDistance(userLocation.lat, userLocation.lng, event.lat, event.lng) <= locationSettings.radius);

      return matchesSearch && matchesType && matchesMode && matchesPrice && 
             matchesDate && matchesSection && matchesDuration && matchesLocation;
    });
  }, [events, searchQuery, selectedFilters, activeSection, locationSettings]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

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

  const handleHostEvent = () => {
    router.push('/host-event');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements similar to landing page */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Discover <span className="text-blue-300">Amazing Events</span>
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Connect with the community through hackathons, workshops, 
            conferences, and more - both in-person and virtual.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border-0 rounded-lg bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 placeholder:text-indigo-200 text-white"
                placeholder="Search events by name, description or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Host Event Button - Only for startups and clubs */}
          {(userType === 'startup' || userType === 'club') && (
            <div className="mt-6">
              <button
                onClick={handleHostEvent}
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors duration-300 text-base font-medium shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Host an Event
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info Section - Only for students */}
      {userType === 'student' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-indigo-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4 mb-4 md:mb-0">
                <BadgeCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Join events to build your profile</h3>
                <p className="text-gray-600">Participating in events helps you gain experience, network with professionals, and showcase your skills.</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Clear all
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Event Type Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Event Type</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {filterOptions.type.map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`type-${option.id}`}
                          name={`type-${option.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedFilters.type.includes(option.id)}
                          onChange={() => {
                            setSelectedFilters(prev => ({
                              ...prev,
                              type: prev.type.includes(option.id)
                                ? prev.type.filter(id => id !== option.id)
                                : [...prev.type, option.id]
                            }));
                          }}
                        />
                        <label htmlFor={`type-${option.id}`} className="ml-2 flex items-center text-sm text-gray-700">
                          <option.icon className="h-4 w-4 mr-1 text-gray-500" />
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Event Mode Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Event Mode</h3>
                  <div className="space-y-2">
                    {filterOptions.mode.map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`mode-${option.id}`}
                          name={`mode-${option.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedFilters.mode.includes(option.id)}
                          onChange={() => {
                            setSelectedFilters(prev => ({
                              ...prev,
                              mode: prev.mode.includes(option.id)
                                ? prev.mode.filter(id => id !== option.id)
                                : [...prev.mode, option.id]
                            }));
                          }}
                        />
                        <label htmlFor={`mode-${option.id}`} className="ml-2 flex items-center text-sm text-gray-700">
                          <option.icon className="h-4 w-4 mr-1 text-gray-500" />
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price</h3>
                  <div className="space-y-2">
                    {filterOptions.price.map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`price-${option.id}`}
                          name={`price-${option.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedFilters.price.includes(option.id)}
                          onChange={() => {
                            setSelectedFilters(prev => ({
                              ...prev,
                              price: prev.price.includes(option.id)
                                ? prev.price.filter(id => id !== option.id)
                                : [...prev.price, option.id]
                            }));
                          }}
                        />
                        <label htmlFor={`price-${option.id}`} className="ml-2 flex items-center text-sm text-gray-700">
                          <option.icon className="h-4 w-4 mr-1 text-gray-500" />
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Duration Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Duration</h3>
                  <div className="space-y-2">
                    {filterOptions.duration.map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`duration-${option.id}`}
                          name={`duration-${option.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedFilters.duration.includes(option.id)}
                          onChange={() => {
                            setSelectedFilters(prev => ({
                              ...prev,
                              duration: prev.duration.includes(option.id)
                                ? prev.duration.filter(id => id !== option.id)
                                : [...prev.duration, option.id]
                            }));
                          }}
                        />
                        <label htmlFor={`duration-${option.id}`} className="ml-2 flex items-center text-sm text-gray-700">
                          <option.icon className="h-4 w-4 mr-1 text-gray-500" />
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Date Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        id="start-date"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={selectedFilters.dateRange.start || ''}
                        onChange={(e) => {
                          setSelectedFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, start: e.target.value }
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        id="end-date"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={selectedFilters.dateRange.end || ''}
                        onChange={(e) => {
                          setSelectedFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, end: e.target.value }
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Events Content */}
          <div className="lg:w-3/4">
            {/* Category Tabs */}
            <div className="mb-8 overflow-x-auto hide-scrollbar">
              <div className="flex space-x-2 pb-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="h-4 w-4" />
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Events Results */}
            <div>
              {loading ? (
                <div className="min-h-[50vh] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : currentEvents.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentEvents.map(event => (
                      <EventCard key={event._id} event={event} userType={userType} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md border ${
                            currentPage === 1
                              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-md border ${
                            currentPage === totalPages
                              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="min-h-[30vh] flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 p-8">
                  <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
            
            {/* For Clubs and Startups: Host Event CTA */}
            {(userType === 'startup' || userType === 'club') && (
              <div className="mt-10 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl p-6 shadow-lg text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg inline-block">
                      <CalendarRange className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-1">Ready to Host Your Own Event?</h3>
                    <p className="text-indigo-100">
                      Create and manage events to connect with students and grow your network.
                    </p>
                  </div>
                  <button 
                    onClick={handleHostEvent}
                    className="px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 transition-colors rounded-lg shadow-md font-medium"
                  >
                    Host an Event
                    <ArrowRight className="h-4 w-4 ml-2 inline" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event, userType }) => {
  const router = useRouter();
  
  // Format date range or single date
  const formatDateRange = (start, end) => {
    const startDate = new Date(start);
    
    if (!end || startDate.toDateString() === new Date(end).toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(end)}`;
  };
  
  // Get event type icon
  const getEventTypeIcon = (type) => {
    const eventIcons = {
      'hackathon': Code,
      'conference': Presentation,
      'symposium': Target,
      'workshop': Laptop,
      'expo': Globe2,
      'cultural event': Music,
      'pitch event': Megaphone,
      'job fair': Briefcase,
      'networking': UserPlus,
      'expert lecture': Presentation,
      'music fest': Music,
      'ngo event': Heart,
    };
    
    const normalizedType = type?.toLowerCase() || '';
    const Icon = eventIcons[normalizedType] || Calendar;
    return Icon;
  };
  
  // Determine if event is happening now
  const isLive = () => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate || event.startDate);
    return now >= start && now <= end;
  };
  
  // Get organizer icon based on source
  const getOrganizerIcon = () => {
    return event.source === 'club' ? School : Building;
  };
  
  const TypeIcon = getEventTypeIcon(event.type);
  const OrganizerIcon = getOrganizerIcon();
  
  const handleJoinEvent = () => {
    // For students, navigate to join event page
    if (userType === 'student') {
      router.push(`/events/${event._id}/join`);
    } else {
      // For clubs/startups, just view details
      router.push(`/events/${event._id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleJoinEvent}
    >
      {/* Event Image with Overlay and Type Badge */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-900 to-blue-700">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-700 flex items-center">
          <TypeIcon className="w-3 h-3 mr-1" />
          {event.type || 'Event'}
        </div>
        
        {/* Live Badge */}
        {isLive() && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 rounded-full text-xs font-medium text-white flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Live Now
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium flex items-center">
          {event.isFree ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span className="text-indigo-700">{event.price || 'Paid'}</span>
          )}
        </div>
        
        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDateRange(event.startDate, event.endDate)}
        </div>
      </div>
      
      {/* Event Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <OrganizerIcon className="h-4 w-4 mr-1" />
          <span>{event.organizer}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags && event.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{event.maxAttendees} attendees</span>
          </div>
          
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              userType === 'student' 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {userType === 'student' ? 'Join Event' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;