'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Building, 
  Users, 
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Edit2,
  Settings,
  Bell,
  Shield,
  LogOut,
  ArrowLeft,
  Bookmark,
  Star,
  Award,
  Briefcase,
  Code,
  Heart,
  Share2,
  MessageCircle,
  Plus,
  ChevronRight,
  Edit,
  BookOpen,
  Clock
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import EditProfileModal from '../components/profile/EditProfileModal';
import ProfileHeader from '../components/profile/ProfileHeader';

// About Section
function AboutSection({ user }) {
  // Helper function to safely render array-like data
  const renderTags = (data) => {
    if (!data) return null;
    
    let items = [];
    if (typeof data === 'string') {
      // Handle comma-separated string
      items = data.split(',').map(item => item.trim()).filter(Boolean);
    } else if (Array.isArray(data)) {
      // Handle array
      items = data.map(item => item.trim ? item.trim() : String(item)).filter(Boolean);
    } else {
      // Can't render this format
      return <p className="text-center text-gray-400 py-2">Data available but in unsupported format</p>;
    }
    
    if (items.length === 0) {
      return <p className="text-center text-gray-400 py-2">No items to display</p>;
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span 
            key={index} 
            className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  // Helper function to safely get value from possibly complex data
  const getSafeValue = (value, defaultText = 'Not specified') => {
    if (value === null || value === undefined || value === '') {
      return defaultText;
    }
    
    if (typeof value === 'string') {
      // Check if this is a stringified JSON object
      if (value.startsWith('{') && value.endsWith('}')) {
        try {
          // Try to parse it as JSON
          const parsedValue = JSON.parse(value);
          
          // Handle location objects specifically
          if (parsedValue.street || parsedValue.city || parsedValue.state || parsedValue.country) {
            const parts = [];
            if (parsedValue.street) parts.push(parsedValue.street);
            if (parsedValue.city) parts.push(parsedValue.city);
            if (parsedValue.state) parts.push(parsedValue.state);
            if (parsedValue.country) parts.push(parsedValue.country);
            return parts.join(', ');
          }
          
          // Other objects, convert to string representation
          return Object.values(parsedValue).filter(Boolean).join(', ');
        } catch (e) {
          // If parsing fails, just return the original string
          return value;
        }
      }
      return value;
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // Handle location objects directly
    if (typeof value === 'object' && value !== null) {
      if (value.street || value.city || value.state || value.country) {
        const parts = [];
        if (value.street) parts.push(value.street);
        if (value.city) parts.push(value.city);
        if (value.state) parts.push(value.state);
        if (value.country) parts.push(value.country);
        return parts.join(', ');
      }
      
      // For other objects, join non-empty values
      return Object.values(value).filter(Boolean).join(', ');
    }
    
    return String(value);
  };

  // Different content based on user type
  const renderTypeSpecificContent = () => {
    switch (user.type) {
      case 'student':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Education</h3>
                    <p className="text-sm text-gray-500">{getSafeValue(user.college || user.university)}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Major: {getSafeValue(user.major)}</p>
                  <p>Graduation Year: {getSafeValue(user.graduationYear)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                    <p className="text-sm text-gray-500">Coming Soon</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="text-center text-gray-400 py-2">
                    We're working on building this feature to showcase your professional experience
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Interests</h3>
                    <p className="text-sm text-gray-500">Areas of Interest</p>
                  </div>
                </div>
                <div className="mt-4">
                  {user.interests ? renderTags(user.interests) : (
                    <p className="text-center text-gray-400 py-2">
                      Add your interests to connect with like-minded people
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      
      case 'startup':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Building className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Company Info</h3>
                    <p className="text-sm text-gray-500">{getSafeValue(user.companyName)}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Industry: {getSafeValue(user.industry)}</p>
                  <p>Stage: {getSafeValue(user.stage)}</p>
                  <p>Founded: {getSafeValue(user.foundingDate)}</p>
                  <p>Location: {getSafeValue(user.location)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Team</h3>
                    <p className="text-sm text-gray-500">Size & Structure</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Team Size: {getSafeValue(user.teamSize)}</p>
                  {user.hiringRoles && (
                    <div className="mt-2">
                      <p className="mb-1 font-medium">Hiring For:</p>
                      {renderTags(user.hiringRoles)}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Funding</h3>
                    <p className="text-sm text-gray-500">Investment Status</p>
                  </div>
                </div>
                {user.funding ? (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Round: {user.fundingRound || 'Not specified'}</p>
                    <p>Amount Raised: {user.fundingAmount || 'Not specified'}</p>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="text-center text-gray-400 py-2">
                      Add your funding information
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      
      case 'club':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Club Info</h3>
                    <p className="text-sm text-gray-500">{getSafeValue(user.clubName)}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Parent Organization: {getSafeValue(user.parentOrganization)}</p>
                  <p>Founded: {getSafeValue(user.foundedYear)}</p>
                  <p>Member Count: {getSafeValue(user.memberCount)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Clock className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Activities</h3>
                    <p className="text-sm text-gray-500">Club Events & Programs</p>
                  </div>
                </div>
                {user.events ? (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>{typeof user.events === 'string' ? user.events : 'Events information available'}</p>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="text-center text-gray-400 py-2">
                      Add your club's activities and events
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Focus Areas</h3>
                    <p className="text-sm text-gray-500">Club Interests</p>
                  </div>
                </div>
                <div className="mt-4">
                  {user.focusAreas ? renderTags(user.focusAreas) : (
                    <p className="text-center text-gray-400 py-2">
                      Add your club's focus areas
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <div className="text-center py-6">
            <p className="text-gray-500">User type not recognized</p>
          </div>
        );
    }
  };

  return (
    <div>
      {renderTypeSpecificContent()}
      
      {/* Posts Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
              <p className="text-sm text-gray-500">Share your thoughts and ideas</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <MessageCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h4>
          <p className="text-gray-500 max-w-md">
            Posts you create will appear here. Share updates, articles, and more with your network.
          </p>
        </div>
      </div>

      {/* Remove duplicate location section - Only show if not a startup since they already have location in their main info */}
      {user.type !== 'startup' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {user.location ? (
              <p>{user.location}</p>
            ) : (
              <p className="text-gray-400 italic">No location specified</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Placeholder components for other tabs
function AchievementsSection() {
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <Award className="h-8 w-8 text-yellow-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Achievements Coming Soon</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Track your milestones, badges, and recognitions from the community.
      </p>
    </div>
  );
}

function ConnectionsSection() {
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Users className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Connections Coming Soon</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Connect with other students, startups, and clubs to grow your network.
      </p>
    </div>
  );
}

function ActivitySection() {
  // Activity section showing potential activities
  const activityItems = [
    { 
      type: 'post', 
      title: 'Posts', 
      description: 'Your published posts will appear here', 
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      bgColor: 'bg-blue-100',
      coming: true
    },
    { 
      type: 'comment', 
      title: 'Comments & Reactions', 
      description: 'Activity on posts and discussions you participate in', 
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      bgColor: 'bg-pink-100',
      coming: true
    },
    { 
      type: 'event', 
      title: 'Events', 
      description: 'Events you have attended or plan to attend', 
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-100',
      coming: true
    }
  ];

  return (
    <div className="space-y-8">
      {activityItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center">
            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mr-4`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
          
          <div className="p-6 text-center">
            {item.coming ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  {item.icon}
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h4>
                <p className="text-gray-500 max-w-md">
                  We're working on this feature. Stay tuned for updates!
                </p>
              </div>
            ) : (
              <p className="text-gray-400 py-8">No recent activity</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // Process any complex objects to ensure they don't cause rendering issues
        const processedUser = {...parsedUser};
        
        // Don't stringify complex objects as that causes rendering issues
        // Instead, let the formatValue functions in the components handle them
        setUser(processedUser);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      // Don't stringify objects in the data as they'll be handled by the API
      const processedData = {...updatedData};

      console.log('Sending profile update data:', processedData);
      
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('Updated profile data received:', data);
      
      // Store and set the updated user data directly
      const processedUser = {...data.user};
      setUser(processedUser);
      localStorage.setItem('user', JSON.stringify(processedUser));
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar forceLight={true} />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
          
          {/* Profile Header Component */}
          <ProfileHeader user={user} onEditClick={handleEditProfile} />

          {/* Tabs Navigation */}
          <div className="bg-white mb-8 rounded-xl overflow-hidden shadow">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'achievements'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Achievements
                </button>
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'connections'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Connections
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'activity'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Activity
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'about' && <AboutSection user={user} />}
              {activeTab === 'achievements' && <AchievementsSection />}
              {activeTab === 'connections' && <ConnectionsSection />}
              {activeTab === 'activity' && <ActivitySection />}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        user={user}
        onSave={handleProfileUpdate}
      />
    </main>
  );
} 