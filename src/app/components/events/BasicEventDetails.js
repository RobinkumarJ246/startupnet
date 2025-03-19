'use client';

import EventTypeSelector from './EventTypeSelector';

const BasicEventDetails = ({ formData, setFormData, errors, userType }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.title ? 'border-red-300' : ''
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.description ? 'border-red-300' : ''
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Event Type Selector Component */}
        <EventTypeSelector 
          value={formData.type}
          onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          error={errors.type}
          userType={userType}
        />

        <div>
          <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
            Event Mode
          </label>
          <select
            id="mode"
            value={formData.mode}
            onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="in-person">In-Person</option>
            <option value="virtual">Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
          {errors.mode && (
            <p className="mt-1 text-sm text-red-600">{errors.mode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicEventDetails; 