'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationSize: '',
    website: '',
    university: '',
    graduationYear: '',
    course: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOrganizationEmail = (email) => {
    const commonEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !commonEmailProviders.includes(domain);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Common validations
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (userType === 'organization' && !validateOrganizationEmail(formData.email)) {
      newErrors.email = 'Please use your organization email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Organization-specific validations
    if (userType === 'organization') {
      if (!formData.organizationName) {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!formData.website) {
        newErrors.website = 'Website is required';
      }
    }

    // Student-specific validations
    if (userType === 'student') {
      if (!formData.university) {
        newErrors.university = 'University name is required';
      }
      if (!formData.graduationYear) {
        newErrors.graduationYear = 'Graduation year is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Join our community and start collaborating</p>
        </div>

        {/* User Type Selection */}
        {!userType && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setUserType('student')}
              className="p-6 text-center border-2 rounded-xl hover:border-indigo-500 hover:bg-indigo-50"
            >
              <span className="text-2xl mb-2 block">🎓</span>
              <h3 className="font-semibold">I'm a Student</h3>
            </button>
            <button
              onClick={() => setUserType('organization')}
              className="p-6 text-center border-2 rounded-xl hover:border-indigo-500 hover:bg-indigo-50"
            >
              <span className="text-2xl mb-2 block">🏢</span>
              <h3 className="font-semibold">For my organization</h3>
            </button>
          </div>
        )}

        {userType && (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {userType === 'student' ? 'Student Registration' : 'Organization Registration'}
              </h3>
              <button
                type="button"
                onClick={() => setUserType('')}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change Type
              </button>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Organization-specific Fields */}
            {userType === 'organization' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.organizationName && <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization Size</label>
                  <select
                    name="organizationSize"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
                </div>
              </>
            )}

            {/* Student-specific Fields */}
            {userType === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">University</label>
                  <input
                    type="text"
                    name="university"
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                    <select
                      name="graduationYear"
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select year</option>
                      {[...Array(6)].map((_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Course/Major</label>
                    <input
                      type="text"
                      name="course"
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;