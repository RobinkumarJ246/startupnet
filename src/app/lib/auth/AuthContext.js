'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

  // Get user from localStorage
  const getStoredUser = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading stored user:', error);
      return null;
    }
  };

  const getStoredToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error reading stored token:', error);
      return null;
    }
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          await validateSession(); // Soft validate in background
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const token = getStoredToken();

      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    } catch (error) {
      console.warn('Logout request failed, clearing local session anyway:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/');
      setLoading(false);
    }
  };

  const validateSession = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        localStorage.removeItem('user');
        setUser(null);
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
        return false;
      }

      const data = await response.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const refreshUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialLoadComplete,
        login,
        logout,
        refreshUser,
        validateSession,
        getStoredUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
