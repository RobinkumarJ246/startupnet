"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ChevronRight, Mail, AlertTriangle } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const type = searchParams.get('type') || 'student';
    
    if (!token || !email) {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. Missing required parameters.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email, type }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify email');
        }
        
        setVerificationStatus('success');
        
        // Start countdown for redirection
        const intervalId = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(intervalId);
              router.push('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="flex justify-center items-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h1>
            
            {verificationStatus === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-600">Verifying your email address...</p>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <div className="space-y-6 py-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Email Verified Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Your email has been verified. You can now enjoy all features of StartupsNet.
                  </p>
                  
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800 mb-6">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p>We've sent a confirmation email to your inbox.</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    You will be redirected to the login page in <span className="font-semibold">{countdown}</span> seconds.
                  </p>
                  
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go to Login <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
            
            {verificationStatus === 'error' && (
              <div className="space-y-6 py-6">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{errorMessage || 'An error occurred during verification.'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Go to Login
                    </Link>
                    
                    <button
                      className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 