'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, Loader2, AlertCircle, Key } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function RegistrationSuccess() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Redirect to login if no user data is found
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleResendVerification = async () => {
    if (!user || isResending) return;
    
    setIsResending(true);
    setStatus(null);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          userType: user.type,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }
      
      setStatus('success');
      setMessage('Verification email has been resent. Please check your inbox.');
      setShowCodeInput(true);
    } catch (error) {
      console.error('Error resending verification:', error);
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsResending(false);
    }
  };
  
  const handleVerifyWithCode = async () => {
    if (!user || isVerifying || !verificationCode.trim()) return;
    
    setIsVerifying(true);
    setStatus(null);
    
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          userType: user.type,
          code: verificationCode.trim()
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }
      
      setStatus('success');
      setMessage('Email successfully verified!');
      
      // Update the user data in localStorage
      const updatedUser = { ...user, emailVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error verifying code:', error);
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Registration Successful!
            </h1>
            
            <p className="text-center text-gray-600 mb-6">
              Your account has been created. To complete the setup, please verify your email address.
            </p>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Verify your email</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    We've sent a verification email to <strong>{user.email}</strong>. Click the link in the email to verify your account.
                  </p>
                </div>
              </div>
            </div>

            {status === 'success' && (
              <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded flex items-start">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{message}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>
              
              {showCodeInput && (
                <div className="p-4 border border-gray-200 rounded-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter verification code
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="pl-10 block w-full border border-gray-300 rounded-md text-sm py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <button
                      onClick={handleVerifyWithCode}
                      disabled={isVerifying || !verificationCode.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="text-center py-2">
                <span className="text-gray-500 text-sm">or</span>
              </div>
              
              <Link
                href="/profile"
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue to Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <p className="mt-6 text-center text-xs text-gray-500">
              You can verify your email later from your profile page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 