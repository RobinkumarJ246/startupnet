'use client';
import { useState } from 'react';
import { 
  User, 
  Building, 
  GraduationCap, 
  BookOpen,
  AlertCircle
} from 'lucide-react';
import LocationSelector from './LocationSelector';
import UniversitySelector from './UniversitySelector';
import CollegeSelector from './CollegeSelector';

export default function AcademicForm({ formData, onChange, errors, setFormErrors }) {
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
          <CollegeSelector 
            formData={formData} 
            onChange={onChange} 
            errors={errors} 
            setFormErrors={setFormErrors} 
            isUniversityCollege={formData.isUniversityCollege}
          />
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
                value={formData.course}
                onChange={onChange}
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
            />
          </div>
          {errors?.major && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.major}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 