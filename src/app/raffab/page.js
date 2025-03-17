'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bug, 
  CheckCircle, 
  Lightbulb, 
  MessageCircle, 
  Puzzle, 
  Hammer, 
  Wrench 
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import RequestTypeCard from '../components/requests/RequestTypeCard';
import RequestForm from '../components/requests/RequestForm';
import RequestStatusTracker from '../components/requests/RequestStatusTracker';
import PopularRequests from '../components/requests/PopularRequests';

export default function FeatureRequestPage() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  
  const requestTypes = [
    {
      id: 'bug',
      title: 'Bug Report',
      description: 'Found something that\'s not working? Help us squash those bugs!',
      icon: <Bug size={24} />,
      color: 'from-red-400 to-red-500',
      formFields: ['title', 'description', 'steps', 'device']
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Have an idea for something new? We\'d love to hear it!',
      icon: <Lightbulb size={24} />,
      color: 'from-indigo-400 to-indigo-500',
      formFields: ['title', 'description', 'benefit']
    },
    {
      id: 'improvement',
      title: 'Improvement Suggestion',
      description: 'Think something could work better? Tell us how!',
      icon: <Wrench size={24} />,
      color: 'from-purple-400 to-purple-500',
      formFields: ['title', 'description', 'current', 'suggestion']
    },
    {
      id: 'integration',
      title: 'Integration Request',
      description: 'Want StartupsNet to connect with other tools? Let us know!',
      icon: <Puzzle size={24} />,
      color: 'from-blue-400 to-blue-500',
      formFields: ['title', 'description', 'tool', 'benefit']
    }
  ];
  
  const handleSubmit = (formData) => {
    setSubmissionStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setSubmittedRequest(formData);
      setSubmissionStatus('success');
      setActiveRequest(null); // Reset active request
    }, 1500);
  };
  
  const handleCancel = () => {
    setActiveRequest(null);
  };
  
  const resetForm = () => {
    setSubmittedRequest(null);
    setSubmissionStatus(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute right-[15%] bottom-[10%] w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
        <div className="mt-4 mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 shadow-sm">
              Raffab - Request a feature or fix a bug
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Feature Requests &</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">Bug Reports</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            We're constantly improving StartupsNet based on your feedback. 
            Let us know what you'd like to see next!
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {!submittedRequest && !activeRequest && (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What would you like to share with us?</h2>
                  <p className="text-gray-600 mb-6">
                    Select one of the options below to get started with your request.
                  </p>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    {requestTypes.map((type) => (
                      <RequestTypeCard 
                        key={type.id} 
                        type={type} 
                        onClick={() => setActiveRequest(type)} 
                      />
                    ))}
                  </div>
                </div>
                
                <PopularRequests />
              </>
            )}
            
            {activeRequest && !submittedRequest && (
              <RequestForm 
                activeType={activeRequest} 
                onSubmit={handleSubmit} 
                onCancel={handleCancel}
              />
            )}
            
            {submittedRequest && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Thank you for your {submittedRequest.type.id}!
                </h2>
                
                <p className="mt-3 text-gray-600">
                  We've received your {submittedRequest.type.id} and our team will review it shortly.
                  We'll keep you updated on its progress.
                </p>
                
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit another request
                  </button>
                  
                  <Link
                    href="/"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg text-white shadow-sm hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Return to home
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/3 space-y-8">
            <RequestStatusTracker status={submittedRequest ? 'submitted' : 'submitted'} />
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Process Requests</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">We Listen</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Every request is read and considered by our product team
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">We Prioritize</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Requests are evaluated and added to our development roadmap
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">We Build</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Our engineering team turns your ideas into features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 