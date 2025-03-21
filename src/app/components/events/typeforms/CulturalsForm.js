'use client';

const CulturalsForm = ({ formData, setFormData, errors }) => {
  const performanceTypes = [
    'Music',
    'Dance',
    'Drama',
    'Art',
    'Photography',
    'Fashion',
    'Literature',
    'Culinary',
    'Other'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cultural Event Details</h2>
      
      <div className="space-y-4">
        {/* Performance Type */}
        <div>
          <label htmlFor="performanceType" className="block text-sm font-medium text-gray-700">
            Performance Type
          </label>
          <select
            id="performanceType"
            value={formData.performanceType || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, performanceType: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.performanceType ? 'border-red-300' : ''
            }`}
          >
            <option value="">Select performance type</option>
            {performanceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors?.performanceType && (
            <p className="mt-1 text-sm text-red-600">{errors.performanceType}</p>
          )}
          {formData.performanceType === 'Other' && (
            <input
              type="text"
              placeholder="Specify other performance type"
              value={formData.otherPerformanceType || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, otherPerformanceType: e.target.value }))}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          )}
        </div>
        
        {/* Participation Requirements */}
        <div>
          <label htmlFor="participationRequirements" className="block text-sm font-medium text-gray-700">
            Participation Requirements
          </label>
          <textarea
            id="participationRequirements"
            rows={3}
            value={formData.participationRequirements || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, participationRequirements: e.target.value }))}
            placeholder="Describe requirements for participants (e.g., age restrictions, equipment, dress code)"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.participationRequirements ? 'border-red-300' : ''
            }`}
          />
          {errors?.participationRequirements && (
            <p className="mt-1 text-sm text-red-600">{errors.participationRequirements}</p>
          )}
        </div>
        
        {/* Event Format */}
        <div>
          <label htmlFor="eventFormat" className="block text-sm font-medium text-gray-700">
            Event Format (Optional)
          </label>
          <select
            id="eventFormat"
            value={formData.eventFormat || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, eventFormat: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select format</option>
            <option value="competition">Competition</option>
            <option value="exhibition">Exhibition</option>
            <option value="workshop">Workshop</option>
            <option value="performance">Performance</option>
            <option value="interactive">Interactive</option>
          </select>
        </div>
        
        {/* Judges */}
        <div>
          <label htmlFor="judges" className="block text-sm font-medium text-gray-700">
            Judges/Special Guests (Optional)
          </label>
          <textarea
            id="judges"
            rows={2}
            value={formData.judges || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, judges: e.target.value }))}
            placeholder="List any judges or special guests"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Prizes */}
        <div>
          <label htmlFor="prizes" className="block text-sm font-medium text-gray-700">
            Prizes (Optional)
          </label>
          <textarea
            id="prizes"
            rows={2}
            value={formData.prizes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, prizes: e.target.value }))}
            placeholder="Describe any prizes or awards"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Equipment Provided */}
        <div>
          <label htmlFor="equipmentProvided" className="block text-sm font-medium text-gray-700">
            Equipment Provided (Optional)
          </label>
          <textarea
            id="equipmentProvided"
            rows={2}
            value={formData.equipmentProvided || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, equipmentProvided: e.target.value }))}
            placeholder="List any equipment that will be provided to participants"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default CulturalsForm; 