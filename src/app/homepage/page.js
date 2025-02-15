'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Constants
const FEED_FILTERS = {
  ALL: 'all',
  PROJECTS: 'projects',
  DISCUSSIONS: 'discussions',
  EVENTS: 'events'
};

const SKILLS = ['React', 'Node.js', 'Python', 'UI/UX', 'Mobile Dev', 'DevOps', 'AI/ML', 'Blockchain'];

const HomePage = () => {
  const [userType, setUserType] = useState('student');
  const [activeFilter, setActiveFilter] = useState(FEED_FILTERS.ALL);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // New states for enhanced functionality
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  
  // Simulated feed data loading
  useEffect(() => {
    // In real app, this would be an API call
    const mockFeedItems = generateMockFeedItems(activeFilter);
    setFeedItems(mockFeedItems);
  }, [activeFilter]);

  // Mobile menu handler
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  // Post creation handler
  const handleCreatePost = (postData) => {
    // In real app, this would be an API call
    console.log('Creating post:', postData);
    setIsPostModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navigation */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold text-indigo-600">StartupNet</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-6">
                <NavLink href="/feed" active={true}>Home</NavLink>
                <NavLink href="/explore">Explore</NavLink>
                {userType === 'organization' && (
                  <NavLink href="/talent">Talent Pool</NavLink>
                )}
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/events">Events</NavLink>
              </div>
            </div>

            {/* Search and User Actions */}
            <div className="flex items-center gap-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects, people, or discussions..."
              />
              
              <NotificationBell count={3} />
              
              <UserMenu 
                userType={userType}
                onToggleType={() => setUserType(prev => 
                  prev === 'student' ? 'organization' : 'student'
                )}
              />
              
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={toggleMobileMenu}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <MobileMenu userType={userType} onClose={() => setShowMobileMenu(false)} />
      )}

      {/* Main Content */}
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Enhanced Left Sidebar */}
          <aside className="md:col-span-3 space-y-6">
            <ProfileCard
              userType={userType}
              name={userType === 'student' ? 'John Doe' : 'TechStart Inc'}
              role={userType === 'student' ? 'Computer Science Student' : 'Technology Startup'}
              completionPercentage={85}
            />

            <QuickLinks userType={userType} />
            
            {userType === 'student' && (
              <SkillsCard
                skills={selectedSkills}
                availableSkills={SKILLS}
                onSkillToggle={(skill) => {
                  setSelectedSkills(prev => 
                    prev.includes(skill)
                      ? prev.filter(s => s !== skill)
                      : [...prev, skill]
                  );
                }}
              />
            )}
          </aside>

          {/* Enhanced Main Feed */}
          <div className="md:col-span-6 space-y-6">
            <FeedFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <CreatePost
              userType={userType}
              onCreatePost={() => setIsPostModalOpen(true)}
            />

            <FeedContent
              items={feedItems}
              userType={userType}
            />
          </div>

          {/* Enhanced Right Sidebar */}
          <aside className="md:col-span-3 space-y-6">
            <TrendingTopics />
            
            <SuggestedConnections userType={userType} />
            
            <UpcomingEvents />
            
            {userType === 'organization' && (
              <ProjectMetrics 
                metrics={{
                  activeProjects: 5,
                  totalApplications: 45,
                  pendingReviews: 12,
                  avgResponseTime: '2.5 days'
                }}
              />
            )}
          </aside>
        </div>
      </main>

      {/* Modals */}
      {isPostModalOpen && (
        <CreatePostModal
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreatePost}
          userType={userType}
        />
      )}
    </div>
  );
};

// Component function declarations
const NavLink = ({ href, children, active }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active 
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="hidden md:flex relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-72 px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <svg
      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
);

const NotificationBell = ({ count }) => (
  <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {count > 0 && (
      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {count}
      </span>
    )}
  </button>
);

const UserMenu = ({ userType, onToggleType }) => (
  <button 
    onClick={onToggleType}
    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
  >
    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
      <span className="text-indigo-600 font-medium">
        {userType === 'student' ? 'S' : 'O'}
      </span>
    </div>
  </button>
);

const MobileMenu = ({ userType, onClose }) => (
  <div className="fixed inset-0 z-50 md:hidden">
    <div className="fixed inset-0 bg-black/20" onClick={onClose} />
    <div className="fixed top-0 right-0 bottom-0 w-64 bg-white p-6">
      <div className="flex justify-between items-center mb-8">
        <span className="font-semibold">Menu</span>
        <button onClick={onClose} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="space-y-4">
        <Link href="/feed" className="block py-2 text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link href="/explore" className="block py-2 text-gray-600 hover:text-gray-900">
          Explore
        </Link>
        {userType === 'organization' && (
          <Link href="/talent" className="block py-2 text-gray-600 hover:text-gray-900">
            Talent Pool
          </Link>
        )}
        <Link href="/projects" className="block py-2 text-gray-600 hover:text-gray-900">
          Projects
        </Link>
        <Link href="/events" className="block py-2 text-gray-600 hover:text-gray-900">
          Events
        </Link>
      </nav>
    </div>
  </div>
);

const ProfileCard = ({ userType, name, role, completionPercentage }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="text-center mb-4">
      <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="text-2xl text-indigo-600 font-medium">
          {name[0]}
        </span>
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
    
    <div className="border-t pt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Profile Completion</span>
        <span className="text-indigo-600 font-medium">{completionPercentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  </div>
);

const QuickLinks = ({ userType }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="font-semibold mb-4">Quick Links</h3>
    <div className="space-y-3">
      {userType === 'student' ? (
        <>
          <QuickLink href="/my-projects" icon="📂" text="My Projects" />
          <QuickLink href="/applications" icon="📝" text="My Applications" />
          <QuickLink href="/skills" icon="🎯" text="Skills" />
          <QuickLink href="/learning" icon="📚" text="Learning Path" />
        </>
      ) : (
        <>
          <QuickLink href="/post-project" icon="➕" text="Post a Project" />
          <QuickLink href="/manage-projects" icon="📊" text="Manage Projects" />
          <QuickLink href="/candidates" icon="👥" text="Candidates" />
          <QuickLink href="/analytics" icon="📈" text="Analytics" />
        </>
      )}
    </div>
  </div>
);

const QuickLink = ({ href, icon, text }) => (
  <Link 
    href={href} 
    className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
  >
    <span className="mr-3">{icon}</span> {text}
  </Link>
);

const SkillsCard = ({ skills, availableSkills, onSkillToggle }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="font-semibold mb-4">My Skills</h3>
    <div className="flex flex-wrap gap-2">
      {availableSkills.map((skill) => (
        <button
          key={skill}
          onClick={() => onSkillToggle(skill)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            skills.includes(skill)
            ? 'bg-indigo-100 text-indigo-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {skill}
      </button>
    ))}
  </div>
</div>
);

const FeedFilters = ({ activeFilter, onFilterChange }) => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <div className="flex space-x-4">
    {Object.entries(FEED_FILTERS).map(([key, value]) => (
      <button
        key={key}
        onClick={() => onFilterChange(value)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeFilter === value
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {key.charAt(0) + key.slice(1).toLowerCase()}
      </button>
    ))}
  </div>
</div>
);

const CreatePost = ({ userType, onCreatePost }) => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <div className="flex gap-4">
    <div className="w-10 h-10 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center">
      <span className="text-indigo-600 font-medium">
        {userType === 'student' ? 'S' : 'O'}
      </span>
    </div>
    <button
      onClick={onCreatePost}
      className="flex-grow text-left px-4 py-2 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
    >
      {userType === 'student'
        ? "Share your project or start a discussion..."
        : "Post a project or share an update..."}
    </button>
  </div>
</div>
);

const FeedContent = ({ items, userType }) => (
<div className="space-y-6">
  {items.map((item, index) => (
    <FeedItem key={index} item={item} userType={userType} />
  ))}
</div>
);

const FeedItem = ({ item, userType }) => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <div className="flex justify-between items-start mb-4">
    <div className="flex gap-3">
      <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
        <span className={`${item.textColor} font-medium`}>{item.avatar}</span>
      </div>
      <div>
        <h4 className="font-medium">{item.author}</h4>
        <p className="text-sm text-gray-600">{item.action}</p>
      </div>
    </div>
    <button className="text-gray-600 hover:text-gray-900">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>
  </div>
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
    <p className="text-gray-600">{item.content}</p>
  </div>
  {item.tags && (
    <div className="flex flex-wrap gap-2 mb-4">
      {item.tags.map((tag, index) => (
        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
          {tag}
        </span>
      ))}
    </div>
  )}
  <FeedItemActions item={item} />
</div>
);

const FeedItemActions = ({ item }) => (
<div className="flex justify-between items-center text-sm text-gray-600">
  <span>{item.timestamp}</span>
  <div className="flex gap-4">
    <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>{item.likes}</span>
    </button>
    <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span>{item.comments}</span>
    </button>
  </div>
</div>
);

const TrendingTopics = () => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <h3 className="font-semibold mb-4">Trending Topics</h3>
  <div className="space-y-3">
    {[
      { tag: '#RemoteWork', posts: 234 },
      { tag: '#WebDev', posts: 189 },
      { tag: '#StartupLife', posts: 145 },
      { tag: '#Innovation', posts: 132 },
      { tag: '#TechTrends', posts: 98 }
    ].map((topic, index) => (
      <div key={index} className="flex items-center justify-between">
        <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">
          {topic.tag}
        </span>
        <span className="text-sm text-gray-500">{topic.posts} posts</span>
      </div>
    ))}
  </div>
</div>
);

const SuggestedConnections = ({ userType }) => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <h3 className="font-semibold mb-4">
    {userType === 'student' ? 'Suggested Startups' : 'Suggested Talent'}
  </h3>
  <div className="space-y-4">
    {generateMockConnections(userType).map((connection, index) => (
      <div key={index} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${connection.bgColor} rounded-full flex items-center justify-center`}>
            <span className={`${connection.textColor} font-medium`}>
              {connection.avatar}
            </span>
          </div>
          <div>
            <h4 className="font-medium">{connection.name}</h4>
            <p className="text-sm text-gray-600">{connection.role}</p>
          </div>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          {userType === 'student' ? 'Follow' : 'Connect'}
        </button>
      </div>
    ))}
  </div>
</div>
);

const UpcomingEvents = () => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <h3 className="font-semibold mb-4">Upcoming Events</h3>
  <div className="space-y-4">
    {[
      {
        title: 'Startup Networking Event',
        date: 'Feb 15, 2025',
        location: 'Virtual',
        type: 'Networking'
      },
      {
        title: 'Tech Workshop',
        date: 'Feb 20, 2025',
        location: 'Online',
        type: 'Workshop'
      },
      {
        title: 'Pitch Competition',
        date: 'Feb 25, 2025',
        location: 'Virtual',
        type: 'Competition'
      }
    ].map((event, index) => (
      <div key={index} className="border-l-4 border-indigo-500 pl-3">
        <h4 className="font-medium">{event.title}</h4>
        <p className="text-sm text-gray-600">
          {event.date} • {event.location}
        </p>
        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
          {event.type}
        </span>
      </div>
    ))}
  </div>
</div>
);

const ProjectMetrics = ({ metrics }) => (
<div className="bg-white rounded-lg p-4 shadow-sm">
  <h3 className="font-semibold mb-4">Project Metrics</h3>
  <div className="grid grid-cols-2 gap-4">
    <MetricCard
      label="Active Projects"
      value={metrics.activeProjects}
      icon="📊"
    />
    <MetricCard
      label="Applications"
      value={metrics.totalApplications}
      icon="📝"
    />
    <MetricCard
      label="Pending Reviews"
      value={metrics.pendingReviews}
      icon="⏳"
    />
    <MetricCard
      label="Avg Response"
      value={metrics.avgResponseTime}
      icon="⚡"
    />
  </div>
</div>
);

const MetricCard = ({ label, value, icon }) => (
<div className="bg-gray-50 p-3 rounded-lg">
  <div className="flex items-center gap-2 mb-1">
    <span>{icon}</span>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
  <p className="text-lg font-semibold">{value}</p>
</div>
);

const CreatePostModal = ({ onClose, onSubmit, userType }) => (
<div className="fixed inset-0 z-50 flex items-center justify-center">
  <div className="fixed inset-0 bg-black/20" onClick={onClose} />
  <div className="relative bg-white rounded-lg p-6 w-full max-w-lg">
    <h3 className="text-lg font-semibold mb-4">
      {userType === 'student' ? 'Create Post' : 'Post a Project'}
    </h3>
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({
        title: e.target.title.value,
        content: e.target.content.value,
      });
    }}>
      <input
        name="title"
        type="text"
        placeholder="Title"
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        name="content"
        placeholder="What would you like to share?"
        className="w-full px-4 py-2 mb-4 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Post
        </button>
      </div>
    </form>
  </div>
</div>
);

// Utility functions
const generateMockFeedItems = (filter) => {
// In a real app, this would be an API call
return [
  {
    author: 'TechCorp',
    avatar: 'T',
    action: 'Posted a new project',
    title: 'Full Stack Developer Needed',
    content: 'We\'re looking for a talented developer to join our team for an exciting blockchain project...',
    tags: ['React', 'Node.js', 'Blockchain'],
    timestamp: '2 hours ago',
    likes: 12,
    comments: 8,
    color: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  {
    author: 'Alex Chen',
    avatar: 'A',
    action: 'Started a discussion',
    title: 'Best practices for remote collaboration?',
    content: 'I\'m working on my first remote project and would love to hear your tips...',
    timestamp: '5 hours ago',
    likes: 24,
    comments: 15,
    color: 'bg-green-100',
    textColor: 'text-green-600'
  }
];
};

const generateMockConnections = (userType) => {
if (userType === 'student') {
  return [
    {
      name: 'InnovateTech',
      role: 'AI & ML',
      avatar: 'I',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      name: 'DataFlow',
      role: 'Big Data',
      avatar: 'D',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];
}
return [
  {
    name: 'Sarah Kim',
    role: 'Full Stack Developer',
    avatar: 'S',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    name: 'Mike Chen',
    role: 'UI/UX Designer',
    avatar: 'M',
    bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];
};

export default HomePage;