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
      console.log('Attempting login...');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies in the request
        body: JSON.stringify({ email, password, userType }),
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful, received user data');
      
      // Store user data in localStorage
      if (data.user && typeof window !== 'undefined') {
        console.log('Storing user data in localStorage');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        console.warn('No user data received from login');
      }
      
      return { success: true };
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
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies in the request
      });

      console.log('Logout response status:', response.status);
      
      // Clear user data regardless of response status
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
      
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
      }
      setUser(null);
      
      // Redirect to home page even if there's an error
      router.push('/');
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data from localStorage
  const refreshUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
    return null;
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
      console.log('Validation successful, received user data');
      
      // Update localStorage with fresh data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}