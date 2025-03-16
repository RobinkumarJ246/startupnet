import { useState } from 'react';
import { ArrowRight, Users, Building, Lightbulb, MessageSquare, Calendar, Rocket } from 'lucide-react';

const collaborationTypes = [
  {
    id: 'students',
    title: 'Students',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    description: 'Connect with peers, join university clubs, contribute to projects, and build your portfolio.',
    features: [
      'Join university or independent clubs',
      'Collaborate on student-led projects',
      'Contribute to startup projects',
      'Build a professional portfolio',
      'Connect with industry mentors',
      'Participate in hackathons and events'
    ]
  },
  {
    id: 'startups',
    title: 'Startups',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
    description: 'Find young talent, host events, collaborate with students and other startups.',
    features: [
      'Discover and recruit student talent',
      'Host events and workshops',
      'Collaborate with other startups',
      'Create project spaces for teams',
      'Mentor student developers',
      'Showcase your company culture'
    ]
  },
  {
    id: 'clubs',
    title: 'Clubs',
    icon: Building,
    color: 'from-orange-500 to-red-500',
    description: 'Host events, promote your presence, and create a community around shared interests.',
    features: [
      'Organize tech events and workshops',
      'Create a personalized club feed',
      'Manage projects and teams',
      'Connect with industry partners',
      'Showcase member achievements',
      'Build a knowledge repository'
    ]
  }
];

export default function CollaborationSection() {
  const [activeTab, setActiveTab] = useState('students');
  
  const activeType = collaborationTypes.find(type => type.id === activeTab);
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Collaboration Ecosystem
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform brings together students, startups, and clubs to create a vibrant ecosystem 
            where ideas flourish and projects come to life.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-12">
          {collaborationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                className={`flex items-center px-6 py-3 m-2 rounded-full transition-all duration-300 ${
                  activeTab === type.id
                    ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(type.id)}
              >
                <Icon className="h-5 w-5 mr-2" />
                {type.title}
              </button>
            );
          })}
        </div>
        
        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Features */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${activeType.color} flex items-center justify-center mb-6`}>
              {activeType && <activeType.icon className="h-6 w-6 text-white" />}
            </div>
            <h3 className="text-2xl font-bold mb-4">{activeType.title} Collaboration</h3>
            <p className="text-gray-600 mb-6">{activeType.description}</p>
            
            <ul className="space-y-3">
              {activeType.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className={`p-1 rounded-full bg-gradient-to-r ${activeType.color} mr-3 mt-1`}>
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`mt-8 inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r ${activeType.color} text-white`}>
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
          
          {/* Right: Interactive Illustration */}
          <div className="relative">
            {activeTab === 'students' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Student Dashboard</h3>
                    <p className="text-sm text-gray-500">Personalized collaboration hub</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                      Project Opportunities
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center">
                        <span className="text-sm">AI Research Assistant</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Open</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center">
                        <span className="text-sm">Mobile App Development</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">3 Positions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 text-indigo-500 mr-2" />
                      Upcoming Events
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="text-sm font-medium">Hackathon Weekend</div>
                        <div className="text-xs text-gray-500">This Saturday • Web3 Club</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <MessageSquare className="h-4 w-4 text-purple-500 mr-2" />
                      Club Discussions
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-sm">New thread in AI/ML Club</div>
                      <div className="text-xs text-gray-500">5 new messages</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'startups' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Rocket className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Startup Dashboard</h3>
                    <p className="text-sm text-gray-500">Talent & collaboration hub</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 text-indigo-500 mr-2" />
                      Talent Pool
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="text-sm font-medium">Frontend Developers</div>
                        <div className="text-xs text-gray-500">12 available candidates</div>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="text-sm font-medium">ML Engineers</div>
                        <div className="text-xs text-gray-500">8 available candidates</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Building className="h-4 w-4 text-blue-500 mr-2" />
                      Partner Startups
                    </h4>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      <div className="bg-white p-2 rounded-full border border-gray-200 w-10 h-10 flex-shrink-0"></div>
                      <div className="bg-white p-2 rounded-full border border-gray-200 w-10 h-10 flex-shrink-0"></div>
                      <div className="bg-white p-2 rounded-full border border-gray-200 w-10 h-10 flex-shrink-0"></div>
                      <div className="bg-white p-2 rounded-full border border-gray-200 w-10 h-10 flex-shrink-0"></div>
                      <div className="bg-white p-2 rounded-full border border-gray-200 w-10 h-10 flex-shrink-0 flex items-center justify-center text-xs">+12</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 text-red-500 mr-2" />
                      Your Events
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-sm font-medium">Tech Talk: Future of AI</div>
                      <div className="text-xs text-gray-500">Next Tuesday • 45 attendees</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'clubs' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Building className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Club Management</h3>
                    <p className="text-sm text-gray-500">Community & event hub</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 text-green-500 mr-2" />
                      Member Activity
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Active Members</div>
                          <div className="text-xs text-gray-500">Last 7 days</div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">87%</div>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                      Club Projects
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center">
                        <span className="text-sm">AR Campus Tour</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center">
                        <span className="text-sm">Blockchain Voting System</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Planning</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                      Upcoming Events
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-sm font-medium">Workshop: Intro to React</div>
                      <div className="text-xs text-gray-500">This Friday • 32 registered</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full filter blur-xl opacity-70 z-0"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full filter blur-xl opacity-70 z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
} 