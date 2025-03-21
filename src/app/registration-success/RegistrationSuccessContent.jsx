'use client'
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  ArrowRight, 
  User, 
  Briefcase, 
  Users,
  CheckCheck,
  Mail,
  Clock,
  Sparkles,
  Gift,
  Bell
} from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';

// Inner component that uses searchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState('');
  const [countdown, setCountdown] = useState(15);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
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
      // Only redirect if logged in
      if (isLoggedIn) {
        router.push('/dashboard');
      } else {
        // If not logged in, redirect to login page with a return URL
        router.push('/login?returnUrl=/dashboard');
      }
    }
  }, [countdown, isLoggedIn, router]);

  const getTypeSpecificContent = () => {
    switch(accountType) {
      case 'student':
        return {
          title: "Welcome to StartupsNet",
          description: "Your student account has been created successfully. You're now part of our community of aspiring entrepreneurs and innovators.",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-blue-200",
          gradientFrom: "from-blue-50",
          gradientTo: "to-white",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          icon: <User size={32} />,
          confettiColor: "text-blue-500",
          nextSteps: [
            "Complete your profile with your skills and interests",
            "Join clubs and organizations",
            "Explore startup opportunities and internships",
            "Join events and hackathons in your area"
          ],
          benefits: [
            "Access to exclusive internship opportunities",
            "Connect with like-minded entrepreneurs",
            "Early access to campus events"
          ],
          ctaText: "Explore Student Opportunities"
        };
        
      case 'startup':
        return {
          title: "Welcome to StartupsNet",
          description: "Your startup account has been created successfully. You now have access to our network of talent, resources, and potential partners.",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          borderColor: "border-emerald-200",
          gradientFrom: "from-emerald-50",
          gradientTo: "to-white",
          buttonBg: "bg-emerald-600 hover:bg-emerald-700",
          icon: <Briefcase size={32} />,
          confettiColor: "text-emerald-500",
          nextSteps: [
            "Complete your company profile with detailed information",
            "Post job and internship opportunities",
            "Connect with talented students and other startups",
            "Discover resources to help your startup grow"
          ],
          benefits: [
            "Access to top student talent",
            "Connect with investors and mentors",
            "Dedicated workspace for your startup",
            "Access to exclusive resources for startup growth"
          ],
          ctaText: "Start Building Your Team"
        };
        
      case 'club':
        return {
          title: "Welcome to StartupsNet",
          description: "Your club account has been created successfully. You're now part of our network of entrepreneurial and tech communities.",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          borderColor: "border-purple-200",
          gradientFrom: "from-purple-50",
          gradientTo: "to-white",
          buttonBg: "bg-purple-600 hover:bg-purple-700",
          icon: <Users size={32} />,
          confettiColor: "text-purple-500",
          nextSteps: [
            "Complete your club profile with your motto and goals",
            "Add people to your club",
            "Set up your club's official page",
            "Access resources for club management and growth"
          ],
          benefits: [
            "Free event promotion to relevant audiences",
            "Connect with industry sponsors",
            "Easy ticket distribution and verification with event management tools",
            "Access to exclusive resources for club growth"
          ],
          ctaText: "Grow Your Community"
        };
        
      default:
        return {
          title: "Registration Successful!",
          description: "Your account has been created successfully. Welcome to StartupsNet.",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          borderColor: "border-green-200",
          gradientFrom: "from-green-50",
          gradientTo: "to-white",
          buttonBg: "bg-green-600 hover:bg-green-700",
          icon: <CheckCircle size={32} />,
          confettiColor: "text-green-500",
          nextSteps: [
            "Complete your profile with more details",
            "Explore the platform and discover opportunities",
            "Connect with others in the community",
            "Check out upcoming events"
          ],
          benefits: [
            "Access to exclusive content",
            "Connect with our community",
            "Regular updates on opportunities"
          ],
          ctaText: "Go to Dashboard"
        };
    }
  };
  
  const content = getTypeSpecificContent();

  // Animation classes for elements
  const fadeInClasses = "transition-all duration-700 ease-in-out";
  const scaleInClasses = "transition-all duration-500 ease-in-out transform hover:scale-105";

  return (
    <div className={`max-w-3xl w-full bg-gradient-to-b ${content.gradientFrom} ${content.gradientTo} rounded-2xl shadow-xl overflow-hidden border ${content.borderColor} transition-all duration-500`}>
      {/* Confetti animation at the top */}
      <div className="relative h-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-16 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <Sparkles 
              key={i} 
              size={16} 
              className={`${content.confettiColor} absolute animate-fall`} 
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `-${Math.random() * 10}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }} 
            />
          ))}
        </div>
      </div>

      <div className="p-8 md:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className={`w-24 h-24 rounded-full ${content.iconBg} ${content.iconColor} flex items-center justify-center mb-6 shadow-lg ${scaleInClasses}`}>
            {content.icon}
          </div>
          
          <div className={fadeInClasses}>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">
              {content.title}
            </h1>
            <div className="flex items-center justify-center mb-4 bg-green-50 rounded-full py-2 px-4 shadow-sm">
              <CheckCheck className="text-green-500 mr-2" />
              <span className="text-green-600 font-medium">Account created successfully</span>
            </div>
            <p className="text-lg text-gray-600 max-w-lg">
              {content.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="mr-2 text-indigo-500" size={20} />
              Next steps:
            </h2>
            <ul className="space-y-3">
              {content.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Gift className="mr-2 text-pink-500" size={20} />
              Your benefits:
            </h2>
            <ul className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle size={14} />
                  </span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <p className="flex items-center text-gray-500 mb-4 sm:mb-0">
            <Mail className="mr-2" size={18} />
            Check your email for confirmation
          </p>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <Clock className="text-gray-400" size={18} />
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">{countdown}</span>
              </div>
            </div>
            
            <Link 
              href="/dashboard" 
              className={`inline-flex items-center px-6 py-3 text-white font-medium rounded-lg shadow-md ${content.buttonBg} transition-all duration-300 transform hover:translate-y-[-2px]`}
            >
              {content.ctaText}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps SuccessContent
export default function RegistrationSuccessContent() {
  return <SuccessContent />;
} 