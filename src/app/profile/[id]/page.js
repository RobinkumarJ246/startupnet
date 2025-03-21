'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { 
  User, 
  Building, 
  Users, 
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Globe,
  Star,
  Award,
  Briefcase,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Lock,
  ExternalLink,
  LogIn,
  Check
} from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
import { useAuth } from '../../lib/auth/AuthContext';
import { ProfileSkeleton } from '../../components/shared/SkeletonLoader';

// Helper function to safely render tags (similar to the original profile page)
const renderTags = (data) => {
  if (!data) return null;
  
  let items = [];
  if (typeof data === 'string') {
    items = data.split(',').map(item => item.trim()).filter(Boolean);
  } else if (Array.isArray(data)) {
    items = data.map(item => item.trim ? item.trim() : String(item)).filter(Boolean);
  } else {
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

// Helper function to safely get value
const getSafeValue = (value, defaultText = 'Not specified') => {
  if (value === null || value === undefined || value === '') {
    return defaultText;
  }
  return String(value);
};

export default function SharedProfilePage({ params }) {
  const router = useRouter();
  // Safely access params using React.use()
  const resolvedParams = use(params);
  const profileId = resolvedParams.id;
  
  const { isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // State to track if the user is logged in
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  // Load the profile data for the given ID
  useEffect(() => {
    // Don't fetch if profileId isn't set yet
    if (!profileId) return;
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setConnectionError(false);
        const response = await fetch(`/api/profile/${profileId}`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        });
        
        if (!response.ok) {
          if (response.status === 503 || response.status === 500) {
            // Server error - likely database connection issue
            setConnectionError(true);
            throw new Error('Database connection error');
          }
          throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        setProfile(data);
        
        // Check if user is authenticated based on the response
        setIsUserLoggedIn(data.isAuthenticated || false);
      } catch (error) {
        console.error('Error loading shared profile:', error);
        
        // Check if it's a connection error
        if (error.message && 
            (error.message.includes('Database connection error') ||
             error.message.includes('MongoDB connection error') || 
             error.message.includes('MongoNetworkError') ||
             error.message.includes('ECONNREFUSED') ||
             error.message.includes('certificate') ||
             error.message.includes('SSL'))) {
          setConnectionError(true);
          setError('Database connection error. Please try again later.');
        } else {
          setError('Failed to load profile. It may not exist or you may not have permission to view it.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Check if user is logged in from AuthContext
    const checkLoginStatus = async () => {
      const userData = localStorage.getItem('user');
      setIsUserLoggedIn(!!userData);
    };
    
    checkLoginStatus();
    fetchProfile();
  }, [profileId]);
  
  // Add a useEffect to handle profile image loading
  useEffect(() => {
    if (profile && profile.profileImageUrl) {
      // Preload the image
      const img = new Image();
      img.src = profile.profileImageUrl;
    }
  }, [profile]);
  
  // Function to copy the current URL to clipboard
  const copyProfileUrl = () => {
    const url = window.location.href;
    setIsCopying(true);
    
    navigator.clipboard.writeText(url).then(
      () => {
        setCopySuccess(true);
        setIsCopying(false);
        setTimeout(() => setCopySuccess(false), 3000);
      },
      (err) => {
        console.error('Failed to copy URL');
        setIsCopying(false);
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Database Connection Error</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We're having trouble connecting to our database. Please try again later.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
                <Link 
                  href="/"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar forceLight={true} />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                The profile you're looking for might be private or doesn't exist.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  Go Home
                </Link>
                <Link 
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // This should not happen, but just in case
  }

  // Clone and filter the profile data for non-logged-in users
  const getDisplayProfile = () => {
    if (isUserLoggedIn) {
      return profile; // Return full profile data for logged-in users
    }
    
    // For non-logged-in users, filter out private data
    // This depends on the user type
    const { type } = profile;
    const publicProfile = { ...profile };
    
    if (type === 'student') {
      // Remove contact info, sensitive data for student
      delete publicProfile.email;
      delete publicProfile.phone;
      delete publicProfile.linkedinUrl;
      delete publicProfile.githubUrl;
      // Keep only basic academic info that's publicly shareable
    } 
    else if (type === 'startup') {
      // Remove financial info, team details for startup
      delete publicProfile.fundingDetails;
      delete publicProfile.revenue;
      delete publicProfile.teamSize;
      delete publicProfile.hiringRoles;
      // Keep company name, industry, public description
    }
    else if (type === 'club') {
      // Remove member info, contact details for club
      delete publicProfile.memberCount;
      delete publicProfile.contactEmail;
      delete publicProfile.contactPerson;
      // Keep club name, university, events, activities
    }
    
    return publicProfile;
  };

  // Get filtered profile based on login status
  const displayProfile = getDisplayProfile();

  // Determine user type for proper rendering
  const profileType = displayProfile.type || 'student';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar forceLight={true} />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Preview Banner for non-logged-in users */}
          {!isUserLoggedIn && (
            <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-indigo-600 mr-2" />
                <div>
                  <p className="text-indigo-700 font-medium">You're viewing a limited preview</p>
                  <p className="text-sm text-indigo-600">Sign in to see the full profile and connect with this {profileType}</p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                  {displayProfile.profileImageUrl ? (
                    <Image 
                      src={displayProfile.profileImageUrl}
                      alt={`${displayProfile.name || displayProfile.companyName || displayProfile.clubName}'s profile`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                      onError={(e) => {
                        // If image fails to load, replace with icon
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`h-full w-full items-center justify-center ${displayProfile.profileImageUrl ? 'hidden' : 'flex'}`}>
                    {profileType === 'student' ? (
                      <User className="h-12 w-12 text-indigo-400" />
                    ) : profileType === 'startup' ? (
                      <Building className="h-12 w-12 text-indigo-400" />
                    ) : (
                      <Users className="h-12 w-12 text-indigo-400" />
                    )}
                  </div>
                </div>
                
                <div className="sm:ml-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profileType === 'student' ? displayProfile.name : 
                         profileType === 'startup' ? displayProfile.companyName : 
                         displayProfile.clubName}
                      </h1>
                      <p className="text-gray-600">
                        {profileType === 'student' ? `${displayProfile.major} Student at ${displayProfile.university}` : 
                         profileType === 'startup' ? `${displayProfile.industry} Startup` : 
                         `University Club at ${displayProfile.college ? displayProfile.college : displayProfile.university || 'Not specified'}`}
                      </p>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex space-x-2">
                      <button
                        onClick={copyProfileUrl}
                        disabled={isCopying}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm flex items-center hover:bg-gray-50 transition"
                      >
                        {isCopying ? (
                          <span className="mr-1.5 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Share2 className="h-4 w-4 mr-1.5" />
                        )}
                        {isCopying ? 'Copying...' : copySuccess ? 'Copied!' : 'Share'}
                      </button>
                      
                      {isUserLoggedIn && (
                        <Link 
                          href="/messages"
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm flex items-center hover:bg-indigo-700 transition"
                        >
                          <MessageCircle className="h-4 w-4 mr-1.5" />
                          Connect
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {/* Brief summary/bio */}
                  <p className="text-gray-700 text-sm mb-4">
                    {displayProfile.bio || 'No bio provided'}
                  </p>
                  
                  {/* Location and website */}
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
                    {displayProfile.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {displayProfile.location}
                      </div>
                    )}
                    
                    {displayProfile.website && (
                      <a 
                        href={displayProfile.website.startsWith('http') ? displayProfile.website : `https://${displayProfile.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:underline"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Basic Info */}
            <div className="md:col-span-1 space-y-6">
              {/* Type-specific basic info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  {profileType === 'student' ? 'Education' : 
                   profileType === 'startup' ? 'Company Info' : 
                   'Club Info'}
                </h2>
                
                {profileType === 'student' && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">University</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.university)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Major</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.major)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Graduation Year</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.graduationYear)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.course)}</span>
                    </div>
                  </div>
                )}
                
                {profileType === 'startup' && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.industry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stage</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.stage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Founded</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.foundingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.location)}</span>
                    </div>
                  </div>
                )}
                
                {profileType === 'club' && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">University</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.university)}</span>
                    </div>
                    {displayProfile.college && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">College</span>
                        <span className="font-medium text-gray-900">{getSafeValue(displayProfile.college)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Founded</span>
                      <span className="font-medium text-gray-900">{getSafeValue(displayProfile.foundedYear)}</span>
                    </div>
                    {isUserLoggedIn && displayProfile.memberCount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Count</span>
                        <span className="font-medium text-gray-900">{getSafeValue(displayProfile.memberCount)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Privacy-gated information */}
              {!isUserLoggedIn && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-indigo-100">
                  <div className="flex items-center mb-4">
                    <Lock className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Additional Information</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Sign in to see more information such as contact details, connections, and full profile details.
                  </p>
                  <Link
                    href="/login"
                    className="w-full block text-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Sign In to View Full Profile
                  </Link>
                </div>
              )}
            </div>
            
            {/* Right Column - Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Skills/Interests/Focus Areas */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  {profileType === 'student' ? 'Skills & Interests' : 
                   profileType === 'startup' ? 'Focus Areas' : 
                   'Club Activities'}
                </h2>
                
                {profileType === 'student' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                      {renderTags(displayProfile.skills)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
                      {renderTags(displayProfile.interests)}
                    </div>
                  </div>
                )}
                
                {profileType === 'startup' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Focus Areas</h3>
                      {renderTags(displayProfile.focusAreas)}
                    </div>
                    {isUserLoggedIn && displayProfile.hiringRoles && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Hiring For</h3>
                        {renderTags(displayProfile.hiringRoles)}
                      </div>
                    )}
                  </div>
                )}
                
                {profileType === 'club' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Focus Areas</h3>
                      {renderTags(displayProfile.focusAreas)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Activities</h3>
                      <p className="text-gray-600 text-sm">
                        {displayProfile.activities || 'No activities listed'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* About/Bio/Description Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  {profileType === 'student' ? 'About Me' : 
                   profileType === 'startup' ? 'Company Description' : 
                   'Club Description'}
                </h2>
                
                <div className="prose max-w-none text-gray-700">
                  <p>{displayProfile.bio || displayProfile.description || 'No description provided'}</p>
                </div>
              </div>
              
              {/* Footer CTA for non-logged-in users */}
              {!isUserLoggedIn && (
                <div className="bg-indigo-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Ready to connect with {displayProfile.name || displayProfile.companyName || displayProfile.clubName}?</h3>
                  <p className="text-indigo-600 mb-4">Sign up for StartupsNet to connect with students, startups, and university clubs.</p>
                  <div className="flex justify-center space-x-4">
                    <Link 
                      href="/login" 
                      className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
} 