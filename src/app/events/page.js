'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar,
  Users,
  MapPin,
  Search,
  TrendingUp,
  Star,
  Clock,
  Building2,
  Sparkles,
  Globe2,
  MessageSquare,
  Bell,
  Menu,
  Filter,
  ChevronDown,
  Share2,
  MoreHorizontal,
  CalendarRange,
  BadgeCheck,
  Laptop,
  UserPlus,
  Target,
  Ticket,
  Music,
  Heart,
  Briefcase,
  Code,
  Presentation,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
    'San Francisco, CA',
    'New York, NY',
    'Boston, MA',
    'Austin, TX',
    'Virtual Event',
    'Hybrid - London'
  ];

  const tags = [
    'Innovation',
    'AI/ML',
    'Blockchain',
    'Web3',
    'Sustainability',
    'FinTech',
    'Healthcare',
    'EdTech',
    'Social Impact',
    'Networking',
    'Career Growth',
    'Startup'
  ];

  const mockEvents = [];
  
  for (let i = 1; i <= 20; i++) {
    const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isVirtual = Math.random() > 0.7;
    const isHybrid = !isVirtual && Math.random() > 0.8;
    const mode = isVirtual ? 'Virtual' : isHybrid ? 'Hybrid' : 'In-Person';
    
    const event = {
      id: i,
      title: `${randomEventType.type} ${Math.random() > 0.5 ? '2025' : ''} - ${['Global', 'Tech', 'Innovation', 'Future'][Math.floor(Math.random() * 4)]} ${randomEventType.type}`,
      description: `Join us for an exciting ${randomEventType.type.toLowerCase()} focusing on innovation and collaboration in the startup ecosystem`,
      date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      time: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'} EST`,
      location: locations[Math.floor(Math.random() * locations.length)],
      type: randomEventType.type,
      typeIcon: randomEventType.icon,
      mode: mode,
      organizer: ['TechHub', 'StartupNet', 'InnovateNow', 'FutureWorks'][Math.floor(Math.random() * 4)],
      isSpotlight: Math.random() > 0.8,
      isTrending: Math.random() > 0.8,
      isEarlyBird: Math.random() > 0.8,
      tags: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => 
        tags[Math.floor(Math.random() * tags.length)]
      ),
      imageUrl: `https://cdn.textstudio.com/output/sample/normal/6/3/2/5/event-logo-182-5236.png`,
      price: Math.random() > 0.5 ? 'Free' : `$${Math.floor(Math.random() * 200) + 49}`,
      attendees: Math.floor(Math.random() * 1000) + 100,
      maxCapacity: Math.floor(Math.random() * 2000) + 500,
      organization: {
        name: ['TechHub', 'StartupNet', 'InnovateNow', 'FutureWorks'][Math.floor(Math.random() * 4)],
        logo: '/api/placeholder/100/100'
      }
    };
    mockEvents.push(event);
  }
  
  return mockEvents;
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
    date: null,
  });

  const eventsPerPage = 9;
  const sections = [
    { id: 'all', label: 'All Events', icon: Calendar },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarRange },
    { id: 'trending', label: 'Trending', icon: TrendingUp }
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
      { id: 'cultural', label: 'Cultural Event', icon: Music },
      { id: 'non-profit', label: 'Non-Profit', icon: Heart }
    ],
    mode: [
      { id: 'in-person', label: 'In-Person', icon: MapPin },
      { id: 'virtual', label: 'Virtual', icon: Globe2 },
      { id: 'hybrid', label: 'Hybrid', icon: Laptop }
    ],
    price: [
      { id: 'free', label: 'Free', icon: Sparkles },
      { id: 'paid', label: 'Paid', icon: Ticket },
      { id: 'early-bird', label: 'Early Bird', icon: Clock }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchedEvents = generateMockEvents();
    setEvents(fetchedEvents);
  }, []);

  // Filter and search logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedFilters.type.length === 0 ||
      selectedFilters.type.includes(event.type.toLowerCase());

    const matchesMode = selectedFilters.mode.length === 0 ||
      selectedFilters.mode.includes(event.mode.toLowerCase());

    const matchesPrice = selectedFilters.price.length === 0 ||
      (selectedFilters.price.includes('free') && event.price === 'Free') ||
      (selectedFilters.price.includes('paid') && event.price !== 'Free') ||
      (selectedFilters.price.includes('early-bird') && event.isEarlyBird);

    return matchesSearch && matchesType && matchesMode && matchesPrice;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar component goes here - keeping existing navbar code */}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">
              Discover & Join Amazing Events
            </h1>
            <p className="text-lg text-indigo-100 mb-8">
              Connect with innovators, showcase your talents, and grow your network through exciting events in the startup ecosystem
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/host-event"
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Calendar className="w-5 h-5" />
                Host Event
              </Link>

              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, topics, tags..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-indigo-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>

            {/* Quick Stats */}
            {/*}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Active Events', value: '200+', icon: Calendar },
                { label: 'Registered Users', value: '10K+', icon: Users },
                { label: 'Cities', value: '50+', icon: MapPin },
                { label: 'Organizations', value: '500+', icon: Building2 }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-4">
                  <stat.icon className="w-6 h-6 text-indigo-200 mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-indigo-200">{stat.label}</div>
                </div>
              ))}
            </div>
            {*/}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Tabs & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(filterOptions).map(([category, options]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedFilters(prev => ({
                            ...prev,
                            [category]: prev[category].includes(option.id)
                              ? prev[category].filter(id => id !== option.id)
                              : [...prev[category], option.id]
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${
                          selectedFilters[category].includes(option.id)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:text-gray-400 disabled:border-gray-100 hover:bg-gray-50 disabled:hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:text-gray-400 disabled:border-gray-100 hover:bg-gray-50 disabled:hover:bg-white"
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
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const TypeIcon = event.typeIcon;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
      <div className="relative">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Event Badges */}
        <div className="absolute top-4 right-4 flex flex-row gap-2">
          {event.isSpotlight && (
            <div className="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-medium rounded-full flex items-center gap-1">
              <Star className="w-4 h-4" />
              Featured
            </div>
          )}
          {event.isTrending && (
            <div className="px-3 py-1 bg-rose-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Trending
            </div>
          )}
          {event.isEarlyBird && (
            <div className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Early Bird
            </div>
          )}
        </div>
        
        {/* Event Title & Description */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <p className="text-gray-200 text-sm line-clamp-2">{event.description}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Event Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <TypeIcon className="w-4 h-4 text-indigo-600" />
            <span>{event.type}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{event.attendees} / {event.maxCapacity}</span>
          </div>
        </div>

 {/* Event Tags */}
<div className="flex gap-2 mb-6 flex-wrap">
  {event.tags.map((tag, index) => (
    <span
      // Use combination of event.id and index for unique key
      key={`${event.id}-tag-${index}`}
      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
    >
      {tag}
    </span>
  ))}
</div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Register
            </button>
            <button className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${
              event.price === 'Free' ? 'text-green-600' : 'text-gray-900'
            }`}>
              {event.price}
            </span>
            <button className="p-2.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;