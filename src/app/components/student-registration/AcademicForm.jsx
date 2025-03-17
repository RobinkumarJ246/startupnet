'use client';
import { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  GraduationCap, 
  BookOpen,
  AlertCircle,
  MapPin,
  Info
} from 'lucide-react';
import LocationSelector from './LocationSelector';
import UniversitySelector from './UniversitySelector';
import CollegeSelector from './CollegeSelector';

export default function AcademicForm({ formData, onChange, errors, setFormErrors }) {
  const [showCustomCourse, setShowCustomCourse] = useState(formData.course === 'Other');
  const [showCustomMajor, setShowCustomMajor] = useState(true); // Default to true until we check dropdown selection

  // Common majors by course type
  const majorOptions = {
    'B.Tech': ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Electronics and Communication', 'Chemical', 'Biotechnology', 'Other'],
    'BE': ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Biotechnology', 'Artificial Intelligence & Data Science', 'Robotics & Automation', 'Mechatronics Engineering', 'Automobile Engineering', 'Aerospace Engineering', 'Industrial Engineering', 'Biomedical Engineering', 'Environmental Engineering', 'Textile Engineering', 'Mining Engineering', 'Petroleum Engineering', 'Agricultural Engineering', 'Marine Engineering', 'Instrumentation & Control Engineering', 'Metallurgical Engineering', 'Other'],
    'B.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics', 'Other'],
    'BCA': ['Computer Applications', 'Software Development', 'Web Development', 'Other'],
    'M.Tech': ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Biotechnology', 'Other'],
    'ME': ['Computer Science & Engineering', 'Software Engineering', 'Data Science & AI', 'Cybersecurity & Forensics', 'Embedded Systems', 'VLSI Design', 'Communication Systems', 'Power Systems & Power Electronics', 'Structural Engineering', 'Thermal Engineering', 'Automobile Engineering', 'IoT (Internet of Things)', 'Robotics & Automation', 'Biomedical Engineering', 'Nanotechnology', 'Environmental Engineering', 'Renewable Energy', 'Industrial Engineering & Management', 'Advanced Manufacturing', 'Mechatronics', 'Control & Instrumentation', 'Transportation Engineering', 'Geotechnical Engineering', 'Water Resources Engineering', 'Construction Management', 'Energy Systems', 'Aerospace Engineering', 'Textile Engineering', 'Bioprocess Engineering', 'Pharmaceutical Technology', 'Other'],
    'MCA': ['Computer Applications', 'Software Development', 'Web Development', 'Other'],
    'M.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Statistics', 'Other'],
    'MBA': ['Finance', 'Marketing', 'Human Resources', 'Operations', 'International Business', 'Information Systems', 'Other'],
    'PhD': ['Computer Science', 'Engineering', 'Sciences', 'Business', 'Arts', 'Other'],
    'Other': ['Other']
  };

  // Get current major options based on selected course
  const currentMajorOptions = formData.course ? (majorOptions[formData.course] || majorOptions['Other']) : [];

  // Handle course change
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    setShowCustomCourse(value === 'Other');
    
    // Reset major when course changes
    if (value !== formData.course) {
      const event = {
        target: {
          name: 'major',
          value: '',
          type: 'text'
        }
      };
      onChange(event);
      setShowCustomMajor(false);
    }
  };

  // Handle major change
  const handleMajorChange = (e) => {
    const { value } = e.target;
    onChange(e);
    setShowCustomMajor(value === 'Other');
  };

  // Handle custom course change
  const handleCustomCourseChange = (e) => {
    const { value } = e.target;
    const event = {
      target: {
        name: 'course',
        value: value,
        type: 'text'
      }
    };
    onChange(event);
  };

  // Handle custom major change
  const handleCustomMajorChange = (e) => {
    const { value } = e.target;
    const event = {
      target: {
        name: 'major',
        value: value,
        type: 'text'
      }
    };
    onChange(event);
  };

  // Update showCustomMajor when formData.major changes
  useEffect(() => {
    if (formData.course && currentMajorOptions.length > 0) {
      setShowCustomMajor(!currentMajorOptions.includes(formData.major) || formData.major === 'Other');
    }
  }, [formData.course, formData.major, currentMajorOptions]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Academic Details</h2>
      <p className="text-gray-600">Tell us about your educational background to help match you with relevant opportunities.</p>
      
      <div className="space-y-6">
        <div>
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
              className={`py-3 px-4 pl-10 block w-full border ${errors?.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="John Doe" 
              value={formData.fullName}
              onChange={onChange}
            />
          </div>
          {errors?.fullName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>
        
        <LocationSelector 
          formData={formData} 
          onChange={onChange} 
          errors={errors} 
          setFormErrors={setFormErrors} 
        />
        <p className="mt-1 text-xs text-gray-600 flex items-center">
              <Info size={12} className="mr-1" />
              This should be your academic institution's location, not your residence
            </p>
        
        <UniversitySelector 
          formData={formData} 
          onChange={onChange} 
          errors={errors} 
          setFormErrors={setFormErrors} 
        />
        
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="isUniversityCollege"
            name="isUniversityCollege"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.isUniversityCollege}
            onChange={onChange}
          />
          <label htmlFor="isUniversityCollege" className="ml-2 block text-sm text-gray-700">
            My university is also my college (Skip college field)
          </label>
        </div>
        
        {!formData.isUniversityCollege && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="college">
              College <span className="text-xs text-gray-500">(Located in {formData.district ? formData.district + ', ' : ''}{formData.state ? formData.state + ', ' : ''}{formData.country || 'your country'})</span>
            </label>
            <CollegeSelector 
              formData={formData} 
              onChange={onChange} 
              errors={errors} 
              setFormErrors={setFormErrors} 
              isUniversityCollege={formData.isUniversityCollege}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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
                className={`py-3 px-4 pl-10 block w-full border ${errors?.graduationYear ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.graduationYear}
                onChange={onChange}
              >
                <option value="">Select year</option>
                {Array.from({length: 8}, (_, i) => (
                  <option key={i} value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</option>
                ))}
              </select>
            </div>
            {errors?.graduationYear && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.graduationYear}
              </p>
            )}
          </div>
          
          <div>
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
                className={`py-3 px-4 pl-10 block w-full border ${errors?.course ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                value={formData.course === 'Other' ? 'Other' : formData.course}
                onChange={handleCourseChange}
              >
                <option value="">Select course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="BE">BE</option>
                <option value="B.Sc">B.Sc</option>
                <option value="BCA">BCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="ME">ME</option>
                <option value="MCA">MCA</option>
                <option value="M.Sc">M.Sc</option>
                <option value="MBA">MBA</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {showCustomCourse && (
              <div className="mt-2">
                <input 
                  type="text" 
                  id="customCourse" 
                  className={`py-3 px-4 block w-full border ${errors?.course ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your course" 
                  value={formData.course !== 'Other' ? formData.course : ''}
                  onChange={handleCustomCourseChange}
                />
              </div>
            )}
            {errors?.course && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.course}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="major">
            Major/Specialization
          </label>
          {formData.course && currentMajorOptions.length > 0 ? (
            <>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BookOpen size={18} className="text-gray-500" />
                </div>
                <select
                  id="major"
                  name="major"
                  className={`py-3 px-4 pl-10 block w-full border ${errors?.major ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={currentMajorOptions.includes(formData.major) ? formData.major : 'Other'}
                  onChange={handleMajorChange}
                  disabled={!formData.course}
                >
                  <option value="">Select major</option>
                  {currentMajorOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {showCustomMajor && (
                <div className="mt-2">
                  <input 
                    type="text" 
                    id="customMajor" 
                    className={`py-3 px-4 block w-full border ${errors?.major ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter your major/specialization" 
                    value={!currentMajorOptions.includes(formData.major) ? formData.major : ''}
                    onChange={handleCustomMajorChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BookOpen size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                id="major" 
                name="major" 
                className={`py-3 px-4 pl-10 block w-full border ${errors?.major ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Computer Science" 
                value={formData.major}
                onChange={onChange}
                disabled={!formData.course}
              />
            </div>
          )}
          {errors?.major && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.major}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Your field of study or specialization</p>
        </div>
      </div>
    </div>
  );
} 