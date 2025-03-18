// pages/register.js
'use client'
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  Briefcase, 
  UserPlus, 
  Calendar,
  GraduationCap, 
  BookOpen, 
  Globe, 
  MapPin, 
  Users, 
  ChevronDown,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles,
  Rocket,
  Code,
  Zap,
  Star
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';

function Registerform() {

const searchParams = useSearchParams();
const type = searchParams.get('type');
;
  const [registrationType, setRegistrationType] = useState('student');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    
    // Student fields
    fullName: '',
    university: '',
    college: '',
    yearOfStudy: '',
    graduationYear: '',
    course: '',
    major: '',
    
    // Startup fields
    companyName: '',
    companySize: '',
    industry: '',
    location: '',
    website: '',
    
    // Club fields
    clubName: '',
    clubType: 'university', // university or independent
    parentOrganization: '',
    memberCount: '',
    clubDescription: '',
    
    // Last step
    interestedTopics: [],
    referralSource: '',
  });

  // List of topics for recommendations
  const topics = [
    "Artificial Intelligence", "Blockchain", "Cloud Computing", 
    "Data Science", "Entrepreneurship", "Game Development", 
    "Mobile App Development", "Robotics", "Web Development",
    "Cybersecurity", "UX/UI Design", "Machine Learning",
    "IoT", "AR/VR", "Renewable Energy"
  ];

  // Update registration type based on URL param
  useEffect(() => {
    if (type && ['student', 'startup', 'club'].includes(type)) {
      setRegistrationType(type);
    }
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTopicToggle = (topic) => {
    setFormData(prevState => {
      const currentTopics = [...prevState.interestedTopics];
      if (currentTopics.includes(topic)) {
        return {
          ...prevState,
          interestedTopics: currentTopics.filter(t => t !== topic)
        };
      } else {
        return {
          ...prevState,
          interestedTopics: [...currentTopics, topic]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < getMaxSteps()) {
      setStep(step + 1);
      return;
    }
    
    // Here you would typically send the data to your backend API
    console.log('Form submitted with data:', formData);
    
    // For now, we'll just show a success message and redirect
    alert('Registration successful! Redirecting to login...');
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  const getMaxSteps = () => {
    if (registrationType === 'student') return 3;
    if (registrationType === 'startup') return 3;
    if (registrationType === 'club') return 3;
    return 3;
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderProgressBar = () => {
    const maxSteps = getMaxSteps();
    const progress = (step / maxSteps) * 100;
    
    return (
      <div className="w-full mt-4 mb-8">
        <div className="flex justify-between mb-1">
          {Array.from({length: maxSteps}, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i + 1 <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {i + 1 <= step ? <Check size={16} /> : i + 1}
              </div>
              <span className="text-xs mt-1">{i === 0 ? 'Account' : i === 1 ? 'Details' : 'Finish'}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  };

  const renderTypeSelector = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">I am registering as:</label>
      <div className="flex space-x-4">
        <Link href="/register?type=student" className={`flex items-center justify-center px-4 py-2 rounded-md ${registrationType === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
        <User size={18} className="mr-2" />
            Student
        </Link>
        <Link href="/register?type=startup" className={`flex items-center justify-center px-4 py-2 rounded-md ${registrationType === 'startup' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
        <Briefcase size={18} className="mr-2" />

            Startup
        </Link>
        <Link href="/register?type=club" className={`flex items-center justify-center px-4 py-2 rounded-md ${registrationType === 'club' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Users size={18} className="mr-2" />
            Club
        </Link>
      </div>
    </div>
  );

  const renderAuthFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail size={18} className="text-gray-500" />
          </div>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="your.email@example.com" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className="text-gray-500" />
          </div>
          <input 
            type="password" 
            id="password" 
            name="password" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="••••••••" 
            required 
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long with numbers and letters</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className="text-gray-500" />
          </div>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="••••••••" 
            required 
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );

  const renderStudentFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            id="fullName" 
            name="fullName" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="John Doe" 
            required 
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="university">
          University
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Building size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            id="university" 
            name="university" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="MIT" 
            required 
            value={formData.university}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="college">
          College
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Building size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            id="college" 
            name="college" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="School of Engineering" 
            value={formData.college}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="yearOfStudy">
            Year of Study
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar size={18} className="text-gray-500" />
            </div>
            <select
              id="yearOfStudy"
              name="yearOfStudy"
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              value={formData.yearOfStudy}
              onChange={handleChange}
            >
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5+">5+ Year</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="graduationYear">
            Graduation Year
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GraduationCap size={18} className="text-gray-500" />
            </div>
            <select
              id="graduationYear"
              name="graduationYear"
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              value={formData.graduationYear}
              onChange={handleChange}
            >
              <option value="">Select year</option>
              {Array.from({length: 8}, (_, i) => (
                <option key={i} value={2025 + i}>{2025 + i}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="course">
            Course
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BookOpen size={18} className="text-gray-500" />
            </div>
            <select
              id="course"
              name="course"
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Select course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BE">BE</option>
              <option value="B.Sc">B.Sc</option>
              <option value="BCA">BCA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MCA">MCA</option>
              <option value="M.Sc">M.Sc</option>
              <option value="MBA">MBA</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="major">
            Major
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BookOpen size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              id="major" 
              name="major" 
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Computer Science" 
              required 
              value={formData.major}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderStartupFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companyName">
          Company Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Building size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            id="companyName" 
            name="companyName" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Acme Inc." 
            required 
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="industry">
          Industry
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Briefcase size={18} className="text-gray-500" />
          </div>
          <select
            id="industry"
            name="industry"
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            value={formData.industry}
            onChange={handleChange}
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Energy">Energy</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companySize">
            Company Size
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Users size={18} className="text-gray-500" />
            </div>
            <select
              id="companySize"
              name="companySize"
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              value={formData.companySize}
              onChange={handleChange}
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
            Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              id="location" 
              name="location" 
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="San Francisco, CA" 
              required 
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
          Website
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Globe size={18} className="text-gray-500" />
          </div>
          <input 
            type="url" 
            id="website" 
            name="website" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="https://example.com" 
            value={formData.website}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );

  const renderClubFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="clubName">
          Club Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Users size={18} className="text-gray-500" />
          </div>
          <input 
            type="text" 
            id="clubName" 
            name="clubName" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Robotics Club" 
            required 
            value={formData.clubName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Club Type
        </label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input 
              type="radio" 
              id="universityClub" 
              name="clubType" 
              value="university" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
              checked={formData.clubType === 'university'}
              onChange={handleChange}
            />
            <label htmlFor="universityClub" className="ml-2 text-sm text-gray-700">
              University/College Club
            </label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="independentClub" 
              name="clubType" 
              value="independent" 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
              checked={formData.clubType === 'independent'}
              onChange={handleChange}
            />
            <label htmlFor="independentClub" className="ml-2 text-sm text-gray-700">
              Independent Club
            </label>
          </div>
        </div>
      </div>
      
      {formData.clubType === 'university' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="parentOrganization">
            Parent University/College
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Building size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              id="parentOrganization" 
              name="parentOrganization" 
              className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="MIT" 
              value={formData.parentOrganization}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="memberCount">
          Approximate Member Count
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Users size={18} className="text-gray-500" />
          </div>
          <input 
            type="number" 
            id="memberCount" 
            name="memberCount" 
            className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="50" 
            value={formData.memberCount}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="clubDescription">
          Brief Club Description
        </label>
        <textarea 
          id="clubDescription" 
          name="clubDescription" 
          rows="3" 
          className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          placeholder="Tell us about your club's mission and activities" 
          value={formData.clubDescription}
          onChange={handleChange}
        ></textarea>
      </div>
    </>
  );

  const renderInterestsAndFinish = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select topics you're interested in (optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {topics.map(topic => (
            <div 
              key={topic}
              onClick={() => handleTopicToggle(topic)}
              className={`cursor-pointer flex items-center p-2 rounded border ${formData.interestedTopics.includes(topic) ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <div className={`w-4 h-4 mr-2 flex-shrink-0 rounded border ${formData.interestedTopics.includes(topic) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                {formData.interestedTopics.includes(topic) && <Check size={16} className="text-white" />}
              </div>
              <span className="text-sm">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="referralSource">
          How did you hear about us?
        </label>
        <select
          id="referralSource"
          name="referralSource"
          className="py-3 px-4 block w-full border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.referralSource}
          onChange={handleChange}
        >
          <option value="">Select an option</option>
          <option value="friend">Friend or colleague</option>
          <option value="search">Search engine</option>
          <option value="social">Social media</option>
          <option value="event">Event or conference</option>
          <option value="university">University</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Almost there!</h3>
        <p className="text-blue-700">
          Thank you for registering. Click the button below to complete your registration and start exploring!
        </p>
      </div>
    </>
  );

  const renderStepContent = () => {
    if (step === 1) {
      return renderAuthFields();
    }
    
    if (step === 2) {
      if (registrationType === 'student') return renderStudentFields();
      if (registrationType === 'startup') return renderStartupFields();
      if (registrationType === 'club') return renderClubFields();
    }
    
    if (step === 3) {
      return renderInterestsAndFinish();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
            {step === 3 ? 'Final Steps' : 
                step === 2 ? 'Your Details' : 
                'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 3 ? 'Complete your profile' : 
                step === 2 ? 'Tell us about yourself' : 
                'Join our community today'}
            </p>
          </div>
          
          {renderTypeSelector()}
          {renderProgressBar()}
          
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {step === getMaxSteps() ? 'Complete Registration' : 'Continue'}
              </button>
            </div>
          </form>
          
          {step === 1 && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Account type component with animation effects
const AccountTypeCard = ({ type, title, icon: Icon, description, features, gradient, isSelected, onClick }) => {
  return (
    <div 
      onClick={() => onClick(type)}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group
        ${isSelected ? 'ring-4 ring-indigo-500 scale-[1.02]' : 'shadow-lg hover:shadow-xl'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
      
      {/* Decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl transform -rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative p-8">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
          <Icon size={32} className="text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 mb-6 text-sm md:text-base">
          {description}
        </p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center text-white/90 text-sm">
              <Check className="mr-2 h-4 w-4 text-white/70" />
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="flex items-center text-white mt-auto">
          <span className="text-sm font-medium">Select to continue</span>
          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-4 right-4 bg-white rounded-full p-1">
          <Check className="h-5 w-5 text-indigo-600" />
        </div>
      )}
    </div>
  );
};

// Testimonial component
const Testimonial = ({ quote, author, role, avatar }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {avatar || author.charAt(0)}
        </div>
      </div>
      <div>
        <p className="text-white/90 italic">"{quote}"</p>
        <div className="mt-2">
          <p className="text-white font-medium">{author}</p>
          <p className="text-white/70 text-sm">{role}</p>
        </div>
      </div>
    </div>
  </div>
);

// Create a client component that safely uses useSearchParams
function RegisterWithSearchParams() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(type || null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/register/${selectedType}`);
    }
  };

  const accountTypes = [
    {
      type: 'student',
      title: 'Student',
      icon: GraduationCap,
      description: 'For university students looking to connect with startups and tech clubs',
      features: ['Access to internship opportunities', 'Connect with startups', 'Join tech clubs'],
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      type: 'startup',
      title: 'Startup',
      icon: Rocket,
      description: 'For startups looking to connect with student talent and other startups',
      features: ['Post job listings', 'Connect with student talent', 'Join startup community'],
      gradient: 'from-emerald-400 to-emerald-600'
    },
    {
      type: 'club',
      title: 'Tech Club',
      icon: Users,
      description: 'For university tech clubs, coding groups, and student organizations',
      features: ['Promote your events', 'Connect with other clubs', 'Recruit members'],
      gradient: 'from-purple-400 to-purple-600'
    }
  ];

  const testimonials = [
    {
      quote: "Joining as a student opened so many doors for internships and mentoring opportunities!",
      author: "Priya Sharma",
      role: "Computer Science Student"
    },
    {
      quote: "We found our technical co-founder through StartupsNet. Game-changer for our startup!",
      author: "Rahul Mehta",
      role: "Founder, TechSolve"
    },
    {
      quote: "Our robotics club membership grew by 70% after joining this platform.",
      author: "Ananya Patel",
      role: "President, SVCE Robotics Club"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute right-[15%] bottom-[10%] w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute left-[40%] top-[60%] w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            Join Our Community
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center tracking-tight mb-6">
            <span className="block">Welcome to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600">
              StartupsNet
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-8">
            Select your account type below to get started with your registration
          </p>
          
          {/* 3D-like floating items decoration */}
          <div className="hidden lg:block absolute top-20 right-10 animate-float-slow">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-lg transform rotate-12"></div>
          </div>
          <div className="hidden lg:block absolute bottom-10 left-10 animate-float-slow-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full shadow-lg"></div>
          </div>
          <div className="hidden lg:block absolute top-40 left-24 animate-float-medium">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg shadow-lg transform -rotate-12"></div>
          </div>
        </div>
      </section>
      
      {/* Account Type Selection */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Account type cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {accountTypes.map(type => (
              <AccountTypeCard 
                key={type.type}
                {...type}
                isSelected={selectedType === type.type}
                onClick={handleTypeSelect}
              />
            ))}
          </div>
          
          {/* Continue Button */}
          <div className="flex justify-center mb-16">
            <button
              onClick={handleContinue}
              disabled={!selectedType}
              className={`flex items-center px-8 py-4 text-lg font-medium rounded-full shadow-lg transition-all duration-300
                ${selectedType 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transform hover:scale-105' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Continue to Registration
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="absolute inset-0 overflow-hidden">
          {/* Angled divider without the white element that was hiding content */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-transparent">
            <svg className="absolute top-0 w-full h-16 text-indigo-50" preserveAspectRatio="none" viewBox="0 0 1440 80">
              <path fill="currentColor" d="M0,0 L1440,0 L1440,80 L0,0 Z"></path>
            </svg>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Join StartupsNet?</h2>
            <p className="text-xl text-indigo-100">Discover the perfect ecosystem for innovation and collaboration</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transform transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect</h3>
              <p className="text-indigo-100">Build meaningful connections with students, startups, and clubs that share your interests and vision.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transform transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Collaborate</h3>
              <p className="text-indigo-100">Work together on projects, share ideas, and create innovative solutions with like-minded individuals.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transform transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Grow</h3>
              <p className="text-indigo-100">Accelerate your personal, academic, or business growth through new opportunities and experiences.</p>
            </div>
          </div>
          
          {/* Testimonials 
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
          */}
          
          {/*}
          <div className="text-center">
            <p className="text-indigo-100 mb-6">
              Join thousands of students, startups, and clubs already on the platform
            </p>
            <div className="inline-flex items-center justify-center">
              <div className="flex -space-x-2 mr-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-indigo-800 bg-gradient-to-br from-${['blue', 'indigo', 'purple', 'pink', 'indigo'][i]}-400 to-${['blue', 'indigo', 'purple', 'pink', 'indigo'][i]}-600`}></div>
                ))}
                <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-medium">1k+</div>
              </div>
              <span className="text-indigo-200 text-sm">Active members and growing</span>
            </div>
          </div>
          */}
        </div>
      </section>
      {/* Sign In Link */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </section>
      {/* Add animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-10px) rotate(-12deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slow-reverse {
          animation: float-slow-reverse 7s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Main page component with Suspense boundary
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-indigo-200 rounded-full mb-4"></div>
          <div className="h-6 w-64 bg-indigo-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-indigo-100 rounded"></div>
        </div>
      </div>
    }>
      <RegisterWithSearchParams />
    </Suspense>
  );
}