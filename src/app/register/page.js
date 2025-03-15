// pages/register.js
'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Check
} from 'lucide-react';

export default function Register() {

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