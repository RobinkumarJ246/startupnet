'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/landing/Navbar';
import { 
  Users, Trophy, CheckCircle2, Clock, Sparkles, 
  ArrowLeft, Laptop, Code, Calendar, FileText,
  Settings, UserPlus, Send, BarChart3, AlertCircle
} from 'lucide-react';

export default function HackathonManagePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch hackathon data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Find the hackathon from mock data
      const mockHackathon = mockHackathons.find(h => h.id === id) || mockHackathons[0];
      setHackathon(mockHackathon);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Mock data for the hackathon
  const mockHackathons = [
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
      hasSubmissions: false,
      teams: [],
      judges: [
        { id: 'j1', name: 'Alex Johnson', email: 'alex@example.com', company: 'TechCorp', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 'j2', name: 'Sarah Williams', email: 'sarah@example.com', company: 'InnovateX', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
      ],
      sponsors: [
        { id: 's1', name: 'TechGiant', logo: 'https://via.placeholder.com/150?text=TechGiant', tier: 'gold' },
        { id: 's2', name: 'Innovators Inc', logo: 'https://via.placeholder.com/150?text=InnovatorsInc', tier: 'silver' }
      ],
      timeline: [
        { id: 't1', title: 'Registration Open', date: '2024-05-01T00:00:00', completed: true },
        { id: 't2', title: 'Registration Close', date: '2024-06-10T23:59:59', completed: false },
        { id: 't3', title: 'Hackathon Begins', date: '2024-06-15T09:00:00', completed: false },
        { id: 't4', title: 'Hackathon Ends', date: '2024-06-16T09:00:00', completed: false },
        { id: 't5', title: 'Judging Period', date: '2024-06-16T10:00:00', completed: false },
        { id: 't6', title: 'Winners Announced', date: '2024-06-16T17:00:00', completed: false }
      ]
    }
  ];
  
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
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Hackathon not found
  if (!hackathon) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Hackathon Not Found</h1>
            <p className="text-gray-600 mb-8">The hackathon you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => router.push('/manage-events')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
    <div className="min-h-screen bg-gray-50">
      <Navbar forceLight={true} />
      
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <button
                onClick={() => router.push('/manage-events')}
                className="inline-flex items-center p-2 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{hackathon.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Code className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">Hackathon</span>
                  <span className="text-gray-300">•</span>
                  {hackathon.status === 'upcoming' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Upcoming
                    </span>
                  )}
                  {hackathon.status === 'active' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  )}
                  {hackathon.status === 'completed' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href={`/events/${hackathon.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View Public Page
              </Link>
              <Link 
                href={`/host-event/hackathon?edit=${hackathon.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Hackathon
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-semibold text-gray-900">{hackathon.participants}/{hackathon.maxParticipants}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{hackathon.applications || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Submissions</p>
                <p className="text-2xl font-semibold text-gray-900">{hackathon.submissionsCount || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Prize Pool</p>
                <p className="text-2xl font-semibold text-gray-900">${hackathon.prizePool?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'participants'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Participants
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'submissions'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submissions
              </button>
              <button
                onClick={() => setActiveTab('judges')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'judges'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Judges
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'timeline'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Hackathon Overview</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Hackathon Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-sm text-gray-900 mt-1">{hackathon.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="text-sm text-gray-900 mt-1">{formatDate(hackathon.startDate)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="text-sm text-gray-900 mt-1">{formatDate(hackathon.endDate)}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Venue</p>
                            <p className="text-sm text-gray-900 mt-1">{hackathon.venue || 'Not specified'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Mode</p>
                            <p className="text-sm text-gray-900 mt-1 capitalize">{hackathon.mode}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Registration Status</p>
                          <div className="mt-1">
                            {hackathon.registrationOpen ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Open
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Closed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Quick Actions</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          {hackathon.registrationOpen ? 'Close Registration' : 'Open Registration'}
                        </button>
                        
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Send Announcement
                        </button>
                        
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Add Judge
                        </button>
                        
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Update Timeline
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Timeline</h3>
                      
                      <div className="space-y-6 mt-4">
                        {hackathon.timeline.map((item, index) => (
                          <div key={item.id} className="relative">
                            {index < hackathon.timeline.length - 1 && (
                              <div className="absolute top-5 left-5 h-full w-0.5 bg-gray-200"></div>
                            )}
                            
                            <div className="relative flex items-start">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                item.completed 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {item.completed ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <Clock className="h-5 w-5" />
                                )}
                              </div>
                              
                              <div className="ml-4">
                                <p className={`text-sm font-medium ${
                                  item.completed ? 'text-green-800' : 'text-gray-900'
                                }`}>
                                  {item.title}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {formatDate(item.date)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'participants' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Participants</h2>
                <p className="text-gray-600">This section will show participant management features.</p>
              </div>
            )}
            
            {activeTab === 'submissions' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Submissions</h2>
                <p className="text-gray-600">This section will show submission management features.</p>
              </div>
            )}
            
            {activeTab === 'judges' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Judges</h2>
                <p className="text-gray-600">This section will show judge management features.</p>
              </div>
            )}
            
            {activeTab === 'timeline' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
                <p className="text-gray-600">This section will show timeline management features.</p>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
                <p className="text-gray-600">This section will show analytics features.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 