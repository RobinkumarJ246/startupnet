import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Rocket, Users, Briefcase, Award, Zap, Globe, Star, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles, PlusCircle } from 'lucide-react';

// Startup showcase data
const featuredStartups = [
  {
    name: "Upcheck India",
    logo: "/images/upcheck_logo.ico",
    description: "Smart aquaculture management platform to optimize shrimp farming",
    category: "Aquaculture tech",
    openRoles: 2,
    color: "from-blue-700 to-teal-600",
    highlight: "Spotlight",
    fallbackIcon: Rocket,
    isSpotlight: false,
    founderYear: 2025,
    members: 10,
  },
  /*
    {
    name: "CloudScale",
    logo: "/images/startup2.png",
    description: "Revolutionary cloud infrastructure solutions that scale with your business needs and optimize costs.",
    category: "Cloud Computing",
    openRoles: 5,
    color: "from-blue-700 to-orange-600",
    highlight: "Series A Funded",
    fallbackIcon: Globe
  }
    */
];

export default function FeaturedStartups() {
  const [activeStartup, setActiveStartup] = useState(null);
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
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Partner Companies
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Startups</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with innovative startups, explore open positions, and be part of their growth journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredStartups.map((startup, index) => {
            const FallbackIcon = startup.fallbackIcon || Star;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative ${startup.isSpotlight ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                onMouseEnter={() => setActiveStartup(index)}
                onMouseLeave={() => setActiveStartup(null)}
              >
                {startup.isSpotlight && (
                  <div className="absolute -top-4 -right-4 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-70 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        SPOTLIGHT
                      </div>
                    </div>
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${startup.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${logoError[index] ? `bg-gradient-to-r ${startup.color} flex items-center justify-center` : 'relative overflow-hidden'}`}>
                      {logoError[index] ? (
                        <FallbackIcon className="h-6 w-6 text-white" />
                      ) : (
                        <Image 
                          src={startup.logo} 
                          alt={`${startup.name} logo`}
                          width={48}
                          height={48}
                          className="object-contain"
                          onError={() => handleLogoError(index)}
                        />
                      )}
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                      {startup.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{startup.name}</h3>
                  <p className="text-gray-600 mb-6">{startup.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Award className="h-4 w-4 mr-1 text-indigo-500" />
                    <span>{startup.highlight}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-indigo-500 mr-1" />
                      <span className="text-sm font-medium text-indigo-600">
                        {startup.openRoles} open positions
                      </span>
                    </div>
                    <Link
                      href={`/startups/${startup.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center group"
                    >
                      View Startup
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
                
                {/* Hover overlay with additional info */}
                <div className={`absolute inset-0 bg-gradient-to-r ${startup.color} flex flex-col justify-end p-6 text-white transition-opacity duration-300 ${activeStartup === index ? 'opacity-95' : 'opacity-0 pointer-events-none'}`}>
                  <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
                  <p className="mb-4 text-indigo-100">{startup.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-sm font-medium">Team Size</div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{startup.members}+ members</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-sm font-medium">Founded</div>
                      <div>{startup.founderYear}</div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/startups/${startup.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 text-center font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}

          {/* "More Startups Coming Soon" Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden border border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <PlusCircle className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">More Startups Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              We're constantly adding innovative startups to our featured section. Check back soon!
            </p>
            <div className="mt-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg inline-flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="font-medium">Your startup could be here!</span>
            </div>
            <Link
              href="/register/startup"
              className="mt-6 inline-flex items-center px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 shadow-sm"
            >
              Register as Startup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link
            href="/startups"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 group"
          >
            Explore All Startups
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
        
        {/* Partner logos */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium text-gray-600">Trusted by innovative companies</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 rounded-md opacity-50"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Add spotlight animation styles */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px 5px rgba(79, 70, 229, 0.4); }
          50% { box-shadow: 0 0 25px 10px rgba(79, 70, 229, 0.6); }
        }
        
        .spotlight-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </section>
  );
} 