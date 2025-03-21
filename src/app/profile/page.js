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
  Clock,
  Check
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import EditProfileModal from '../components/profile/EditProfileModal';
import ProfileHeader from '../components/profile/ProfileHeader';
import { useAuth } from '../lib/auth/AuthContext';
import { ProfileSkeleton } from '../components/shared/SkeletonLoader';
import AccountSettingsModal from '../components/profile/AccountSettingsModal';

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
                    <p className="text-sm text-gray-500">
                      {user.college ? (
                        <>
                          {user.college.split('(Id:')[0].trim()}
                          {user.university && (
                            <span className="block text-xs text-indigo-600">
                              Affiliated to {user.university}
                            </span>
                          )}
                        </>
                      ) : user.university ? (
                        user.university
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Major: {getSafeValue(user.major)}</p>
                  <p>Graduation Year: {getSafeValue(user.graduationYear)}</p>
                  <p>Degree: {getSafeValue(user.degree)}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                    <p className="text-sm text-gray-500">Technical & Soft Skills</p>
                  </div>
                </div>
                <div className="mt-4">
                  {user.skills ? renderTags(user.skills) : (
                    <p className="text-center text-gray-400 py-2">
                      Add your skills to showcase your abilities
                    </p>
                  )}
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
            
            {/* Bio/About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow mb-8">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <User className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">About Me</h3>
                  <p className="text-sm text-gray-500">Bio & Personal Information</p>
                </div>
              </div>
              <div className="prose max-w-none">
                {user.bio ? (
                  <p className="text-gray-700">{user.bio}</p>
                ) : (
                  <p className="text-center text-gray-400 py-2">
                    Add a bio to tell others about yourself
                  </p>
                )}
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
                  <p>Parent Organization: {
                    user.clubType === 'university' ? (
                      <>
                        University Club at {user.college ? user.college : user.university || 'Not specified'}
                      </>
                    ) : (
                      getSafeValue(user.parentOrganization)
                    )
                  }</p>
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
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  const { logout, validateSession } = useAuth();

  // Show notification with auto-dismiss
  const showStatusNotification = (message, isError = false) => {
    setNotification(message);
    setShowNotification(true);
    setError(isError ? message : '');
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const loadUserProfile = async () => {
    console.log("Loading user profile...");
    setLoading(true);
    setConnectionError(false);
    
    try {
      // Get the user data from localStorage first for faster UI display
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.log("No user data in localStorage, redirecting to login");
        router.push('/login');
        return;
      }
      
      // Parse and display the user data we have
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Then try to validate session in the background
      try {
        console.log("Validating session...");
        const isValid = await validateSession();
        console.log("Session validation result:", isValid);
        
        // If validation completely fails, we still have the localStorage data
        // So the user can continue using the app with limited functionality
      } catch (error) {
        console.error("Session validation error:", error);
        // Check if it's a MongoDB connection error
        if (error.message && 
            (error.message.includes('MongoDB connection error') || 
             error.message.includes('MongoNetworkError') ||
             error.message.includes('ECONNREFUSED') ||
             error.message.includes('certificate') ||
             error.message.includes('SSL'))) {
          setConnectionError(true);
          showStatusNotification("Database connection error. Some features may be limited.", true);
        }
        // Don't redirect on validation error - we already have the localStorage data
      }
      
      try {
        // Try to fetch the profile image
        console.log("Fetching profile image...");
        const imageResponse = await fetch(`/api/profile/image/${parsedUser.id}`);
        
        if (imageResponse.ok) {
          const imageUrl = `/api/profile/image/${parsedUser.id}`;
          
          // Update the user object with the image URL
          setUser(prevUser => ({
            ...prevUser,
            profileImageUrl: imageUrl
          }));
        }
      } catch (error) {
        console.error('Failed to fetch profile image:', error);
        // Continue without the image
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (error.message && 
          (error.message.includes('MongoDB connection error') || 
           error.message.includes('MongoNetworkError') ||
           error.message.includes('ECONNREFUSED') ||
           error.message.includes('certificate') ||
           error.message.includes('SSL'))) {
        setConnectionError(true);
        setError('Database connection error. Please try again later.');
      } else {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
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
      
      // Show success notification
      showStatusNotification('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      showStatusNotification(`Failed to update profile: ${err.message}`, true);
      throw err;
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  // Handle account deletion
  const handleAccountDeleted = () => {
    // The AuthContext will handle redirect after API response
    logout();
  };

  // Function to share the profile with a public URL
  const handleShareProfile = () => {
    if (user) {
      setIsCopying(true);
      // Use either _id or id, depending on what's available
      const userId = user._id || user.id;
      
      if (!userId) {
        console.error('No user ID available for sharing');
        setIsCopying(false);
        return;
      }
      
      const url = `${window.location.origin}/profile/${userId}`;
      setShareUrl(url);
      
      navigator.clipboard.writeText(url).then(
        () => {
          setCopySuccess(true);
          setIsCopying(false);
          setTimeout(() => setCopySuccess(false), 3000);
        },
        (err) => {
          console.error('Could not copy profile URL: ', err);
          setIsCopying(false);
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Database Connection Error</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We're having trouble connecting to our database. Your profile data is being displayed from local storage 
                and may not be up-to-date. Some features might be limited.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => loadUserProfile()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => {
                    setConnectionError(false);
                    showStatusNotification("Using limited functionality with locally stored data.");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Continue with Limited Functionality
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar forceLight={true} />
      
      {/* Notification Banner */}
      {showNotification && (
        <div className={`fixed top-20 inset-x-0 z-50 flex justify-center items-center px-4`}>
          <div className={`max-w-md w-full ${error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} border rounded-lg shadow-lg p-4 flex items-center justify-between`}>
            <p>{notification}</p>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex space-x-2">
              {user.type === 'student' && isCurrentUser && (
                <>
                  <div className="mt-4 mb-2 sm:mt-0 sm:mb-0 flex flex-wrap justify-end gap-2">
                    <button
                      onClick={handleShareProfile}
                      disabled={isCopying}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center hover:bg-gray-200 transition"
                    >
                      {isCopying ? (
                        <span className="mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Share2 className="mr-2 h-4 w-4" />
                      )}
                      {isCopying ? 'Copying...' : copySuccess ? 'Link Copied!' : 'Share Profile'}
                    </button>
                    
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Edit Profile
                    </button>
                    
                    <button
                      onClick={() => setShowAccountSettingsModal(true)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                      Account Settings
                    </button>
                    
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
              {user.type === 'startup' && isCurrentUser && (
                <>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleShareProfile}
                      disabled={isCopying}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center hover:bg-gray-200 transition"
                    >
                      {isCopying ? (
                        <span className="mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Share2 className="mr-2 h-4 w-4" />
                      )}
                      {isCopying ? 'Copying...' : copySuccess ? 'Link Copied!' : 'Share Profile'}
                    </button>
                    
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowAccountSettingsModal(true)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
              {user.type === 'club' && isCurrentUser && (
                <>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleShareProfile}
                      disabled={isCopying}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md flex items-center hover:bg-gray-200 transition"
                    >
                      {isCopying ? (
                        <span className="mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Share2 className="mr-2 h-4 w-4" />
                      )}
                      {isCopying ? 'Copying...' : copySuccess ? 'Link Copied!' : 'Share Profile'}
                    </button>
                    
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowAccountSettingsModal(true)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
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
      
      {showAccountSettingsModal && (
        <AccountSettingsModal
          isOpen={showAccountSettingsModal}
          onClose={() => setShowAccountSettingsModal(false)}
          onPasswordChanged={() => {
            // Optional: Add any additional actions after password change
          }}
          onAccountDeleted={handleAccountDeleted}
        />
      )}

      {copySuccess && (
        <div className="fixed top-6 inset-x-0 flex justify-center items-center z-50">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-md flex items-center max-w-md animate-fade-in">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="font-medium">Profile link copied!</p>
              <p className="text-sm text-green-600">You can now share this link with anyone.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 