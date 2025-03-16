import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Users, Rocket, Code, Building, Zap } from 'lucide-react';

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Connecting Students, Startups & Communities
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Where Collaboration <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                  Drives Innovation
                </span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-xl mx-auto md:mx-0">
                A platform where students, startups, and communities collaborate on projects, 
                share ideas, and build the future together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/register/student"
                  className="px-8 py-4 bg-white text-indigo-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg font-semibold flex items-center justify-center"
                >
                  Join as Student
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/register/startup"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-700 transition-colors duration-300 text-lg font-semibold"
                >
                  Register Startup
                </Link>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transform rotate-3 animate-float">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Project Collaboration</h3>
                    <p className="text-indigo-200 text-sm">Connect with peers and startups</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">AI Research Team</h4>
                      <div className="flex -space-x-2 mt-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border border-indigo-900"></div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white">+3</div>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-200 bg-indigo-900/50 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">TechVision Startup</h4>
                      <p className="text-xs text-indigo-200">Looking for student collaborators</p>
                    </div>
                    <span className="text-xs text-indigo-200 bg-indigo-900/50 px-2 py-1 rounded">3 Roles</span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center mr-3">
                      <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">Hackathon Event</h4>
                      <p className="text-xs text-indigo-200">Hosted by Web3 Club</p>
                    </div>
                    <span className="text-xs text-indigo-200 bg-indigo-900/50 px-2 py-1 rounded">Next Week</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full w-64 h-64 blur-3xl opacity-30"></div>
              <div className="absolute bottom-0 left-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full w-40 h-40 blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-white text-sm mb-2">Scroll to explore</span>
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 bg-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">1000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">200+</div>
              <div className="text-gray-600">Startups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">50+</div>
              <div className="text-gray-600">Tech Clubs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">500+</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 