'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  ArrowRight, 
  User, 
  Briefcase, 
  Users,
  CheckCheck,
  Mail,
  Clock
} from 'lucide-react';

export default function RegistrationSuccess() {
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState('');
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['student', 'startup', 'club'].includes(type)) {
      setAccountType(type);
    }
    
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [searchParams]);
  
  // Redirect to dashboard after countdown
  useEffect(() => {
    if (countdown === 0) {
      window.location.href = '/dashboard';
    }
  }, [countdown]);

  const getTypeSpecificContent = () => {
    switch(accountType) {
      case 'student':
        return {
          title: "Welcome to StartupsNet, Student!",
          description: "Your student account has been created successfully. You're now part of our community of aspiring entrepreneurs and innovators.",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          icon: <User size={32} />,
          nextSteps: [
            "Complete your profile with your skills and interests",
            "Explore startup opportunities and internships",
            "Connect with other students and startup founders",
            "Join events and hackathons in your area"
          ],
          ctaText: "Explore Student Opportunities"
        };
        
      case 'startup':
        return {
          title: "Welcome to StartupsNet, Startup!",
          description: "Your startup account has been created successfully. You now have access to our network of talent, resources, and potential partners.",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          icon: <Briefcase size={32} />,
          nextSteps: [
            "Complete your company profile with detailed information",
            "Post job and internship opportunities",
            "Connect with talented students and other startups",
            "Discover resources to help your startup grow"
          ],
          ctaText: "Start Building Your Team"
        };
        
      case 'club':
        return {
          title: "Welcome to StartupsNet, Club!",
          description: "Your club account has been created successfully. You're now part of our network of entrepreneurial and tech communities.",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          icon: <Users size={32} />,
          nextSteps: [
            "Complete your club profile with activities and events",
            "Connect with startups and other clubs in your area",
            "Promote your upcoming events to a wider audience",
            "Access resources for club management and growth"
          ],
          ctaText: "Grow Your Community"
        };
        
      default:
        return {
          title: "Registration Successful!",
          description: "Your account has been created successfully. Welcome to StartupsNet.",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          icon: <CheckCircle size={32} />,
          nextSteps: [
            "Complete your profile with more details",
            "Explore the platform and discover opportunities",
            "Connect with others in the community",
            "Check out upcoming events"
          ],
          ctaText: "Go to Dashboard"
        };
    }
  };
  
  const content = getTypeSpecificContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-20 h-20 rounded-full ${content.iconBg} ${content.iconColor} flex items-center justify-center mb-6`}>
              {content.icon}
            </div>
            
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                {content.title}
              </h1>
              <div className="flex items-center justify-center mb-4">
                <CheckCheck className="text-green-500 mr-2" />
                <span className="text-green-600 font-medium">Account created successfully</span>
              </div>
              <p className="text-lg text-gray-600 max-w-lg">
                {content.description}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Next steps:</h2>
            <ul className="space-y-3">
              {content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="flex items-center text-gray-500 mb-4 sm:mb-0">
              <Mail className="mr-2" size={18} />
              Check your email for confirmation
            </p>
            
            <div className="flex items-center">
              <p className="flex items-center text-gray-500 mr-4">
                <Clock className="mr-2" size={18} />
                Redirecting in {countdown}s
              </p>
              
              <Link href="/dashboard" className={`inline-flex items-center px-6 py-3 text-white font-medium rounded-lg shadow-md 
                ${accountType === 'student' ? 'bg-blue-600 hover:bg-blue-700' :
                  accountType === 'startup' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  accountType === 'club' ? 'bg-purple-600 hover:bg-purple-700' :
                  'bg-gray-600 hover:bg-gray-700'}`}
              >
                {content.ctaText}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 