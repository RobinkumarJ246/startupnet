'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Building, 
  Calendar,
  GraduationCap, 
  BookOpen,
  ChevronLeft,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// Import the AcademicForm component
import AcademicForm from '@/app/components/student-registration/AcademicForm';
import Navbar from '@/app/components/landing/Navbar';

export default function StudentRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Account details
    email: '',
    password: '',
    confirmPassword: '',
    
    // Academic details
    fullName: '',
    country: '',
    state: '',
    district: '',
    university: '',
    isUniversityCollege: false,
    college: '',
    graduationYear: '',
    course: '',
    major: '',
    
    // Optional details
    skills: [],
    bio: '',
    linkedinUrl: '',
    githubUrl: '',
    interests: []
  });

  // Predefined options
  const skillOptions = [
    "JavaScript", "Python", "Java", "React", "Node.js", 
    "UI/UX Design", "Product Management", "Data Science", 
    "Machine Learning", "Cloud Computing", "Mobile Development"
  ];
  
  const interestOptions = [
    "Artificial Intelligence", "Blockchain", "Cloud Computing", 
    "Data Science", "Entrepreneurship", "Game Development", 
    "Mobile App Development", "Robotics", "Web Development",
    "Cybersecurity", "UX/UI Design"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked
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

  const handleToggleSelection = (field, item) => {
    setFormData(prevState => {
      const currentItems = [...prevState[field]];
      if (currentItems.includes(item)) {
        return {
          ...prevState,
          [field]: currentItems.filter(i => i !== item)
        };
      } else {
        return {
          ...prevState,
          [field]: [...currentItems, item]
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
      if (!formData.fullName) errors.fullName = "Full name is required";
      if (!formData.country) errors.country = "Country is required";
      if (formData.country === 'India' && !formData.state) errors.state = "State is required";
      if (!formData.university) errors.university = "University is required";
      if (!formData.isUniversityCollege && !formData.college) errors.college = "College is required";
      if (!formData.graduationYear) errors.graduationYear = "Graduation year is required";
      if (!formData.course) errors.course = "Course is required";
      if (!formData.major) errors.major = "Major is required";
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
      // Here you would typically call your API to register the user
      console.log('Submitting student registration:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Handle successful registration
      router.push('/registration-success?type=student');
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
                i + 1 === step ? 'bg-blue-600 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {i + 1 < step ? <Check size={20} /> : i + 1}
              </div>
              <span className="text-xs mt-1 font-medium">
                {i === 0 ? 'Account' : i === 1 ? 'Academic' : 'Skills'}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderAccountDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
      <p className="text-gray-600">Start your journey with StartupsNet by setting up your account credentials.</p>
      
      <div className="space-y-4">
        <div>
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
              className={`py-3 px-4 pl-10 block w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="your.email@university.edu" 
              value={formData.email}
              onChange={handleChange}
              inputMode="email"
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {formErrors.email}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">We recommend using your university email if possible</p>
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
              type={showPassword ? "text" : "password"}
              id="password" 
              name="password" 
              className={`py-3 px-4 pl-10 pr-10 block w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword" 
              name="confirmPassword" 
              className={`py-3 px-4 pl-10 pr-10 block w-full border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="••••••••" 
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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

  // Use the new AcademicForm component
  const renderAcademicDetailsStep = () => (
    <AcademicForm
      formData={formData}
      onChange={handleChange}
      errors={formErrors}
      setFormErrors={setFormErrors}
    />
  );

  const renderSkillsAndInterestsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Skills & Interests</h2>
      <p className="text-gray-600">Help us personalize your experience by telling us about your skills and interests.</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your skills (optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skillOptions.map(skill => (
              <div 
                key={skill}
                onClick={() => handleToggleSelection('skills', skill)}
                className={`cursor-pointer flex items-center p-3 rounded-lg border transition-all
                  ${formData.skills.includes(skill) 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center
                  ${formData.skills.includes(skill) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-400'}`}
                >
                  {formData.skills.includes(skill) && <Check size={12} className="text-white" />}
                </div>
                <span className="ml-2 text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bio">
            Bio (optional)
          </label>
          <textarea 
            id="bio" 
            name="bio" 
            rows="3" 
            className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Tell us a bit about yourself, your academic journey, and what you hope to achieve" 
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">Maximum 200 characters</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="linkedinUrl">
              LinkedIn Profile (optional)
            </label>
            <input 
              type="url" 
              id="linkedinUrl" 
              name="linkedinUrl" 
              className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://linkedin.com/in/yourprofile" 
              value={formData.linkedinUrl}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="githubUrl">
              GitHub Profile (optional)
            </label>
            <input 
              type="url" 
              id="githubUrl" 
              name="githubUrl" 
              className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/yourusername" 
              value={formData.githubUrl}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Areas of interest (optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestOptions.map(interest => (
              <div 
                key={interest}
                onClick={() => handleToggleSelection('interests', interest)}
                className={`cursor-pointer flex items-center p-3 rounded-lg border transition-all
                  ${formData.interests.includes(interest) 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-300 hover:bg-gray-50'}`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center
                  ${formData.interests.includes(interest) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-400'}`}
                >
                  {formData.interests.includes(interest) && <Check size={12} className="text-white" />}
                </div>
                <span className="ml-2 text-sm">{interest}</span>
              </div>
            ))}
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
      case 2: return renderAcademicDetailsStep();
      case 3: return renderSkillsAndInterestsStep();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar forceLight={true} />
      
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/register" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ChevronLeft size={16} /> Back to account types
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Student Registration
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Join our student community and connect with startups
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
                      className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
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
                      className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Continue
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
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