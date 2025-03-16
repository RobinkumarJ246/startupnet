import { useState } from 'react';
import { ArrowRight, Code, Users, MessageSquare, GitBranch, Star, Zap, Layers, Share2 } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI Research Assistant',
    description: 'An AI-powered research assistant that helps students find and organize academic papers.',
    tags: ['AI', 'Machine Learning', 'Research'],
    members: 7,
    stars: 24,
    image: '/images/project1.jpg',
    type: 'student'
  },
  {
    id: 2,
    title: 'EcoTrack Mobile App',
    description: 'A mobile application that helps users track and reduce their carbon footprint.',
    tags: ['Mobile', 'React Native', 'Sustainability'],
    members: 5,
    stars: 18,
    image: '/images/project2.jpg',
    type: 'startup'
  },
  {
    id: 3,
    title: 'Blockchain Voting System',
    description: 'A secure and transparent voting system built on blockchain technology.',
    tags: ['Blockchain', 'Web3', 'Security'],
    members: 6,
    stars: 32,
    image: '/images/project3.jpg',
    type: 'club'
  },
  {
    id: 4,
    title: 'AR Campus Tour',
    description: 'An augmented reality tour guide for university campuses.',
    tags: ['AR', 'Mobile', 'Education'],
    members: 4,
    stars: 15,
    image: '/images/project4.jpg',
    type: 'student'
  }
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.type === activeFilter);
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Collaborative Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join existing projects or start your own. Connect with contributors, 
            share ideas, and build something amazing together.
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'student', label: 'Student Projects' },
            { id: 'startup', label: 'Startup Projects' },
            { id: 'club', label: 'Club Projects' }
          ].map((filter) => (
            <button
              key={filter.id}
              className={`px-5 py-2 m-2 rounded-lg transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {project.type === 'student' && 'Student Project'}
                  {project.type === 'startup' && 'Startup Project'}
                  {project.type === 'club' && 'Club Project'}
                </div>
              </div>
              
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{project.members} contributors</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-500">{project.stars} stars</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <a 
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium group"
                  >
                    View Project
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <Code className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <GitBranch className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 group"
          >
            Explore All Projects
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
        
        {/* Project Collaboration Space */}
        <div className="mt-20 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 opacity-80"></div>
          </div>
          
          <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-indigo-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl mb-4 transform rotate-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Project Collaboration Space
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Every project gets a dedicated space with powerful tools to help teams collaborate effectively.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Code Collaboration</h4>
                <p className="text-gray-600 mb-4">
                  Share code, review pull requests, and manage versions with integrated tools.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Git Integration</span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Code Review</span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded">Version Control</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Discussion Forums</h4>
                <p className="text-gray-600 mb-4">
                  Dedicated channels for project discussions, updates, and knowledge sharing.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">Threaded Discussions</span>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">File Sharing</span>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">Notifications</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Team Management</h4>
                <p className="text-gray-600 mb-4">
                  Organize team members, assign roles, and track contributions to the project.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Role Assignment</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Task Tracking</span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">Progress Reports</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Demo Preview */}
            <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Project Workspace Preview</h4>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Layers className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="text-sm font-medium">Project Structure</span>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 flex-shrink-0"></span>
                      <span>src/</span>
                    </div>
                    <div className="flex items-center pl-4">
                      <span className="w-4 h-4 mr-2 flex-shrink-0"></span>
                      <span>components/</span>
                    </div>
                    <div className="flex items-center pl-8">
                      <span className="w-4 h-4 mr-2 flex-shrink-0"></span>
                      <span>App.js</span>
                    </div>
                    <div className="flex items-center pl-4">
                      <span className="w-4 h-4 mr-2 flex-shrink-0"></span>
                      <span>utils/</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-3">
                    <MessageSquare className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm font-medium">Recent Discussions</span>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs border-l-2 border-purple-300 pl-2">
                      <div className="font-medium">API Integration</div>
                      <div className="text-gray-500">Updated 2 hours ago</div>
                    </div>
                    <div className="text-xs border-l-2 border-purple-300 pl-2">
                      <div className="font-medium">UI Design Review</div>
                      <div className="text-gray-500">Updated yesterday</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Share2 className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">Team Activity</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">A</div>
                      <span className="text-gray-600">Alex pushed 3 commits</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">S</div>
                      <span className="text-gray-600">Sarah updated documentation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 