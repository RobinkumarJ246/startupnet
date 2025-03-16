import { useState } from 'react';
import Image from 'next/image';
import { Code, Cpu, Bot as RobotIcon, Palette, Brain, Globe, ArrowRight, Users, Calendar, MessageSquare, Info, Lock, LogIn } from 'lucide-react';

const clubs = [
  {
    name: "Coding Club",
    icon: "code",
    logo: "/images/clubs/coding-club.png",
    description: "Master programming languages, build projects, and participate in hackathons with peers.",
    color: "from-blue-400 to-indigo-600",
    bgPattern: "radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 90%)",
    isUniversityAffiliated: false
  },
  {
    name: "Coders' Forum",
    icon: "brain",
    logo: "/images/clubs/coders_forum.png",
    description: "Peer mentoring and collaborative coding club organized by Sri Venkateswara College of Engineering",
    color: "from-red-200 via-cyan-600 to-blue-800",
    bgPattern: "radial-gradient(circle at 90% 10%, rgba(28, 195, 227, 0.1) 0%, rgba(236, 72, 153, 0.05) 90%)",
    isUniversityAffiliated: true,
    affiliatedTo: "SVCE",
    universityLogo: "/images/universities/svce.png"
  },
  {
    name: "GDSC SVCE",
    icon: "cpu",
    logo: "/images/clubs/gdsc.png",
    description: "Google Developer Students Club of Sri Venkateswara College of Engineering",
    color: "from-blue-500 via-yellow-500 to-green-500",
    bgPattern: "radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 90%)",
    isUniversityAffiliated: true,
    affiliatedTo: "SVCE",
    universityLogo: "/images/universities/svce.png"
  },
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
  const [showLoginHint, setShowLoginHint] = useState(false);
  const [logoError, setLogoError] = useState({});

  const handleLogoError = (index) => {
    setLogoError(prev => ({
      ...prev,
      [index]: true
    }));
  };

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
                This verification process ensures a trusted community environment ensuring our security, trust and verification.
              </p>
              <p className="text-indigo-500 mt-2">
                * Open clubs can be joined by anyone, while university-affiliated clubs require verification.
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
                {/* Club Type Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${club.isUniversityAffiliated ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                  {club.isUniversityAffiliated ? 'University Affiliated' : 'Open to Join'}
                </div>
                
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg ${logoError[index] ? `bg-gradient-to-r ${club.color} flex items-center justify-center` : 'relative overflow-hidden'} mr-4`}>
                    {logoError[index] ? (
                      <IconComponent type={club.icon} className="h-6 w-6 text-white" />
                    ) : (
                      <Image 
                        src={club.logo} 
                        alt={`${club.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                        onError={() => handleLogoError(index)}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{club.name}</h3>
                    {club.isUniversityAffiliated && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>Affiliated to:</span>
                        <div className="flex items-center ml-1">
                          <div className="w-4 h-4 relative mr-1">
                            <Image 
                              src={club.universityLogo} 
                              alt={club.affiliatedTo}
                              width={16}
                              height={16}
                              className="object-contain"
                              onError={(e) => {e.target.style.display = 'none'}}
                            />
                          </div>
                          <span className="font-medium text-indigo-600">{club.affiliatedTo}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 flex-grow">{club.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  {club.isUniversityAffiliated ? (
                    <div className="relative">
                      <button 
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg text-gray-500 font-medium cursor-not-allowed"
                        onMouseEnter={() => setShowLoginHint(index)}
                        onMouseLeave={() => setShowLoginHint(null)}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Requires Verification
                      </button>
                      {showLoginHint === index && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                          <div className="flex items-start">
                            <LogIn className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            <p>Login required. Students must verify their educational credentials to join university-affiliated clubs.</p>
                          </div>
                          <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg text-indigo-600 hover:text-indigo-700 font-medium group/btn transition-all duration-300 hover:shadow-sm">
                      Join Club
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  )}
                  {/*}
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-medium text-indigo-600">+</div>
                  </div> {*/}
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