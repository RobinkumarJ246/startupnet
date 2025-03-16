import { useState } from 'react';
import { Code, Cpu, Bot as RobotIcon, Palette, Brain, Globe, ArrowRight, Users, Calendar, MessageSquare, Info } from 'lucide-react';

const clubs = [
  {
    name: "Coding Club",
    icon: "code",
    description: "Master programming languages, build projects, and participate in hackathons with peers.",
    color: "from-blue-500 to-indigo-500",
    bgPattern: "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 90%)"
  },
  {
    name: "AI/ML Club",
    icon: "brain",
    description: "Explore artificial intelligence, machine learning, and collaborate on data science projects.",
    color: "from-purple-500 to-pink-500",
    bgPattern: "radial-gradient(circle at 90% 10%, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 90%)"
  },
  {
    name: "Robotics Club",
    icon: "bot",
    description: "Build robots, drones, and automated systems with industry mentors and fellow enthusiasts.",
    color: "from-orange-500 to-red-500",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.1) 0%, rgba(239, 68, 68, 0.05) 90%)"
  },
  {
    name: "Design Club",
    icon: "palette",
    description: "Create stunning UI/UX designs and develop your creative skills through collaborative projects.",
    color: "from-green-500 to-teal-500",
    bgPattern: "radial-gradient(circle at 80% 30%, rgba(34, 197, 94, 0.1) 0%, rgba(20, 184, 166, 0.05) 90%)"
  },
  {
    name: "IoT Club",
    icon: "cpu",
    description: "Work on Internet of Things projects and smart device development with startup partnerships.",
    color: "from-cyan-500 to-blue-500",
    bgPattern: "radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 90%)"
  },
  {
    name: "Web3 Club",
    icon: "globe",
    description: "Explore blockchain, cryptocurrencies, and build decentralized applications with industry experts.",
    color: "from-yellow-500 to-orange-500",
    bgPattern: "radial-gradient(circle at 70% 50%, rgba(234, 179, 8, 0.1) 0%, rgba(249, 115, 22, 0.05) 90%)"
  }
];

const IconComponent = ({ type }) => {
  switch (type) {
    case 'code':
      return <Code />;
    case 'brain':
      return <Brain />;
    case 'bot':
      return <RobotIcon />;
    case 'palette':
      return <Palette />;
    case 'cpu':
      return <Cpu />;
    case 'globe':
      return <Globe />;
    default:
      return <Code />;
  }
};

export default function Clubs() {
  const [activeClub, setActiveClub] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Collaborative Tech Communities
          </h2>
          <p className="text-lg text-gray-600">
            Join independent communities to collaborate on projects, 
            attend events, and connect with startups and industry mentors.
          </p>
        </div>

        {/* University Club Notice */}
        <div className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm border border-indigo-100">
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-full mr-4">
              <Info className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">University-Affiliated Clubs</h3>
              <p className="text-indigo-700">
                Students can join university-affiliated clubs after verifying their educational credentials from the respective institution. 
                This verification process ensures a trusted community environment.
              </p>
              <p className="text-indigo-500 mt-2">
                * The displayed clubs are open-to-join clubs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="relative group transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setActiveClub(index)}
              onMouseLeave={() => setActiveClub(null)}
              style={{ background: club.bgPattern }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${club.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${club.color} flex items-center justify-center mr-4`}>
                    <IconComponent type={club.icon} className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{club.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-6 flex-grow">{club.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg text-indigo-600 hover:text-indigo-700 font-medium group/btn transition-all duration-300 hover:shadow-sm">
                    Join Club
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-600">+</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-x-16 translate-y-16 blur-3xl"></div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white relative z-10">What You Can Do With Clubs</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Host & Attend Events</h4>
                <p className="text-indigo-100 text-sm">Exclusive workshops, hackathons, and networking opportunities</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Team Collaboration</h4>
                <p className="text-indigo-100 text-sm">Connect with peers and industry mentors on shared interests</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Discussion Spaces</h4>
                <p className="text-indigo-100 text-sm">Dedicated forums for knowledge sharing and problem-solving</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20">
                <div className="bg-white/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Project Building</h4>
                <p className="text-indigo-100 text-sm">Collaborate on innovative projects with club resources</p>
              </div>
            </div>
            
            <div className="mt-8 text-center relative z-10">
              <a
                href="/clubs"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all duration-300 group font-semibold"
              >
                Explore All Clubs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 