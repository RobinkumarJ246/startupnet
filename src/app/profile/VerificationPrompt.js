'use client';

import { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, Loader2, X, Key } from 'lucide-react';

const VerificationPrompt = ({ user, userType }) => {
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Only show for unverified users
  if (user?.emailVerified) {
    return null;
  }
  
  const handleResend = async () => {
    if (isResending) return;
    
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
          userType,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }
      
      setStatus('success');
      setMessage('Verification email has been sent to your email address.');
      // Show code input after successful resend
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
    if (isVerifying || !verificationCode.trim()) return;
    
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
          userType,
          code: verificationCode.trim()
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }
      
      setStatus('success');
      setMessage('Email successfully verified! Please refresh the page.');
      
      // Reload the page after a brief delay to update user status
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error verifying code:', error);
      setStatus('error');
      setMessage(error.message);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="my-4 border border-indigo-100 bg-indigo-50 rounded-lg p-4 text-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Mail className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-indigo-800">Verify your email address</h3>
          <p className="mt-1 text-indigo-700">
            Please verify your email address to access all features and show others that your account is legitimate.
          </p>
          
          {status === 'success' && (
            <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-xs">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded flex items-start">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-xs">{message}</p>
            </div>
          )}
          
          <div className="mt-3 flex flex-col space-y-3">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center px-3 py-1.5 border border-indigo-300 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-fit"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin h-3 w-3 mr-1.5" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-3 w-3 mr-1.5" />
                  Resend Verification Email
                </>
              )}
            </button>
            
            {showCodeInput ? (
              <div className="mt-2 p-3 border border-indigo-200 rounded-md bg-white">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="verificationCode" className="block text-xs font-medium text-indigo-700">
                    Enter verification code from your email
                  </label>
                  <button
                    onClick={() => setShowCodeInput(false)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter code"
                      className="pl-10 block w-full border border-indigo-200 rounded-md text-sm py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={handleVerifyWithCode}
                    disabled={isVerifying || !verificationCode.trim()}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <Loader2 className="animate-spin h-3 w-3" />
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCodeInput(true)}
                className="text-indigo-600 hover:text-indigo-800 text-xs underline w-fit"
              >
                Have a verification code? Enter it here
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPrompt; 