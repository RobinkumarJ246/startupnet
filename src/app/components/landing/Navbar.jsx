import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth/AuthContext';

export default function Navbar({ forceLight = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownTimeoutId, setDropdownTimeoutId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialUser, setInitialUser] = useState(null);

  // Initialize with localStorage data to prevent flicker
  useEffect(() => {
    // Get user data from localStorage for immediate display
    try {
      console.log('Navbar initialization - attempting to load from localStorage');
      refreshUserFromLocalStorage();
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
    }
    
    // Set auth loading to false after a short delay or when user is loaded
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 500); // Provide a short window for auth to complete
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to refresh user data from localStorage
  const refreshUserFromLocalStorage = () => {
    try {
      console.log('Refreshing user data from localStorage in Navbar');
      const cachedUser = localStorage.getItem('user');
      
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          // Validate that we have a proper user object
          if (parsedUser && typeof parsedUser === 'object') {
            console.log('Found user in localStorage with type:', parsedUser.type || parsedUser.userType || 'unknown');
            
            // Debug info for club or student
            if (parsedUser.type === 'club' || parsedUser.userType === 'club') {
              // Try to find the real club name - there's a problem where it's sometimes the contact person's name
              console.log('Club data found. Raw data:', {
                id: parsedUser._id,
                name: parsedUser.name,
                clubName: parsedUser.clubName,
                type: parsedUser.type
              });
              
              // Log what name we'll actually use
              const displayName = parsedUser.clubName || parsedUser.name || 'unknown';
              console.log('Club display name will be:', displayName);
            } else if (parsedUser.type === 'student' || parsedUser.userType === 'student') {
              console.log('Student data found. Name:', parsedUser.fullName || parsedUser.name || 'unknown');
            }
            
            // Set the user
            setInitialUser(parsedUser);
            setAuthLoading(false);
          } else {
            console.warn('Invalid user data in localStorage');
            setInitialUser(null);
            setAuthLoading(false);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          setInitialUser(null);
          setAuthLoading(false);
        }
      } else {
        console.log('No user found in localStorage');
        setInitialUser(null);
        setAuthLoading(false);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setInitialUser(null);
      setAuthLoading(false);
    }
  };
  
  // Update localStorage user when actual auth user changes
  useEffect(() => {
    console.log('Auth user changed in Navbar:', user ? 
        (user.type || user.userType || 'unknown type') : 'null or undefined');
        
    if (user !== undefined) {
      // If we have a definitive user state from auth context, use it
      if (user === null) {
        // User explicitly logged out
        console.log('User logged out, clearing local navbar state');
        setInitialUser(null);
      } else {
        // User logged in - log details for debugging
        if (user.type === 'club' || user.userType === 'club') {
          console.log('Navbar received club user. Name:', user.clubName || user.name || 'unknown');
        } else if (user.type === 'student' || user.userType === 'student') {
          console.log('Navbar received student user. Name:', user.fullName || user.name || 'unknown');
        }
        
        // Set the user and force a refresh from localStorage if needed
        setInitialUser(user);
        
        // Double check with localStorage to ensure consistency
        setTimeout(() => refreshUserFromLocalStorage(), 300);
      }
      setAuthLoading(false);
    }
  }, [user]);
  
  // Update auth loading state whenever user changes
  useEffect(() => {
    if (user !== undefined) {
      setAuthLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Improved dropdown handling with delay to prevent accidental closing
  const handleDropdownEnter = (name) => {
    if (dropdownTimeoutId) {
      clearTimeout(dropdownTimeoutId);
      setDropdownTimeoutId(null);
    }
    setActiveDropdown(name);
  };

  const handleDropdownLeave = (name) => {
    const timeoutId = setTimeout(() => {
      if (activeDropdown === name) {
        setActiveDropdown(null);
      }
    }, 300); // 300ms delay before closing
    setDropdownTimeoutId(timeoutId);
  };

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      console.log('Navbar: Initiating logout');
      // Clear local user state immediately for better UX
      setInitialUser(null);
      await logout();
    } catch (error) {
      console.error('Logout error in navbar:', error);
      // Force clear local state even if API fails
      setInitialUser(null);
    }
  };

  // Get display name based on user type
  const getDisplayName = (user) => {
    if (!user) {
      console.log('getDisplayName: No user provided');
      return 'User';
    }

    // Debug log all the relevant fields
    console.log('getDisplayName: User fields:', {
      id: user._id || user.id,
      type: user.type || user.userType,
      name: user.name,
      clubName: user.clubName,
      fullName: user.fullName,
      companyName: user.companyName
    });

    const userType = user.type || user.userType;
    
    // For club users, prioritize clubName over contact person name
    if (userType === 'club') {
      if (user.clubName) {
        console.log(`Club user display name: ${user.clubName}`);
        return user.clubName;
      } else if (user.name) {
        console.warn('Club user missing clubName, falling back to name:', user.name);
        return user.name;
      }
    }
    
    // For startup users, prioritize companyName
    if (userType === 'startup') {
      if (user.companyName) {
        console.log(`Startup user display name: ${user.companyName}`);
        return user.companyName;
      } else if (user.name) {
        console.warn('Startup user missing companyName, falling back to name:', user.name);
        return user.name;
      }
    }
    
    // For student users, prioritize fullName
    if (userType === 'student') {
      if (user.fullName) {
        console.log(`Student user display name: ${user.fullName}`);
        return user.fullName;
      } else if (user.name) {
        console.warn('Student user missing fullName, falling back to name:', user.name);
        return user.name;
      }
    }
    
    // Last resort fallback - use any available name field
    return user.fullName || user.clubName || user.companyName || user.name || 'User';
  };

  // Calculate if we should show light mode (white background) elements
  const showLight = scrolled || forceLight;
  
  // Determine which user object to use - prefer the authenticated user, fall back to cached user
  const displayUser = user || initialUser;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      showLight ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {/* Logo using SVG for better quality */}
            <div className="relative h-9 w-9 flex items-center justify-center">
              {!showLight && (
                <div className="w-9 h-9">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG path from your justants_logo_only.svg file - using a white version */}
                    <path d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3ZM18 8C20.2 8 22 9.8 22 12C22 14.2 20.2 16 18 16C15.8 16 14 14.2 14 12C14 9.8 15.8 8 18 8ZM26 24C26 27.314 22.418 30 18 30C13.582 30 10 27.314 10 24V22C10 20.346 11.346 19 13 19H23C24.654 19 26 20.346 26 22V24Z" fill="white"/>
                  </svg>
                </div>
              )}
              
              {showLight && (
                <div className="w-9 h-9">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG path from your justants_logo_only.svg file - using a colored version */}
                    <path d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3ZM18 8C20.2 8 22 9.8 22 12C22 14.2 20.2 16 18 16C15.8 16 14 14.2 14 12C14 9.8 15.8 8 18 8ZM26 24C26 27.314 22.418 30 18 30C13.582 30 10 27.314 10 24V22C10 20.346 11.346 19 13 19H23C24.654 19 26 20.346 26 22V24Z" fill="#4F46E5"/>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <span className={`text-2xl font-bold transition-colors duration-300 ${showLight ? 'text-indigo-600' : 'text-white'}`}>
                Just ants
              </span>
              <span className={`text-xs transition-colors duration-300 -mt-1 ${showLight ? 'text-gray-500' : 'text-gray-200'}`}>
                Connect. Collaborate. Grow.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative">
              <button 
                className={`px-3 py-2 rounded-md flex items-center ${
                  showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                }`}
                onClick={() => toggleDropdown('explore')}
                onMouseEnter={() => handleDropdownEnter('explore')}
                onMouseLeave={() => handleDropdownLeave('explore')}
              >
                Explore
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === 'explore' && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-all duration-200 origin-top-left"
                  onMouseEnter={() => handleDropdownEnter('explore')}
                  onMouseLeave={() => handleDropdownLeave('explore')}
                >
                  <Link href="/clubs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Tech Clubs
                  </Link>
                  <Link href="/startups" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Startups
                  </Link>
                  <Link href="/projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Projects
                  </Link>
                  <Link href="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Events
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/how-it-works" 
              className={`px-3 py-2 rounded-md ${
                showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
              }`}
            >
              How It Works
            </Link>
            
            <Link 
              href="/pricing" 
              className={`px-3 py-2 rounded-md ${
                showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
              }`}
            >
              Pricing
            </Link>
            
            {/* Auth loading state - show skeleton placeholder during loading */}
            {authLoading ? (
              <div className="flex items-center space-x-2">
                <div className={`h-9 w-20 rounded-lg animate-pulse ${showLight ? 'bg-gray-200' : 'bg-white/20'}`}></div>
                <div className={`h-9 w-20 rounded-lg animate-pulse ${showLight ? 'bg-indigo-100' : 'bg-white/30'}`}></div>
              </div>
            ) : displayUser ? (
              <>
                <div className="relative">
                  <button 
                    className={`px-3 py-2 rounded-md flex items-center ${
                      showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                    }`}
                    onClick={() => toggleDropdown('profile')}
                    onMouseEnter={() => handleDropdownEnter('profile')}
                    onMouseLeave={() => handleDropdownLeave('profile')}
                  >
                    <User className="h-4 w-4 mr-1" />
                    {getDisplayName(displayUser)}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  {activeDropdown === 'profile' && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-all duration-200 origin-top-right"
                      onMouseEnter={() => handleDropdownEnter('profile')}
                      onMouseLeave={() => handleDropdownLeave('profile')}
                    >
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                        My Profile
                      </Link>
                      <Link href="/explore" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                        Explore
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-lg ml-2 ${
                    showLight 
                      ? 'text-gray-700 hover:text-indigo-600 border border-gray-200' 
                      : 'text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  Login
                </Link>
                
                <Link 
                  href="/register" 
                  className={`px-4 py-2 rounded-lg ${
                    showLight 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-white text-indigo-600 hover:bg-gray-100'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${showLight ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${showLight ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg mt-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="block">
              <button 
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                onClick={() => {
                  setActiveDropdown(activeDropdown === 'mobile-explore' ? null : 'mobile-explore')
                }}
              >
                <div className="flex justify-between items-center">
                  Explore
                  <ChevronDown className={`h-4 w-4 transform transition-transform ${
                    activeDropdown === 'mobile-explore' ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>
              
              {activeDropdown === 'mobile-explore' && (
                <div className="pl-4 space-y-1 mt-1">
                  <Link 
                    href="/clubs" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tech Clubs
                  </Link>
                  <Link 
                    href="/startups" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Startups
                  </Link>
                  <Link 
                    href="/projects" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link 
                    href="/events" 
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Events
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/how-it-works" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            
            <Link 
              href="/pricing" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            
            {/* Mobile auth options with loading state */}
            {authLoading ? (
              <div className="flex flex-col space-y-2 py-2">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-indigo-100 rounded animate-pulse"></div>
              </div>
            ) : displayUser ? (
              <div className="pt-2 border-t border-gray-200">
                <div className="px-3 py-2 font-medium text-indigo-600">
                  <span className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {getDisplayName(displayUser)}
                  </span>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  href="/explore" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full block text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <div className="pt-2 space-y-2 border-t border-gray-200">
                <Link 
                  href="/login" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}