import { useState } from 'react';
import { 
  Users, Code, Rocket, Globe, Calendar, 
  Briefcase, MessageSquare, Zap, ArrowRight 
} from 'lucide-react';

const steps = [
  {
    id: 'profile',
    title: 'Create Profile',
    description: 'Sign up and showcase your skills, interests, and educational background',
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    id: 'projects',
    title: 'Start or Join Projects',
    description: 'Create your own projects or contribute to existing ones from peers or startups',
    icon: Code,
    color: 'bg-indigo-500'
  },
  {
    id: 'clubs',
    title: 'Discover Communities',
    description: 'Optionally join tech clubs and communities based on your interests',
    icon: Globe,
    color: 'bg-purple-500'
  },
  {
    id: 'startups',
    title: 'Connect with Startups',
    description: 'Collaborate with innovative startups on real-world projects',
    icon: Rocket,
    color: 'bg-pink-500'
  },
  {
    id: 'events',
    title: 'Attend Events',
    description: 'Participate in club events, industry workshops, and startup meetups',
    icon: Calendar,
    color: 'bg-orange-500'
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState('profile');
  
  const stepDetails = {
    profile: {
      title: 'Build Your Profile',
      description: 'Create a comprehensive profile showcasing your skills, projects, education, and interests. Your profile is your digital portfolio that helps you connect with like-minded peers and attract startup opportunities.',
      features: [
        'Highlight technical skills and proficiency levels',
        'Showcase past projects with descriptions and links',
        'List educational background and certifications',
        'Share your interests and career aspirations'
      ],
      image: '/images/profile-preview.jpg'
    },
    projects: {
      title: 'Project Collaboration',
      description: 'StartupNet gives you the freedom to create your own projects or join existing ones. Each project gets a dedicated workspace with tools for effective collaboration.',
      features: [
        'Create projects and define roles needed',
        'Browse and apply to join interesting projects',
        'Collaborate with version control integration',
        'Build a portfolio of completed work'
      ],
      image: '/images/project-preview.jpg'
    },
    clubs: {
      title: 'Join Tech Communities',
      description: 'Tech clubs and communities are optional but valuable spaces to connect with peers who share your interests. They provide learning opportunities, mentorship, and a sense of belonging.',
      features: [
        'Join university-affiliated or independent clubs',
        'Participate in club-hosted workshops and hackathons',
        'Connect with mentors and industry professionals',
        'Collaborate on club-sponsored projects'
      ],
      image: '/images/clubs-preview.jpg'
    },
    startups: {
      title: 'Startup Collaboration',
      description: 'Connect with innovative startups looking for fresh talent and ideas. Contribute to real-world projects, gain industry experience, and potentially find internship or job opportunities.',
      features: [
        'Browse startup profiles and open positions',
        'Apply to work on startup projects',
        'Receive mentorship from industry professionals',
        'Build professional connections for future opportunities'
      ],
      image: '/images/startup-preview.jpg'
    },
    events: {
      title: 'Events & Networking',
      description: 'Expand your knowledge and network by attending various events hosted by clubs, startups, and the platform itself. These events provide valuable learning and networking opportunities.',
      features: [
        'Technical workshops and training sessions',
        'Hackathons and coding competitions',
        'Industry talks and panel discussions',
        'Networking events and career fairs'
      ],
      image: '/images/events-preview.jpg'
    }
  };
  
  const currentStep = stepDetails[activeStep];

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Platform Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your journey on StartupNet is flexible and tailored to your goals. Here's how you can make the most of the platform.
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative">
          {/* Connection lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block"></div>
          
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 px-2 md:px-4 mb-4 md:mb-0 w-32">
              <button
                className={`flex flex-col items-center transition-all duration-300 ${
                  activeStep === step.id ? 'scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white mb-2 transition-all duration-300 ${
                  activeStep === step.id ? 'shadow-lg' : ''
                }`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <span className={`text-sm font-medium text-center ${activeStep === step.id ? 'text-gray-900' : 'text-gray-600'}`}>
                  {step.title}
                </span>
                <div className={`h-1 w-8 mt-2 rounded-full transition-all duration-300 ${
                  activeStep === step.id ? step.color : 'bg-transparent'
                }`}></div>
              </button>
            </div>
          ))}
        </div>

        {/* Step Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left: Content */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4">{currentStep.title}</h3>
              <p className="text-gray-600 mb-6">{currentStep.description}</p>
              
              <ul className="space-y-3 mb-8">
                {currentStep.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                      <Zap className="h-3 w-3 text-indigo-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium">
                  See Examples
                </button>
              </div>
            </div>
            
            {/* Right: Image/Illustration */}
            <div className="bg-indigo-50 flex items-center justify-center p-8">
              <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden">
                <div className="h-4 bg-gray-100 flex items-center px-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4">
                  {activeStep === 'profile' && (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full mr-4"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-100 rounded"></div>
                        <div className="h-3 w-full bg-gray-100 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-6 w-16 bg-indigo-100 rounded"></div>
                        <div className="h-6 w-20 bg-indigo-100 rounded"></div>
                        <div className="h-6 w-24 bg-indigo-100 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === 'projects' && (
                    <div className="space-y-4">
                      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 bg-gray-100 rounded"></div>
                        <div className="h-24 bg-gray-100 rounded"></div>
                        <div className="h-24 bg-gray-100 rounded"></div>
                        <div className="h-24 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-8 w-32 bg-indigo-100 rounded mx-auto"></div>
                    </div>
                  )}
                  
                  {activeStep === 'clubs' && (
                    <div className="space-y-4">
                      <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
                      <div className="space-y-3">
                        <div className="flex items-center p-2 bg-gray-100 rounded">
                          <div className="w-8 h-8 bg-purple-100 rounded-full mr-3"></div>
                          <div className="flex-1">
                            <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 w-32 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center p-2 bg-gray-100 rounded">
                          <div className="w-8 h-8 bg-blue-100 rounded-full mr-3"></div>
                          <div className="flex-1">
                            <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === 'startups' && (
                    <div className="space-y-4">
                      <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
                      <div className="flex items-center p-3 bg-gray-100 rounded mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded mr-3"></div>
                        <div className="flex-1">
                          <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-40 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 bg-gray-100 rounded p-2">
                          <div className="h-2 w-16 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-16 bg-gray-100 rounded p-2">
                          <div className="h-2 w-12 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === 'events' && (
                    <div className="space-y-4">
                      <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-100 rounded">
                          <div className="flex justify-between mb-2">
                            <div className="h-3 w-32 bg-gray-200 rounded"></div>
                            <div className="h-3 w-16 bg-indigo-100 rounded"></div>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="p-3 bg-gray-100 rounded">
                          <div className="flex justify-between mb-2">
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-16 bg-green-100 rounded"></div>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Flexible Journey Note */}
        <div className="mt-12 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-4 flex-shrink-0">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Your Journey, Your Way</h3>
              <p className="text-indigo-700">
                StartupNet offers a flexible path - you can create a profile and immediately start collaborating on projects, 
                join clubs if you're interested in community learning, or connect directly with startups for industry experience. 
                The choice is yours!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 