'use client';

const WorkshopForm = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Workshop Details</h2>
      
      <div className="space-y-4">
        {/* Learning Objectives */}
        <div>
          <label htmlFor="learningObjectives" className="block text-sm font-medium text-gray-700">
            Learning Objectives
          </label>
          <textarea
            id="learningObjectives"
            rows={3}
            value={formData.learningObjectives || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, learningObjectives: e.target.value }))}
            placeholder="What participants will learn from this workshop"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.learningObjectives ? 'border-red-300' : ''
            }`}
          />
          {errors?.learningObjectives && (
            <p className="mt-1 text-sm text-red-600">{errors.learningObjectives}</p>
          )}
        </div>
        
        {/* Prerequisites */}
        <div>
          <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
            Prerequisites
          </label>
          <textarea
            id="prerequisites"
            rows={2}
            value={formData.prerequisites || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, prerequisites: e.target.value }))}
            placeholder="Required knowledge or skills participants should have"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.prerequisites ? 'border-red-300' : ''
            }`}
          />
          {errors?.prerequisites && (
            <p className="mt-1 text-sm text-red-600">{errors.prerequisites}</p>
          )}
        </div>
        
        {/* Materials */}
        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
            Materials
          </label>
          <textarea
            id="materials"
            rows={2}
            value={formData.materials || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
            placeholder="Materials provided or needed for the workshop"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.materials ? 'border-red-300' : ''
            }`}
          />
          {errors?.materials && (
            <p className="mt-1 text-sm text-red-600">{errors.materials}</p>
          )}
        </div>
        
        {/* Instructor Details */}
        <div>
          <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700">
            Instructor Name (Optional)
          </label>
          <input
            type="text"
            id="instructorName"
            value={formData.instructorName || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
            placeholder="Name of the workshop instructor"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="instructorCredentials" className="block text-sm font-medium text-gray-700">
            Instructor Credentials (Optional)
          </label>
          <textarea
            id="instructorCredentials"
            rows={2}
            value={formData.instructorCredentials || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, instructorCredentials: e.target.value }))}
            placeholder="Experience and qualifications of the instructor"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Workshop Structure */}
        <div>
          <label htmlFor="workshopStructure" className="block text-sm font-medium text-gray-700">
            Workshop Structure (Optional)
          </label>
          <textarea
            id="workshopStructure"
            rows={3}
            value={formData.workshopStructure || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, workshopStructure: e.target.value }))}
            placeholder="Detailed breakdown of workshop activities and timeline"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Software Requirements */}
        <div>
          <label htmlFor="softwareRequirements" className="block text-sm font-medium text-gray-700">
            Software Requirements (Optional)
          </label>
          <textarea
            id="softwareRequirements"
            rows={2}
            value={formData.softwareRequirements || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, softwareRequirements: e.target.value }))}
            placeholder="Any software participants need to install before the workshop"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkshopForm; 