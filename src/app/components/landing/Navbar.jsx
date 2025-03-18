import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar({ forceLight = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Calculate if we should show light mode (white background) elements
  const showLight = scrolled || forceLight;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      showLight ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            {/* Logo using SVG for better quality */}
            <div className="relative h-9 w-9 flex items-center justify-center">
              {!showLight && (
                <div className="w-9 h-9">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG path from your justants_logo_only.svg file - using a white version */}
                    <path d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3ZM18 8C20.2 8 22 9.8 22 12C22 14.2 20.2 16 18 16C15.8 16 14 14.2 14 12C14 9.8 15.8 8 18 8ZM26 24C26 27.314 22.418 30 18 30C13.582 30 10 27.314 10 24V22C10 20.346 11.346 19 13 19H23C24.654 19 26 20.346 26 22V24Z" fill="white"/>
                  </svg>
                </div>
              )}
              
              {showLight && (
                <div className="w-9 h-9">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG path from your justants_logo_only.svg file - using a colored version */}
                    <path d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3ZM18 8C20.2 8 22 9.8 22 12C22 14.2 20.2 16 18 16C15.8 16 14 14.2 14 12C14 9.8 15.8 8 18 8ZM26 24C26 27.314 22.418 30 18 30C13.582 30 10 27.314 10 24V22C10 20.346 11.346 19 13 19H23C24.654 19 26 20.346 26 22V24Z" fill="#4F46E5"/>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <span className={`text-2xl font-bold transition-colors duration-300 ${showLight ? 'text-indigo-600' : 'text-white'}`}>
                Just ants
              </span>
              <span className={`text-xs transition-colors duration-300 -mt-1 ${showLight ? 'text-gray-500' : 'text-gray-200'}`}>
                Connect. Collaborate. Grow.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative">
              <button 
                className={`px-3 py-2 rounded-md flex items-center ${
                  showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
                }`}
                onClick={() => toggleDropdown('explore')}
                onMouseEnter={() => setActiveDropdown('explore')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                Explore
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {activeDropdown === 'explore' && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-all duration-200 origin-top-left"
                  onMouseEnter={() => setActiveDropdown('explore')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link href="/clubs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Tech Clubs
                  </Link>
                  <Link href="/startups" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Startups
                  </Link>
                  <Link href="/projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Projects
                  </Link>
                  <Link href="/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                    Events
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/how-it-works" 
              className={`px-3 py-2 rounded-md ${
                showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
              }`}
            >
              How It Works
            </Link>
            
            <Link 
              href="/pricing" 
              className={`px-3 py-2 rounded-md ${
                showLight ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
              }`}
            >
              Pricing
            </Link>
            
            <Link 
              href="/login" 
              className={`px-4 py-2 rounded-lg ml-2 ${
                showLight 
                  ? 'text-gray-700 hover:text-indigo-600 border border-gray-200' 
                  : 'text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              Login
            </Link>
            
            <Link 
              href="/register" 
              className={`px-4 py-2 rounded-lg ${
                showLight 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-white text-indigo-600 hover:bg-gray-100'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${showLight ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${showLight ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg w-full overflow-hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div>
              <button 
                className="w-full flex justify-between items-center px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50"
                onClick={() => toggleDropdown('mobile-explore')}
              >
                Explore
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'mobile-explore' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'mobile-explore' && (
                <div className="pl-4 space-y-1 mt-1 overflow-hidden">
                  <Link href="/clubs" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-indigo-50">
                    Tech Clubs
                  </Link>
                  <Link href="/startups" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-indigo-50">
                    Startups
                  </Link>
                  <Link href="/projects" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-indigo-50">
                    Projects
                  </Link>
                  <Link href="/events" className="block px-3 py-2 rounded-md text-gray-600 hover:bg-indigo-50">
                    Events
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/how-it-works" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50">
              How It Works
            </Link>
            
            <Link href="/pricing" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50">
              Pricing
            </Link>
            
            <Link href="/login" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50">
              Login
            </Link>
            
            <Link href="/register" className="block px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}