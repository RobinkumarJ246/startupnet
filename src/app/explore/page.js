'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Calendar, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Search,
  Award,
  TrendingUp,
  Bookmark,
  Clock,
  Users,
  Star,
  Globe,
  Filter,
  ArrowRight,
  Heart,
  Bell,
  Plus,
  MapPin,
  Settings,
  Home,
  Building,
  PenTool,
  Compass,
  Zap,
  Image as ImageIcon,
  Code,
  UserPlus,
  Coffee,
  Newspaper,
  Vote,
  ChevronDown,
  Grid,
  List,
  PlusCircle,
  GraduationCap,
  Briefcase,
  Hash,
  MoreHorizontal,
  ChevronRight,
  Menu
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('for-you');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const UserAvatar = () => (
    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-indigo-600" />
    </div>
  );

  const renderUserBasedContent = () => {
    switch (user.type) {
      case 'student':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recommended for {user.name}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-indigo-50 rounded-lg">
                <Building className="w-10 h-10 text-indigo-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Find startups looking for students</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Discover startups offering internships and projects for {user.major} students
                  </p>
                  <Link 
                    href="/startups"
                    className="inline-flex items-center text-indigo-600 font-medium text-sm mt-2"
                  >
                    Explore startups <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-purple-50 rounded-lg">
                <Users className="w-10 h-10 text-purple-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Join university clubs</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect with clubs at {user.university} related to your interests
                  </p>
                  <Link 
                    href="/clubs"
                    className="inline-flex items-center text-purple-600 font-medium text-sm mt-2"
                  >
                    Discover clubs <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      case 'startup':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recommended for {user.companyName}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-indigo-50 rounded-lg">
                <GraduationCap className="w-10 h-10 text-indigo-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Find talented students</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect with students who are studying in fields related to {user.industry}
                  </p>
                  <Link 
                    href="/students"
                    className="inline-flex items-center text-indigo-600 font-medium text-sm mt-2"
                  >
                    Browse students <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-emerald-50 rounded-lg">
                <Building className="w-10 h-10 text-emerald-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Connect with other startups</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Find potential partners and collaborators in your industry
                  </p>
                  <Link 
                    href="/startups"
                    className="inline-flex items-center text-emerald-600 font-medium text-sm mt-2"
                  >
                    Explore startups <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      case 'club':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recommended for {user.clubName}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-indigo-50 rounded-lg">
                <GraduationCap className="w-10 h-10 text-indigo-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Recruit new members</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect with students who might be interested in joining your club
                  </p>
                  <Link 
                    href="/students"
                    className="inline-flex items-center text-indigo-600 font-medium text-sm mt-2"
                  >
                    Browse students <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-amber-50 rounded-lg">
                <Calendar className="w-10 h-10 text-amber-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Organize events</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Create and promote events for your club members and the wider community
                  </p>
                  <Link 
                    href="/events/create"
                    className="inline-flex items-center text-amber-600 font-medium text-sm mt-2"
                  >
                    Create event <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar forceLight={true} />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* User Profile Quick View */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <UserAvatar />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">
                        {user.type === 'student' ? user.name :
                         user.type === 'startup' ? user.companyName :
                         user.clubName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.type === 'student' ? user.university :
                         user.type === 'startup' ? user.industry :
                         user.parentOrganization}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3 text-gray-500" />
                      View profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Home className="w-4 h-4 mr-3 text-gray-500" />
                      Dashboard
                    </Link>
                    <Link
                      href="/connections"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4 mr-3 text-gray-500" />
                      Connections
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-3 text-gray-500" />
                      Messages
                    </Link>
                    <Link
                      href="/events"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                      Events
                    </Link>
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Trending Topics
                  </h2>
                  <div className="space-y-3">
                    {['Innovation', 'Entrepreneurship', 'Technology', 'Networking', 'Funding'].map((topic) => (
                      <Link
                        key={topic}
                        href={`/topics/${topic.toLowerCase()}`}
                        className="flex items-center px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Hash className="w-4 h-4 mr-3 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-900">{topic}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search & Filter */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for people, startups, or clubs..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  <button className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    All
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    People
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    Startups
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    Clubs
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    Events
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full flex items-center">
                    <Filter className="w-3 h-3 mr-1" />
                    More filters
                  </button>
                </div>
              </div>

              {/* User-based recommendations */}
              {renderUserBasedContent()}

              {/* Feed Navigation */}
              <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('for-you')}
                      className={`px-4 py-4 text-sm font-medium ${
                        activeTab === 'for-you'
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      For You
                    </button>
                    <button
                      onClick={() => setActiveTab('startups')}
                      className={`px-4 py-4 text-sm font-medium ${
                        activeTab === 'startups'
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Startups
                    </button>
                    <button
                      onClick={() => setActiveTab('clubs')}
                      className={`px-4 py-4 text-sm font-medium ${
                        activeTab === 'clubs'
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Clubs
                    </button>
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`px-4 py-4 text-sm font-medium ${
                        activeTab === 'events'
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Events
                    </button>
                  </nav>
                </div>
                <div className="p-6 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                      <PlusCircle className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Coming Soon!</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      We're working on building a vibrant feed of posts, opportunities, and updates from your network.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                      Get notified when it's ready
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Upcoming Events
                  </h2>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-gray-900">Events Coming Soon</h3>
                    <p className="mt-2 text-xs text-gray-600">
                      Stay tuned for upcoming networking events, workshops, and more.
                    </p>
                  </div>
                </div>

                {/* Suggested Connections */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    <span>People to Connect With</span>
                    <Link href="/connections" className="text-xs text-indigo-600 font-medium">
                      See all
                    </Link>
                  </h2>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-gray-900">Suggestions Coming Soon</h3>
                    <p className="mt-2 text-xs text-gray-600">
                      We're building a network of students, startups, and clubs for you to connect with.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <button className="fixed lg:hidden right-6 bottom-6 w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-lg">
        <PlusCircle className="w-6 h-6" />
      </button>
    </main>
  );
} 