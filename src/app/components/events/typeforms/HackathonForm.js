'use client';

import { useState } from 'react';

const HackathonForm = ({ formData, setFormData, errors }) => {
  const [showOtherTheme, setShowOtherTheme] = useState(formData.theme === 'other');

  const hackathonThemes = [
    { id: 'ai-ml', label: 'AI & Machine Learning' },
    { id: 'web3', label: 'Web3 & Blockchain' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'other', label: 'Other' }
  ];

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    setFormData(prev => ({ ...prev, theme: theme }));
    setShowOtherTheme(theme === 'other');
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
          Theme <span className="text-red-500">*</span>
        </label>
        <select
          id="theme"
          value={formData.theme || ''}
          onChange={handleThemeChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors?.theme ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select a theme</option>
          {hackathonThemes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.label}
            </option>
          ))}
        </select>
        {errors?.theme && (
          <p className="mt-1 text-sm text-red-600">{errors.theme}</p>
        )}

        {showOtherTheme && (
          <div className="mt-3">
            <label htmlFor="otherTheme" className="block text-sm font-medium text-gray-700">
              Please specify the theme <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="otherTheme"
              value={formData.otherTheme || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, otherTheme: e.target.value }))}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors?.otherTheme ? 'border-red-300' : ''
              }`}
              placeholder="E.g., 'Smart Cities', 'FinTech'"
            />
            {errors?.otherTheme && (
              <p className="mt-1 text-sm text-red-600">{errors.otherTheme}</p>
            )}
          </div>
        )}
      </div>

      {/* Problem Statement */}
      <div>
        <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700">
          Problem Statement <span className="text-red-500">*</span>
        </label>
        <textarea
          id="problemStatement"
          value={formData.problemStatement || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, problemStatement: e.target.value }))}
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors?.problemStatement ? 'border-red-300' : ''
          }`}
          placeholder="Describe the problem that participants need to solve"
        />
        {errors?.problemStatement && (
          <p className="mt-1 text-sm text-red-600">{errors.problemStatement}</p>
        )}
      </div>

      {/* Technical Requirements */}
      <div>
        <label htmlFor="technicalRequirements" className="block text-sm font-medium text-gray-700">
          Technical Requirements <span className="text-red-500">*</span>
        </label>
        <textarea
          id="technicalRequirements"
          value={formData.technicalRequirements || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, technicalRequirements: e.target.value }))}
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors?.technicalRequirements ? 'border-red-300' : ''
          }`}
          placeholder="List the technical requirements, APIs, or tools participants might need"
        />
        {errors?.technicalRequirements && (
          <p className="mt-1 text-sm text-red-600">{errors.technicalRequirements}</p>
        )}
      </div>

      {/* Prizes */}
      <div>
        <label htmlFor="prizes" className="block text-sm font-medium text-gray-700">
          Prizes <span className="text-red-500">*</span>
        </label>
        <textarea
          id="prizes"
          value={formData.prizes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, prizes: e.target.value }))}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors?.prizes ? 'border-red-300' : ''
          }`}
          placeholder="List the prizes for winners (e.g., '1st Prize: $1000 + Mentorship')"
        />
        {errors?.prizes && (
          <p className="mt-1 text-sm text-red-600">{errors.prizes}</p>
        )}
      </div>

      {/* Judging Criteria */}
      <div>
        <label htmlFor="judgingCriteria" className="block text-sm font-medium text-gray-700">
          Judging Criteria <span className="text-red-500">*</span>
        </label>
        <textarea
          id="judgingCriteria"
          value={formData.judgingCriteria || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, judgingCriteria: e.target.value }))}
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors?.judgingCriteria ? 'border-red-300' : ''
          }`}
          placeholder="List the criteria that will be used to judge the submissions"
        />
        {errors?.judgingCriteria && (
          <p className="mt-1 text-sm text-red-600">{errors.judgingCriteria}</p>
        )}
      </div>

      {/* Mentors/Judges */}
      <div>
        <label htmlFor="mentors" className="block text-sm font-medium text-gray-700">
          Mentors/Judges (Optional)
        </label>
        <textarea
          id="mentors"
          value={formData.mentors || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, mentors: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="List the mentors or judges who will be available during the hackathon"
        />
      </div>

      {/* Resources Provided */}
      <div>
        <label htmlFor="resources" className="block text-sm font-medium text-gray-700">
          Resources Provided (Optional)
        </label>
        <textarea
          id="resources"
          value={formData.resources || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="List any resources, APIs, or tools that will be provided to participants"
        />
      </div>
    </div>
  );
};

export default HackathonForm; 