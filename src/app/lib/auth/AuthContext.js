'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext({
  user: null,
  loading: true,
  initialLoadComplete: false,
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
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
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
        // Set user from localStorage immediately for better UX
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          
          // Then validate with server in background
          try {
            await validateSession();
          } catch (error) {
            console.error('Session validation failed:', error);
            // If validation fails with a server error, still keep the localStorage data
            // This allows the user to continue using the app if the server is temporarily unavailable
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear corrupted user data
        localStorage.removeItem('user');
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store user data in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
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
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Logout failed');
      }

      // Clear user data from localStorage
      localStorage.removeItem('user');
      setUser(null);
      
      // Redirect to home page
      router.push('/');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
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
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
      }
      
      return true;
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