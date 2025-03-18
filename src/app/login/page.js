"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Building,
  Users,
  GraduationCap,
  AlertCircle,
  Beaker
} from "lucide-react";
import { useRouter } from 'next/navigation';

// Import Navbar component
import Navbar from "../components/landing/Navbar";

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDevOptions, setShowDevOptions] = useState(false);

  // Handle email input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle remember me checkbox
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Type selector buttons
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // Toggle development options
  const toggleDevOptions = () => {
    if (isDev) {
      setShowDevOptions(!showDevOptions);
    }
  };

  // Use test login for development
  const handleTestLogin = async () => {
    if (!isDev) return;
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log("Using test login with:", { email, userType });
      
      const response = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || 'test@example.com',
          userType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Test login failed');
      }

      // Store user data in localStorage for UI purposes only
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setSuccessMessage('Test login successful! Redirecting...');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
      
    } catch (err) {
      console.error("Test login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      console.log("Submitting login with:", { email, userType });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userType
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Display a more user-friendly error message
        const errorMessage = data.error || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        setLoading(false);
        return;
      }
      
      // Store user data in localStorage for UI purposes only
      if (data.user) {
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          type: userType
        }));
      }
      
      // Show success message before redirecting
      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-indigo-50 to-white">
      {/* Navbar positioned at the top */}
      <Navbar forceLight={true} />
      
      <div className="flex justify-center items-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/" className="flex justify-center mb-6">
              <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                StartupsNet
              </span>
            </Link>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to continue your journey with our growing community
            </p>
            {isDev && (
              <div className="mt-2 flex justify-center">
                <button 
                  onClick={toggleDevOptions}
                  className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-500"
                >
                  <Beaker className="w-3 h-3 mr-1" />
                  {showDevOptions ? 'Hide dev options' : 'Dev options'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* User Type Selection */}
            <div className="flex space-x-2 mb-6">
              <button
                type="button"
                onClick={() => handleUserTypeChange('student')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'student'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Student
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('startup')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'startup'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building className="h-4 w-4 mr-2" />
                Startup
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('club')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'club'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Club
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center text-green-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
            )}

            {/* Dev mode test login */}
            {isDev && showDevOptions && (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-amber-800 flex items-center">
                    <Beaker className="h-4 w-4 mr-1" />
                    Development Testing
                  </h3>
                </div>
                <p className="text-xs text-amber-700 mb-3">
                  This option bypasses password verification for development testing only.
                </p>
                <button
                  type="button"
                  onClick={handleTestLogin}
                  disabled={loading}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-md text-sm hover:bg-amber-700 transition-colors"
                >
                  {loading ? 'Loading...' : 'Use Test Login'}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 pl-10 block w-full border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your.email@example.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    inputMode="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="py-3 px-4 pl-10 pr-10 block w-full border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <LogIn size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="flex justify-center">
                <span className="text-sm text-gray-500">Don't have an account?</span>
                <Link 
                  href="/register" 
                  className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

