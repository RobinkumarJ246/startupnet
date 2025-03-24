'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Users, Edit, Trash2, 
  Eye, Settings, CheckCircle2, X, Clock, 
  MapPin, Award, FileText, Mail, Send, 
  User, UserPlus, ListChecks, BarChart3, 
  MessageSquare, Download, Upload
} from 'lucide-react';
import Navbar from '../../components/landing/Navbar';

export default function ManageEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
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
      createdAt: '2024-03-10T14:30:00',
      applications: 85,
      approvedApplications: 78,
      registrationOpen: true,
      pendingTasks: 3,
      hasSubmissions: false
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
      createdAt: '2024-02-28T11:20:00',
      applications: 142,
      approvedApplications: 120,
      registrationOpen: false,
      pendingTasks: 0,
      hasSubmissions: true,
      submissionsCount: 45
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
      createdAt: '2024-01-20T16:15:00',
      applications: 90,
      approvedApplications: 85,
      registrationOpen: false,
      pendingTasks: 0,
      hasSubmissions: true,
      submissionsCount: 80,
      winners: [
        {id: 'team-1', name: 'MobileMasters', prize: 'First Place', amount: 30000},
        {id: 'team-2', name: 'AppVision', prize: 'Second Place', amount: 20000},
        {id: 'team-3', name: 'CodeCrafters', prize: 'Third Place', amount: 10000}
      ]
    }
  ];

  useEffect(() => {
    if (eventId) {
      // Simulate API call to fetch event
      setTimeout(() => {
        const foundEvent = mockEvents.find(e => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          // If no event found, redirect to manage events page
          router.push('/manage-events');
        }
        setLoading(false);
      }, 800);
    }
  }, [eventId, router]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render event status badge
  const renderStatusBadge = (status) => {
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
            <Calendar className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Edit className="w-3 h-3 mr-1" />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  // Dashboard statistic card component
  const StatCard = ({ icon, title, value, footer, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      amber: "bg-amber-50 text-amber-700 border-amber-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      pink: "bg-pink-50 text-pink-700 border-pink-200",
    };
    
    return (
      <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-white mr-3">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
        {footer && (
          <div className="mt-3 text-xs">{footer}</div>
        )}
      </div>
    );
  };

  // Action Button component
  const ActionButton = ({ icon, label, onClick, color = "indigo", disabled = false }) => {
    const baseClasses = "inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
    const colorClasses = {
      indigo: "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
      gray: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
      amber: "border-amber-600 bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500",
      red: "border-red-600 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      green: "border-green-600 bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    };
    
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${colorClasses[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </button>
    );
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Event Overview Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{event.title}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{event.description}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Event Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{event.type}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{event.venue}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mode</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{event.mode}</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Visibility</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{event.visibility}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                icon={<Users className="h-5 w-5 text-blue-700" />}
                title="Participants"
                value={`${event.participants}/${event.maxParticipants || '∞'}`}
                footer={`${event.approvedApplications} approved out of ${event.applications} applications`}
                color="blue"
              />
              
              {event.type === 'hackathon' && (
                <StatCard 
                  icon={<Award className="h-5 w-5 text-amber-700" />}
                  title="Prize Pool"
                  value={`$${event.prizePool.toLocaleString()}`}
                  color="amber"
                />
              )}
              
              {event.hasSubmissions && (
                <StatCard 
                  icon={<FileText className="h-5 w-5 text-green-700" />}
                  title="Submissions"
                  value={event.submissionsCount || 0}
                  color="green"
                />
              )}
              
              {event.status === 'completed' && event.winners && (
                <StatCard 
                  icon={<Award className="h-5 w-5 text-purple-700" />}
                  title="Winners Announced"
                  value={event.winners.length}
                  color="purple"
                />
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <ActionButton 
                  icon={<Edit className="h-4 w-4" />}
                  label="Edit Event"
                  onClick={() => {
                    if (event.type === 'hackathon') {
                      router.push(`/host-event/hackathon?edit=${event.id}`);
                    } else {
                      router.push(`/host-event?edit=${event.id}`);
                    }
                  }}
                  color="indigo"
                />
                
                <ActionButton 
                  icon={<Eye className="h-4 w-4" />}
                  label="View Public Page"
                  onClick={() => window.open(`/events/${event.id}`, '_blank')}
                  color="gray"
                />
                
                {event.status === 'upcoming' && (
                  <ActionButton 
                    icon={<Mail className="h-4 w-4" />}
                    label="Send Announcement"
                    onClick={() => alert('Send announcement feature')}
                    color="amber"
                  />
                )}
                
                {event.registrationOpen ? (
                  <ActionButton 
                    icon={<X className="h-4 w-4" />}
                    label="Close Registration"
                    onClick={() => alert('Registration closed')}
                    color="red"
                  />
                ) : event.status !== 'completed' && (
                  <ActionButton 
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Open Registration"
                    onClick={() => alert('Registration opened')}
                    color="green"
                  />
                )}
              </div>
            </div>
          </div>
        );
      
      case 'participants':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Participants Management</h3>
            <p className="text-gray-500">Here you can manage participants, approve applications, and organize teams.</p>
            
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-medium">Registered Participants ({event.participants})</h4>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-white border rounded text-gray-700 hover:bg-gray-50">
                    Export CSV
                  </button>
                  <button className="px-3 py-1 text-xs bg-indigo-100 border border-indigo-200 rounded text-indigo-700 hover:bg-indigo-200">
                    Manage Teams
                  </button>
                </div>
              </div>
              
              <div className="p-8 text-center">
                <User className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">This is where participant data would be displayed.</p>
                <p className="text-sm text-gray-500">For this demo, we're showing placeholder content.</p>
              </div>
            </div>
          </div>
        );
      
      case 'submissions':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Management</h3>
            <p className="text-gray-500">Review and manage project submissions from participants.</p>
            
            {event.hasSubmissions ? (
              <div className="mt-6 border rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-medium">Submissions ({event.submissionsCount || 0})</h4>
                  <button className="px-3 py-1 text-xs bg-white border rounded text-gray-700 hover:bg-gray-50">
                    Export All
                  </button>
                </div>
                
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-600">This is where submission data would be displayed.</p>
                  <p className="text-sm text-gray-500">For this demo, we're showing placeholder content.</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-8 text-center border rounded-lg">
                <FileText className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600">No submissions yet</p>
                {event.status === 'upcoming' ? (
                  <p className="text-sm text-gray-500 mt-1">Submissions will appear here once the event starts.</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">Configure submission requirements to allow participants to submit their work.</p>
                )}
              </div>
            )}
          </div>
        );
      
      case 'communication':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Hub</h3>
            <p className="text-gray-500">Send announcements and communicate with participants.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                  Email Announcements
                </h4>
                <p className="text-sm text-gray-600 mb-4">Send important updates and announcements to all participants.</p>
                <button className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Compose Announcement
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                  Discussion Board
                </h4>
                <p className="text-sm text-gray-600 mb-4">Community space for participants to ask questions and share ideas.</p>
                <button className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50">
                  View Discussions
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Event Analytics</h3>
            <p className="text-gray-500">Track performance metrics for your event.</p>
            
            <div className="mt-6 p-8 text-center border rounded-lg">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Analytics data would be displayed here</p>
              <p className="text-sm text-gray-500 mt-1">For this demo, we're showing placeholder content.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <p>Select a tab to view content</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
            <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => router.push('/manage-events')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back button and page header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/manage-events')}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Events
          </button>
          
          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">{event.title}</h1>
                {renderStatusBadge(event.status)}
              </div>
              <p className="text-gray-600 mt-1">{event.description}</p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <ActionButton 
                icon={<Edit className="h-4 w-4" />}
                label="Edit Event"
                onClick={() => {
                  if (event.type === 'hackathon') {
                    router.push(`/host-event/hackathon?edit=${event.id}`);
                  } else {
                    router.push(`/host-event?edit=${event.id}`);
                  }
                }}
                color="indigo"
              />
              
              <ActionButton 
                icon={<Eye className="h-4 w-4" />}
                label="View Public Page"
                onClick={() => window.open(`/events/${event.id}`, '_blank')}
                color="gray"
              />
            </div>
          </div>
        </div>
        
        {/* Event management tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('participants')}
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'participants'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Participants
              </button>
              
              {event.type === 'hackathon' && (
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'submissions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Submissions
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('communication')}
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'communication'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Communication
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 