'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from './components/landing/Navbar';
import Clubs from './components/landing/Clubs';
import ProjectsSection from './components/landing/ProjectsSection';
import FeaturedStartups from './components/landing/FeaturedStartups';
import HowItWorks from './components/landing/HowItWorks';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-700/50 text-indigo-200 rounded-full text-sm font-medium mb-6">
                Connect. Collaborate. Create.
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Where Students, Startups & Clubs <span className="text-blue-300">Collaborate</span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-lg">
                Join a vibrant ecosystem where students can work on real projects, 
                startups can find fresh talent, and clubs can build thriving communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors duration-300 text-base font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="#how-it-works" className="inline-flex items-center px-6 py-3 bg-indigo-700/30 text-white rounded-lg hover:bg-indigo-700/50 transition-colors duration-300 text-base font-medium">
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-700/50">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Create Projects</h3>
                      <p className="text-indigo-200 text-sm">Start your own or join existing ones</p>
                    </div>
                    
                    <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-700/50">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Join Clubs</h3>
                      <p className="text-indigo-200 text-sm">Connect with like-minded peers</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-700/50">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Work with Startups</h3>
                      <p className="text-indigo-200 text-sm">Gain real-world experience</p>
                    </div>
                    
                    <div className="bg-indigo-800/50 rounded-lg p-4 border border-indigo-700/50">
                      <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Attend Events</h3>
                      <p className="text-indigo-200 text-sm">Learn and network with peers</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-indigo-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-indigo-800 bg-gradient-to-br from-${['blue', 'indigo', 'purple', 'pink', 'indigo'][i]}-400 to-${['blue', 'indigo', 'purple', 'pink', 'indigo'][i]}-600`}></div>
                      ))}
                      <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-medium">+99</div>
                    </div>
                    <span className="text-indigo-200 text-sm">Join active members today</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg rotate-12 blur-sm opacity-50"></div>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg -rotate-12 blur-sm opacity-50"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>
      
      {/* Projects Section */}
      <ProjectsSection />
      
      {/* Clubs Section */}
      <Clubs />
      
      {/* Featured Startups Section */}
      <FeaturedStartups />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
            <p className="text-lg text-indigo-200 mb-8">
              Create your profile today and start connecting with peers, clubs, and startups.
              Your next collaboration is just a click away.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors duration-300 text-base font-medium">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/login" className="inline-flex items-center px-6 py-3 bg-indigo-700/30 text-white rounded-lg hover:bg-indigo-700/50 transition-colors duration-300 text-base font-medium">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}