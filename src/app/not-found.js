'use client';
import Link from 'next/link';
import { ArrowLeft, Search, Home, Compass, HelpCircle, RefreshCw } from 'lucide-react';
import Navbar from './components/landing/Navbar';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-6">
                <span className="text-3xl mr-2">🔍</span>
                404 Error
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Page Not Found
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                Oops! It seems like you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            {/* Creative 404 illustration */}
            <div className="max-w-3xl mx-auto mb-16 relative">
              <div className="aspect-[16/9] bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl overflow-hidden shadow-xl relative">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
                  
                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Animated elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="text-[120px] md:text-[180px] font-bold opacity-20">404</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-pulse">
                            <Compass className="h-12 w-12 md:h-16 md:w-16 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xl md:text-2xl font-medium mb-2">Lost in digital space</p>
                    <p className="text-indigo-200 max-w-md mx-auto">
                      Don't worry, we'll help you find your way back
                    </p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-8 left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-float-slow">
                  <Search className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute bottom-12 left-1/4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-float">
                  <HelpCircle className="h-5 w-5 text-white" />
                </div>
                
                <div className="absolute top-1/3 right-12 w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-float-reverse">
                  <RefreshCw className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Link>
                
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors duration-300 shadow-sm"
                >
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </div>
              
              <p className="text-gray-500">
                Or try searching for what you're looking for
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search for pages, resources, projects..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 5s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
} 