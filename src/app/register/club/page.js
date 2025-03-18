'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  Users, 
  MapPin, 
  Calendar,
  FileText,
  Link as LinkIcon,
  Image,
  Globe,
  ChevronLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/app/components/landing/Navbar';

export default function ClubRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Account details
    email: '',
    password: '',
    confirmPassword: '',
    
    // Club details
    clubName: '',
    clubType: 'university', // 'university' or 'independent'
    parentOrganization: '',
    foundingYear: '',
    memberCount: '',
    location: '',
    
    // Additional details
    clubDescription: '',
    fullName: '',
    logo: null,
    mainActivities: [],
    socialLinks: {
      website: '',
      instagram: '',
      linkedin: '',
    }
  });

  // Predefined options
  const activityOptions = [
    "Workshops", "Hackathons", "Networking Events", "Mentorship Programs", 
    "Startup Competitions", "Technical Training", "Industry Visits", 
    "Speaker Sessions", "Incubation Support", "Research Projects"
  ];
  
  const clubTypeOptions = [
    { id: 'university', label: 'University/College Club' },
    { id: 'independent', label: 'Independent Club' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (social links)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prevState => ({
        ...prevState,
        logo: e.target.files[0]
      }));
    }
  };

  const handleToggleActivity = (activity) => {
    setFormData(prevState => {
      const currentActivities = [...prevState.mainActivities];
      if (currentActivities.includes(activity)) {
        return {
          ...prevState,
          mainActivities: currentActivities.filter(a => a !== activity)
        };
      } else {
        return {
          ...prevState,
          mainActivities: [...currentActivities, activity]
        };
      }
    });
  };

  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      if (!formData.email) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Please enter a valid email";
      
      if (!formData.password) errors.password = "Password is required";
      else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
      
      if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    }
    
    if (stepNumber === 2) {
      if (!formData.clubName) errors.clubName = "Club name is required";
      if (formData.clubType === 'university' && !formData.parentOrganization) {
        errors.parentOrganization = "Parent organization is required for university clubs";
      }
      if (!formData.memberCount) errors.memberCount = "Member count is required";
      if (!formData.location) errors.location = "Location is required";
    }
    
    if (stepNumber === 3) {
      if (!formData.clubDescription) errors.clubDescription = "Club description is required";
      if (!formData.fullName) errors.fullName = "Contact person name is required";
      if (formData.mainActivities.length === 0) errors.mainActivities = "Please select at least one activity";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    // Only proceed with submission on the final step
    if (step !== 3) {
      handleNext();
      return;
    }
    
    setLoading(true);
    
    try {
      // Here you would typically call your API to register the club
      console.log('Submitting club registration:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle successful registration
      router.push('/registration-success?type=club');
    } catch (error) {
      console.error('Registration error:', error);
      setFormErrors({
        submit: 'There was an error processing your registration. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    const maxSteps = 3;
    const progress = (step / maxSteps) * 100;
    
    return (
      <div className="w-full mt-6 mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({length: maxSteps}, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                i + 1 < step ? 'bg-green-500 text-white' : 
                i + 1 === step ? 'bg-purple-600 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {i + 1 < step ? <Check size={20} /> : i + 1}
              </div>
              <span className="text-xs mt-1 font-medium">
                {i === 0 ? 'Account' : i === 1 ? 'Club' : 'Details'}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderAccountDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Create your club account</h2>
      <p className="text-gray-600">Join StartupsNet to connect with students, startups, and grow your community.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Club Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail size={18} className="text-gray-500" />
            </div>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="clubname@example.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.email}
            </p>
          )}
        </div>
        
        <div>
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
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.password}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long with numbers and letters</p>
        </div>
        
        <div>
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
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderClubDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Club Details</h2>
      <p className="text-gray-600">Tell us about your club to help connect you with the right members and resources.</p>
      
      <div className="space-y-4">
        <div>
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
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.clubName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="Entrepreneurs Club" 
              value={formData.clubName}
              onChange={handleChange}
            />
          </div>
          {formErrors.clubName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.clubName}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Club Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clubTypeOptions.map(option => (
              <div 
                key={option.id}
                onClick={() => handleChange({ target: { name: 'clubType', value: option.id } })}
                className={`cursor-pointer flex items-center p-3 rounded-lg border transition-all
                  ${formData.clubType === option.id 
                    ? 'border-purple-500 bg-purple-50 shadow-sm' 
                    : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center
                  ${formData.clubType === option.id 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-400'}`}
                >
                  {formData.clubType === option.id && <Check size={12} className="text-white" />}
                </div>
                <span className="ml-2 text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {formData.clubType === 'university' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="parentOrganization">
              University/College Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Building size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                id="parentOrganization" 
                name="parentOrganization" 
                className={`py-3 px-4 pl-10 block w-full border ${formErrors.parentOrganization ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                placeholder="Stanford University" 
                value={formData.parentOrganization}
                onChange={handleChange}
              />
            </div>
            {formErrors.parentOrganization && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {formErrors.parentOrganization}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
                className={`py-3 px-4 pl-10 block w-full border ${formErrors.memberCount ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                placeholder="50" 
                value={formData.memberCount}
                onChange={handleChange}
              />
            </div>
            {formErrors.memberCount && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {formErrors.memberCount}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="foundingYear">
              Founding Year (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <select
                id="foundingYear"
                name="foundingYear"
                className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={formData.foundingYear}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                {Array.from({length: 25}, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        
        <div>
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
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="San Francisco, CA" 
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          {formErrors.location && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdditionalDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
      <p className="text-gray-600">Tell us more about your club to create an engaging profile for potential members.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
            Contact Person Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="John Doe" 
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          {formErrors.fullName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.fullName}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Primary contact person for account management</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="clubDescription">
            Club Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText size={18} className="text-gray-500" />
            </div>
            <textarea 
              id="clubDescription" 
              name="clubDescription" 
              rows="4" 
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.clubDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
              placeholder="Describe your club's mission, activities, achievements and what makes it unique..." 
              value={formData.clubDescription}
              onChange={handleChange}
            ></textarea>
          </div>
          {formErrors.clubDescription && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.clubDescription}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Activities
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
            {activityOptions.map(activity => (
              <div 
                key={activity}
                onClick={() => handleToggleActivity(activity)}
                className={`cursor-pointer flex items-center p-3 rounded-lg border transition-all
                  ${formData.mainActivities.includes(activity) 
                    ? 'border-purple-500 bg-purple-50 shadow-sm' 
                    : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center
                  ${formData.mainActivities.includes(activity) 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'border-gray-400'}`}
                >
                  {formData.mainActivities.includes(activity) && <Check size={12} className="text-white" />}
                </div>
                <span className="ml-2 text-sm">{activity}</span>
              </div>
            ))}
          </div>
          {formErrors.mainActivities && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.mainActivities}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Logo (optional)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <Image size={40} className="mx-auto text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="logo" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                  <span>Upload a file</span>
                  <input 
                    id="logo" 
                    name="logo" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
          {formData.logo && (
            <p className="mt-2 text-sm text-purple-600 flex items-center">
              <Check size={14} className="mr-1" />
              Logo uploaded: {formData.logo.name}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Online Presence (optional)
          </label>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Globe size={18} className="text-gray-500" />
              </div>
              <input 
                type="url" 
                id="website" 
                name="socialLinks.website" 
                className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Website: https://example.com" 
                value={formData.socialLinks.website}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LinkIcon size={18} className="text-gray-500" />
              </div>
              <input 
                type="url" 
                id="instagram" 
                name="socialLinks.instagram" 
                className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Instagram: https://instagram.com/..." 
                value={formData.socialLinks.instagram}
                onChange={handleChange}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LinkIcon size={18} className="text-gray-500" />
              </div>
              <input 
                type="url" 
                id="linkedin" 
                name="socialLinks.linkedin" 
                className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="LinkedIn: https://linkedin.com/company/..." 
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {formErrors.submit}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch(step) {
      case 1: return renderAccountDetailsStep();
      case 2: return renderClubDetailsStep();
      case 3: return renderAdditionalDetailsStep();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/register" className="inline-flex items-center text-purple-600 hover:text-purple-800">
              <ChevronLeft size={16} /> Back to account types
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Club Registration
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Join our network and connect with students and startups
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {renderProgressBar()}
              
              <div>
                {renderStepContent()}
                
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
                    >
                      <ChevronLeft size={16} className="mr-1" /> Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Continue
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : 'Complete Registration'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              {step === 1 && (
                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                    Sign in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 