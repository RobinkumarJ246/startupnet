'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, AlertCircle, Sparkles, Star, Clock, Bell } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function StayTuned() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSubscriptionStatus('success');
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-10 transition-colors font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to home
        </Link>
        
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left column - Form */}
              <div className="p-8 md:p-12 lg:p-16">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                  <Clock className="mr-1 h-4 w-4" />
                  Under Construction
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  This Feature is Coming Soon
                </h1>
                
                <p className="text-gray-600 mb-8">
                  We're working hard to bring this exciting new feature to StartupsNet. Subscribe to our updates to be notified as soon as it launches and get early access.
                </p>
                
                {subscriptionStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <div className="flex items-center text-green-700 mb-3">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      <h3 className="font-semibold text-lg">You're on the list!</h3>
                    </div>
                    <p className="text-green-600">
                      Thank you for your interest! We'll notify you as soon as this feature is ready. You'll be among the first to experience it.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none focus:ring-2`}
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      {error && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {error}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Notify Me When It's Ready
                          <Bell className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Why stay updated:</h3>
                  <ul className="space-y-3">
                    {[
                      'Be the first to access this new feature',
                      'Receive special badges for providing feedback',
                      'Get special early adopter benefits',
                      'Shape the upcoming features and help us improve them'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Star className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Right column - Illustration */}
              <div className="hidden md:block relative bg-gradient-to-br from-blue-600 to-indigo-700 p-12 lg:p-16 text-white">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
                </div>
                
                <div className="relative h-full flex flex-col justify-between">
                <div>
  <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
  <p className="text-blue-100 mb-8">
    Exciting updates are on the way to enhance your StartupsNet experience, making it more engaging, efficient, and impactful.
  </p>
  
  <div className="space-y-6">
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
      <h3 className="font-medium mb-2">Seamless Experience</h3>
      <p className="text-sm text-blue-100">
        Enjoy a smoother and more intuitive interface designed for effortless navigation and interaction.
      </p>
    </div>
    
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
      <h3 className="font-medium mb-2">Expanded Connectivity</h3>
      <p className="text-sm text-blue-100">
        Stay connected with relevant updates, opportunities, and communities that match your interests.
      </p>
    </div>
    
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
      <h3 className="font-medium mb-2">Smarter Insights</h3>
      <p className="text-sm text-blue-100">
        Gain valuable data and insights to help you stay informed, grow, and make better decisions.
      </p>
    </div>
  </div>
</div>

                  
                  <div className="mt-12 pt-6 border-t border-white/20">
  <div className="flex items-center">
    <div className="flex -space-x-2 mr-4">
      {/* Array of different colored avatars with user icons */}
      <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-yellow-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-white bg-green-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </div>
    <p className="text-sm">Join active members already waiting for this feature</p>
  </div>
</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}