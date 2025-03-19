'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Code, Users, Music, Laptop, 
  Sparkles, Globe2, Building, School, 
  ArrowLeft, ArrowRight, AlertCircle, Trophy,
  FileText, CheckCircle2, Tag, Lightbulb, Star,
  DollarSign, Award, Filter, ChevronsUpDown,
  ListChecks, Clock, MapPin, Rocket, Gift, Lock, Pencil, PartyPopper
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';

const HostEventPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState(null);

  // Get user type from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserType(parsedUser.type);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const eventTypes = [
    {
      id: 'hackathon',
      title: 'Hackathon',
      description: 'Host a coding competition for developers to build innovative solutions within a time limit',
      icon: Code,
      color: 'from-blue-600 to-indigo-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      available: true,
      features: [
        'Set prize pools and rewards',
        'Define technical requirements',
        'Add judging criteria',
        'Provide resources and mentorship'
      ],
      benefits: 'Perfect for finding tech talent and innovative solutions to problems.'
    },
    {
      id: 'workshop',
      title: 'Workshop',
      description: 'Organize hands-on learning sessions to teach skills and share knowledge',
      icon: Laptop,
      color: 'from-green-600 to-teal-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      available: false,
      features: [
        'Set workshop schedule',
        'Define learning outcomes',
        'Provide materials & resources',
        'Allow participant registration'
      ],
      benefits: 'Great for skill-building, collaboration and knowledge sharing.'
    },
    {
      id: 'cultural',
      title: 'Cultural Event',
      description: 'Host performances, exhibitions, and cultural celebrations for the community',
      icon: PartyPopper,
      color: 'from-purple-600 to-pink-700',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      available: false,
      features: [
        'Set up performers and showcases',
        'Create event schedule',
        'Manage audience registration',
        'Handle venue arrangements'
      ],
      benefits: 'Perfect for cultural performances, art, celebrations and festivities.'
    }
  ];

  if (!userType || (userType !== 'startup' && userType !== 'club')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Navbar forceLight={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">Only startups and clubs can host events.</p>
            <button
              onClick={() => router.push('/events')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      {/* Hero Section with animated elements */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          
          {/* Floating icons */}
          <div className="absolute top-20 left-16 text-white/20 animate-float">
            <Code className="h-8 w-8" />
          </div>
          <div className="absolute top-32 right-24 text-white/20 animate-float" style={{ animationDelay: '1s' }}>
            <Trophy className="h-8 w-8" />
          </div>
          <div className="absolute bottom-24 left-36 text-white/20 animate-float" style={{ animationDelay: '2s' }}>
            <Laptop className="h-8 w-8" />
          </div>
          <div className="absolute top-60 right-40 text-white/20 animate-float" style={{ animationDelay: '3s' }}>
            <Music className="h-8 w-8" />
          </div>
            </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-block animate-bounce-slow mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-4">
              <Calendar className="h-10 w-10 text-blue-300" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-md">
            Host Your <span className="text-blue-300">Event</span>
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Connect with the community by hosting exceptional events. 
            Choose from our growing list of event types to get started.
          </p>
          
          {/* Stats */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-200" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Expand Your Network</h3>
              <p className="text-indigo-200">Connect with students, innovators and professionals</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Lightbulb className="h-6 w-6 text-blue-200" />
                            </div>
                          </div>
              <h3 className="text-xl font-bold text-white mb-1">Showcase Innovation</h3>
              <p className="text-indigo-200">Create platforms for talent, ideas and creativity</p>
                    </div>
                    
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Star className="h-6 w-6 text-blue-200" />
                        </div>
                      </div>
              <h3 className="text-xl font-bold text-white mb-1">Build Your Brand</h3>
              <p className="text-indigo-200">Gain visibility and establish your reputation</p>
                          </div>
                        </div>
                      </div>
      </section>

      {/* Choose Event Type Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative -mt-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Event Type</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the type of event you'd like to host. We're continually adding new event types
            to help you engage with the community in different ways.
          </p>
                    </div>
                    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventTypes.map((eventType) => (
            <div key={eventType.id} className={`relative bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl ${eventType.available ? 'hover:scale-[1.02]' : 'opacity-90'}`}>
              {/* Color Bar */}
              <div className={`h-2 w-full bg-gradient-to-r ${eventType.color}`}></div>
              
              <div className="p-6">
                <div className={`w-16 h-16 ${eventType.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <eventType.icon className={`h-8 w-8 ${eventType.iconColor}`} />
                      </div>
                      
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                  {eventType.title}
                  {!eventType.available && (
                    <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full inline-flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Coming Soon
                    </span>
                  )}
                </h3>
                
                <p className="text-gray-600 mb-6">{eventType.description}</p>
                
                <div className="space-y-3 mb-8">
                  {eventType.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Why host this?</span> {eventType.benefits}
                  </p>
                </div>
                
                {eventType.available ? (
                  <Link href={`/host-event/${eventType.id}`} className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all duration-200">
                    Create {eventType.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <button disabled className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed shadow">
                    <Lock className="mr-2 h-4 w-4" />
                    Coming Soon
                            </button>
                          )}
                        </div>
                        
              {/* Bottom Ribbon for Available */}
              {eventType.available && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-medium rounded-full shadow-sm">
                  Available Now
                </div>
              )}
                      </div>
          ))}
                    </div>
                  </div>
                  
      {/* How It Works Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Creating and hosting an event is simple. Follow these easy steps to get started.
                          </p>
                        </div>
                        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                1
                        </div>
              <div className="pt-4">
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Event Type</h3>
                <p className="text-gray-600">Select the type of event that fits your needs and goals.</p>
                      </div>
                    </div>
                    
            <div className="bg-white rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                2
                              </div>
              <div className="pt-4">
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pencil className="h-6 w-6 text-blue-600" />
                            </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fill Event Details</h3>
                <p className="text-gray-600">Provide all necessary information about your event.</p>
                    </div>
                  </div>
                  
            <div className="bg-white rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                3
                  </div>
              <div className="pt-4">
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Publish Event</h3>
                <p className="text-gray-600">Review and publish your event to make it visible to everyone.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                4
              </div>
              <div className="pt-4">
                <div className="mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Participants</h3>
                <p className="text-gray-600">Track registrations and communicate with participants.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know about hosting events on our platform</p>
            </div>
            
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Who can host events?</h3>
            <p className="text-gray-600">Currently, startups and student clubs registered on our platform can host events. Individual students cannot host events but can participate in them.</p>
            </div>
            
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a cost to host events?</h3>
            <p className="text-gray-600">Currently, hosting events on our platform is completely free. You can create and manage as many events as you'd like at no cost.</p>
            </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">When will more event types be available?</h3>
            <p className="text-gray-600">We're working on adding workshops and cultural events very soon. Other event types will be added based on community feedback and demand.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I edit my event after publishing?</h3>
            <p className="text-gray-600">Yes, you can edit most details of your event after publishing. However, certain changes may require review by our team, especially if participants have already registered.</p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Host Your First Event?</h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Choose an event type and start creating an unforgettable experience for your community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/host-event/hackathon" className="px-8 py-4 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors shadow-lg font-medium text-lg">
              Host a Hackathon
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
            
            <Link href="/events" className="px-8 py-4 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-lg">
              Explore Events
            </Link>
          </div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HostEventPage;