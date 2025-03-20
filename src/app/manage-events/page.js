'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Code, Users, Music, Laptop, 
  Sparkles, Globe2, Building, School, 
  ArrowLeft, ArrowRight, AlertCircle, Trophy,
  FileText, CheckCircle2, Tag, Lightbulb, Star,
  DollarSign, Award, Filter, ChevronsUpDown,
  ListChecks, Clock, MapPin, Rocket, Gift, 
  Pencil, Trash2, Eye, MoreHorizontal, Search,
  Plus, Settings, ChevronDown, Bell, BarChart3,
  UserPlus, CalendarDays, PartyPopper, ExternalLink
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';

const ManageEventsPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data for demonstration
  const mockEvents = [
    {
      id: 'hack-1',
      title: 'TechHacks 2024',
      description: 'A 24-hour coding competition for innovative solutions',
      type: 'hackathon',
      startDate: '2024-06-15T09:00:00',
      endDate: '2024-06-16T09:00:00',
      venue: 'Tech Hub, Building A',
      mode: 'in-person',
      status: 'upcoming',
      participants: 78,
      maxParticipants: 100,
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['ai', 'web', 'blockchain'],
      prizePool: 50000,
      visibility: 'public',
      createdAt: '2024-03-10T14:30:00'
    },
    {
      id: 'hack-2',
      title: 'AI Innovation Challenge',
      description: 'Build the next generation of AI applications',
      type: 'hackathon',
      startDate: '2024-07-20T10:00:00',
      endDate: '2024-07-21T22:00:00',
      venue: 'Virtual',
      mode: 'virtual',
      status: 'upcoming',
      participants: 45,
      maxParticipants: 200,
      thumbnail: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['ai', 'cloud', 'beginner'],
      prizePool: 75000,
      visibility: 'public',
      createdAt: '2024-03-15T09:45:00'
    },
    {
      id: 'hack-3',
      title: 'Blockchain Builders Weekend',
      description: 'Create decentralized applications that solve real problems',
      type: 'hackathon',
      startDate: '2024-05-10T08:00:00',
      endDate: '2024-05-12T20:00:00',
      venue: 'Innovation Center',
      mode: 'hybrid',
      status: 'active',
      participants: 120,
      maxParticipants: 150,
      thumbnail: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['blockchain', 'web3', 'fintech'],
      prizePool: 100000,
      visibility: 'public',
      createdAt: '2024-02-28T11:20:00'
    },
    {
      id: 'hack-4',
      title: 'Mobile App Hackathon',
      description: 'Design and develop innovative mobile applications',
      type: 'hackathon',
      startDate: '2024-04-05T09:00:00',
      endDate: '2024-04-06T21:00:00',
      venue: 'Tech Campus',
      mode: 'in-person',
      status: 'completed',
      participants: 85,
      maxParticipants: 100,
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['mobile', 'ui', 'ux'],
      prizePool: 60000,
      visibility: 'public',
      createdAt: '2024-01-20T16:15:00'
    },
    {
      id: 'hack-5',
      title: 'Sustainability Hackathon',
      description: 'Build tech solutions for environmental challenges',
      type: 'hackathon',
      startDate: '2024-03-01T08:00:00',
      endDate: '2024-03-02T20:00:00',
      venue: 'Green Tech Hub',
      mode: 'in-person',
      status: 'completed',
      participants: 65,
      maxParticipants: 80,
      thumbnail: 'https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['sustainability', 'iot', 'cloud'],
      prizePool: 40000,
      visibility: 'public',
      createdAt: '2024-01-05T10:30:00'
    },
    {
      id: 'hack-6',
      title: 'Draft: Healthcare Innovation',
      description: 'Developing solutions for healthcare challenges',
      type: 'hackathon',
      startDate: '',
      endDate: '',
      venue: '',
      mode: 'in-person',
      status: 'draft',
      participants: 0,
      maxParticipants: 100,
      thumbnail: null,
      tags: ['healthcare', 'ai'],
      prizePool: 50000,
      visibility: 'private',
      createdAt: '2024-03-18T13:45:00'
    }
  ];

  // Get user type from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserType(parsedUser.type);
        setUserName(parsedUser.name || 'User');
      }
      
      // Simulate API call to fetch events
      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  }, []);

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      // Filter by search query
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      
      // Filter by type
      const matchesType = filterType === 'all' || event.type === filterType;
      
      // Filter by active tab
      const matchesTab = (activeTab === 'upcoming' && (event.status === 'upcoming' || event.status === 'draft')) ||
                         (activeTab === 'active' && event.status === 'active') ||
                         (activeTab === 'completed' && event.status === 'completed') ||
                         (activeTab === 'all');
      
      return matchesSearch && matchesStatus && matchesType && matchesTab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.startDate || a.createdAt) - new Date(b.startDate || b.createdAt);
        case 'date-desc':
          return new Date(b.startDate || b.createdAt) - new Date(a.startDate || a.createdAt);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'participants-asc':
          return a.participants - b.participants;
        case 'participants-desc':
          return b.participants - a.participants;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, you would make an API call to delete the event
    setEvents(events.filter(event => event.id !== eventToDelete.id));
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'hackathon':
        return <Code className="h-5 w-5 text-blue-500" />;
      case 'workshop':
        return <Laptop className="h-5 w-5 text-green-500" />;
      case 'cultural':
        return <PartyPopper className="h-5 w-5 text-purple-500" />;
      default:
        return <Calendar className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getEventStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Upcoming
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Trophy className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Pencil className="w-3 h-3 mr-1" />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!userType || (userType !== 'startup' && userType !== 'club')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Navbar forceLight={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">Only startups and clubs can manage events.</p>
            <button
              onClick={() => router.push('/events')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      {/* Hero Section with animated elements */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          
          {/* Floating icons */}
          <div className="absolute top-20 left-16 text-white/20 animate-float">
            <Calendar className="h-8 w-8" />
          </div>
          <div className="absolute top-32 right-24 text-white/20 animate-float" style={{ animationDelay: '1s' }}>
            <Trophy className="h-8 w-8" />
          </div>
          <div className="absolute bottom-24 left-36 text-white/20 animate-float" style={{ animationDelay: '2s' }}>
            <Laptop className="h-8 w-8" />
          </div>
          <div className="absolute top-60 right-40 text-white/20 animate-float" style={{ animationDelay: '3s' }}>
            <Music className="h-8 w-8" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-block animate-bounce-slow mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-4">
              <Settings className="h-10 w-10 text-blue-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Manage Your <span className="text-blue-300">Events</span>
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Create, edit, and track all your events in one place. 
            Monitor registrations and engage with participants.
          </p>
          
          {/* Quick Stats */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-200" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{events.filter(e => e.status === 'upcoming' || e.status === 'draft').length}</h3>
              <p className="text-indigo-200">Upcoming Events</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-200" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {events.reduce((total, event) => total + event.participants, 0)}
              </h3>
              <p className="text-indigo-200">Total Participants</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Trophy className="h-6 w-6 text-blue-200" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {events.filter(e => e.status === 'completed').length}
              </h3>
              <p className="text-indigo-200">Completed Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative -mt-8">
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Drafts</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="hackathon">Hackathons</option>
                  <option value="workshop">Workshops</option>
                  <option value="cultural">Cultural Events</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                  <option value="participants-desc">Most Participants</option>
                  <option value="participants-asc">Least Participants</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <Link href="/host-event" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming & Drafts
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Events
              </button>
            </nav>
          </div>
        </div>
        
        {/* Events List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "No events match your search criteria." 
                : activeTab === 'upcoming' 
                  ? "You don't have any upcoming events. Create one now!" 
                  : activeTab === 'active'
                    ? "You don't have any active events."
                    : activeTab === 'completed'
                      ? "You don't have any completed events yet."
                      : "You haven't created any events yet."}
            </p>
            <Link href="/host-event" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200">
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-indigo-100 group">
                {/* Event Image */}
                <div className="relative h-48 bg-indigo-100 overflow-hidden">
                  {event.thumbnail ? (
                    <img 
                      src={event.thumbnail} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600">
                      {getEventTypeIcon(event.type)}
                      <span className="sr-only">{event.type}</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {getEventStatusBadge(event.status)}
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-indigo-800 backdrop-blur-sm">
                      {getEventTypeIcon(event.type)}
                      <span className="ml-1 capitalize">{event.type}</span>
                    </span>
                  </div>
                </div>
                
                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-6">
                    {event.startDate && (
                      <div className="flex items-start text-sm">
                        <Calendar className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">
                          {formatDate(event.startDate)}
                          {event.endDate && ` - ${formatDate(event.endDate)}`}
                        </span>
                      </div>
                    )}
                    
                    {event.venue && (
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{event.venue}</span>
                      </div>
                    )}
                    
                    <div className="flex items-start text-sm">
                      <Users className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">
                        {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} participants
                      </span>
                      </div>
                    
                    {event.mode && (
                      <div className="flex items-start text-sm">
                        <Globe2 className="h-4 w-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 capitalize">{event.mode}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {event.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/events/${event.id}`} 
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      <Link 
                        href={`/manage-events/edit/${event.id}`} 
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteEvent(event)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination - can be implemented if needed */}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Event</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default ManageEventsPage;