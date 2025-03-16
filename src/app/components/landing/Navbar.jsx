import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold ${scrolled ? 'text-indigo-600' : 'text-white'}`}>
              StartupNet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="relative">
              <button 
                className={`px-3 py-2 rounded-md flex items-center ${
                  scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
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
                scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
              }`}
            >
              How It Works
            </Link>
            
            <Link 
              href="/pricing" 
              className={`px-3 py-2 rounded-md ${
                scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'
              }`}
            >
              Pricing
            </Link>
            
            <Link 
              href="/login" 
              className={`px-4 py-2 rounded-lg ml-2 ${
                scrolled 
                  ? 'text-gray-700 hover:text-indigo-600' 
                  : 'text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              Login
            </Link>
            
            <Link 
              href="/register" 
              className={`px-4 py-2 rounded-lg ${
                scrolled 
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
              <X className={`h-6 w-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
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
                <div className="pl-4 space-y-1 mt-1">
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