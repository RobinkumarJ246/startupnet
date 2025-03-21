'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext({
  user: null,
  loading: true,
  initialLoadComplete: false,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  refreshUser: () => {},
  validateSession: async () => {},
  getStoredUser: () => {},
  forceRefresh: async () => {},
  resetAppState: async () => {},
});

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const router = useRouter();

  // Get stored user data directly from localStorage
  const getStoredUser = () => {
    try {
      // Check if window is defined (client-side only)
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          return JSON.parse(userData);
        }
      }
    } catch (error) {
      console.error('Error getting stored user data:', error);
    }
    return null;
  };

  // Load user from localStorage on app init
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        // Set loading state first
        setLoading(true);
        
        // Safety check for client-side code
        if (typeof window === 'undefined') {
          setLoading(false);
          setInitialLoadComplete(true);
          return;
        }
        
        // Set user from localStorage immediately for better UX
        const storedUser = getStoredUser();
        if (storedUser) {
          console.log('User found in localStorage');
          setUser(storedUser);
          
          // Then validate with server in background
          try {
            const isValid = await validateSession();
            console.log('Session validation result:', isValid);
            
            // If validation fails, clear user state
            if (!isValid) {
              console.log('Session validation failed, clearing user state');
              setUser(null);
            }
          } catch (error) {
            console.error('Session validation error:', error);
          }
        } else {
          console.log('No user found in localStorage');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear corrupted user data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        setUser(null);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      console.log('Attempting login with userType:', userType);
      
      // COMPLETELY clear ANY existing user data first
      if (typeof window !== 'undefined') {
        console.log('Clearing ALL existing user data from localStorage before login');
        
        // Clear specific keys
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        
        // Scan and remove ALL possible user-related data
        const allKeys = Object.keys(localStorage);
        for (const key of allKeys) {
          if (key.includes('user') || key.includes('auth') || 
              key.includes('token') || key.includes('profile') ||
              key.includes('club') || key.includes('student') || 
              key.includes('startup')) {
            console.log(`Removing localStorage item: ${key}`);
            localStorage.removeItem(key);
          }
        }
      }
      
      // Clear user state immediately
      setUser(null);
      
      console.log('Sending login request to API');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ email, password, userType }),
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      // Get user data from response
      const data = await response.json();
      
      if (!data.user) {
        console.warn('No user data received from login');
        return { success: false, error: 'No user data received' };
      }
      
      // IMPORTANT: Log complete received user data for debugging
      console.log('LOGIN - RECEIVED USER DATA:', {
        id: data.user._id,
        type: data.user.type || data.user.userType,
        name: data.user.name,
        clubName: data.user.clubName,
        fullName: data.user.fullName,
        companyName: data.user.companyName
      });
      
      // Store user data in localStorage
      if (data.user && typeof window !== 'undefined') {
        // Create a complete user object with all necessary fields
        const userData = { ...data.user };
        
        // Ensure all type fields are set correctly
        if (!userData.userType && userData.type) {
          userData.userType = userData.type;
        }
        if (!userData.type && userData.userType) {
          userData.type = userData.userType;
        }
        
        // CRITICAL: Fix missing type-specific fields for each user type
        if (userData.type === 'club' && !userData.clubName) {
          // For club users, ensure clubName exists 
          if (userData.name && typeof userData.name === 'string') {
            console.log('FIXING missing clubName by copying from name:', userData.name);
            userData.clubName = userData.name;
          } else {
            console.warn('Club user missing both clubName and name fields!');
          }
        } else if (userData.type === 'student' && !userData.fullName) {
          // For student users, ensure fullName exists
          if (userData.name && typeof userData.name === 'string') {
            console.log('FIXING missing fullName by copying from name:', userData.name);
            userData.fullName = userData.name;
          } else {
            console.warn('Student user missing both fullName and name fields!');
          }
        } else if (userData.type === 'startup' && !userData.companyName) {
          // For startup users, ensure companyName exists
          if (userData.name && typeof userData.name === 'string') {
            console.log('FIXING missing companyName by copying from name:', userData.name);
            userData.companyName = userData.name;
          } else {
            console.warn('Startup user missing both companyName and name fields!');
          }
        }
        
        // Log the processed user data that will be stored
        console.log('LOGIN - STORING USER DATA:', {
          id: userData._id,
          type: userData.type,
          name: userData.name,
          clubName: userData.clubName,
          fullName: userData.fullName,
          companyName: userData.companyName
        });
        
        // Store the complete user object
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Also store key pieces separately for redundancy
        localStorage.setItem('userType', userData.type || userData.userType);
        localStorage.setItem('userId', userData._id);
        
        // Update the context state
        setUser(userData);
        
        return { success: true };
      } else {
        console.warn('No user data received from login');
        return { success: false, error: 'No user data received' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      console.log('Attempting logout...');
      
      // First clear localStorage to immediately update UI state
      if (typeof window !== 'undefined') {
        // Clear all auth-related data
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        
        // Force clean any other potentially conflicting data
        const keysToCheck = Object.keys(localStorage);
        for (const key of keysToCheck) {
          if (key.includes('user') || key.includes('auth') || key.includes('token') || key.includes('profile')) {
            localStorage.removeItem(key);
          }
        }
      }
      
      // Clear state immediately for better UX
      setUser(null);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies in the request
      });

      console.log('Logout response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        console.warn('Logout API error:', data.error || 'Logout failed');
        // Continue with logout even if API fails
      }
      
      // Redirect to home page
      router.push('/');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear user data even if API request fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        
        // Force clean any potential user data
        const keysToCheck = Object.keys(localStorage);
        for (const key of keysToCheck) {
          if (key.includes('user') || key.includes('auth') || key.includes('token') || key.includes('profile')) {
            localStorage.removeItem(key);
          }
        }
      }
      setUser(null);
      
      // Redirect to home page even if there's an error
      router.push('/');
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data from server or localStorage
  const refreshUser = async () => {
    try {
      console.log('Refreshing user data');
      setLoading(true);
      
      // Clear any previous connection error status
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dbConnectionError');
      }
      
      // First try to validate with the server to get fresh data
      try {
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store'
        });
        
        // Check response status
        console.log('Validation response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if the response indicates a database connection error
          if (data.connectionError) {
            console.log('Database connection error detected from API');
            
            // Set offline mode flag in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('dbConnectionError', 'true');
            }
            
            // Use stored user data as fallback
            const storedUser = getStoredUser();
            if (storedUser) {
              console.log('Using stored user data due to database connection error');
              setUser(storedUser);
              return true;
            }
          } else if (data.user) {
            // We got valid user data from the server
            console.log('Got fresh user data from server');
            const userData = { ...data.user };
            
            // Standardize type field
            if (!userData.userType && userData.type) {
              userData.userType = userData.type;
            }
            if (!userData.type && userData.userType) {
              userData.type = userData.userType;
            }
            
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userData.type || userData.userType);
            localStorage.setItem('userId', userData._id);
            
            // Update state
            setUser(userData);
            return true;
          }
        } else {
          console.log('Validation failed, using localStorage data');
          
          // Don't clear local state for network errors
          const storedUser = getStoredUser();
          if (storedUser) {
            console.log('Using stored user data due to validation error');
            setUser(storedUser);
            return true;
          }
        }
      } catch (error) {
        console.error('Error during session validation:', error);
        
        // Set offline mode flag in localStorage if it's a network error
        if (typeof window !== 'undefined' && 
            (error.name === 'TypeError' || error.message.includes('network') || error.message.includes('fetch'))) {
          console.log('Network error detected, setting offline mode');
          localStorage.setItem('dbConnectionError', 'true');
        }
        
        // Use localStorage as fallback on error
        const storedUser = getStoredUser();
        if (storedUser) {
          console.log('Using stored user data due to validation error');
          setUser(storedUser);
          return true;
        } else {
          console.log('No valid user data available after validation error');
          setUser(null);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing user:', error);
      
      // Use localStorage as fallback on error
      const storedUser = getStoredUser();
      if (storedUser) {
        console.log('Using stored user data due to refresh error');
        setUser(storedUser);
        return true;
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a validateSession function to verify auth status with the server
  const validateSession = async () => {
    try {
      console.log('Validating session...');
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('Cannot validate session in server environment');
        return false;
      }
      
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies in the request
        // Add cache control to prevent browser caching
        cache: 'no-store',
      });

      console.log('Validation response status:', response.status);
      
      if (!response.ok) {
        // Handle different error cases
        if (response.status === 404) {
          console.error('Validation endpoint not found - API route may be missing');
          // Don't clear local state for 404 errors (endpoint not found)
          // This allows the user to continue using the app if the endpoint is misconfigured
          return false;
        }
        
        // For auth failures (401, 403), clear local state
        if (response.status === 401 || response.status === 403) {
          console.log('Session unauthorized or forbidden, clearing user state');
          localStorage.removeItem('user');
          setUser(null);
        }
        
        return false;
      }

      // Get the latest user data from server
      const data = await response.json();
      console.log('Validation successful, received user data:', data.user ? data.user.type || 'unknown type' : 'no user data');
      
      // Check if there was a database connection error
      if (data.connectionError) {
        console.log('Validation returned with database connection error, using stored user data');
        // Don't update the user state from incomplete data
        // Instead, keep using the existing user data
        return true;
      }
      
      // Update localStorage with fresh data
      if (data.user) {
        // Ensure data has all required fields
        const userData = { ...data.user };
        
        // Standardize the user type field
        if (!userData.userType && userData.type) {
          userData.userType = userData.type;
        }
        if (!userData.type && userData.userType) {
          userData.type = userData.userType;
        }
        
        // Logging data for debugging
        if (userData.type === 'club') {
          console.log('Club user validated with data:', {
            id: userData._id,
            name: userData.clubName || 'missing clubName',
            type: userData.type,
            university: userData.university
          });
        }
        
        // Update localStorage with complete user data
        console.log('Updating localStorage with validated user data');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', userData.type || userData.userType);
        localStorage.setItem('userId', userData._id);
        
        // Update context state with complete user data
        setUser(userData);
        return true;
      } else {
        console.warn('No user data returned from validation endpoint');
        localStorage.removeItem('user');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      // Don't clear local state for network errors
      // This allows the user to continue using the app if there are temporary network issues
      return false;
    }
  };

  // Force refresh - completely reset state and reload from server
  const forceRefresh = async () => {
    try {
      console.log('Force refreshing authentication state...');
      setLoading(true);

      // Completely clear localStorage
      if (typeof window !== 'undefined') {
        const allKeys = Object.keys(localStorage);
        const keysToRemove = allKeys.filter(key => 
          key.includes('user') || 
          key.includes('auth') || 
          key.includes('token') || 
          key.includes('profile') ||
          key.includes('club') || 
          key.includes('student') || 
          key.includes('startup')
        );
        
        console.log(`Clearing ${keysToRemove.length} items from localStorage`);
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      }
      
      // Clear state
      setUser(null);
      
      // Make validation request to get fresh data
      try {
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            console.log('Force refresh successful - received user data');
            const userData = { ...data.user };
            
            // Standardize type field
            if (!userData.userType && userData.type) {
              userData.userType = userData.type;
            }
            if (!userData.type && userData.userType) {
              userData.type = userData.userType;
            }
            
            console.log('Setting user from force refresh:', userData.type);
            
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userData.type || userData.userType);
            localStorage.setItem('userId', userData._id);
            
            // Update state
            setUser(userData);
            return true;
          }
        } else {
          console.log('Force refresh validation failed, user not authenticated');
          return false;
        }
      } catch (error) {
        console.error('Error during force refresh validation:', error);
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Force refresh error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Force a complete app reset - use in emergency cases when user data is incorrect
  const resetAppState = async () => {
    console.log('EMERGENCY: Performing complete app state reset');
    
    // 1. Clear all localStorage
    if (typeof window !== 'undefined') {
      try {
        console.log('Clearing ALL localStorage');
        localStorage.clear();
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }
    }
    
    // 2. Clear all state
    setUser(null);
    setLoading(false);
    
    // 3. Try to clear cookies by calling logout API
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (e) {
      console.error('Error calling logout API:', e);
    }
    
    // 4. Redirect to home
    router.push('/');
    
    // 5. Force page reload as last resort
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    
    return true;
  };

  // Create the context value object
  const value = {
    user,
    loading,
    initialLoadComplete,
    isLoggedIn: !!user,
    login,
    logout,
    refreshUser,
    validateSession,
    getStoredUser,
    forceRefresh,
    resetAppState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}