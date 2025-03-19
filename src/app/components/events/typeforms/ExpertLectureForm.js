'use client';

const ExpertLectureForm = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Expert Lecture Details</h2>
      
      <div className="space-y-4">
        {/* Speaker Name */}
        <div>
          <label htmlFor="speakerName" className="block text-sm font-medium text-gray-700">
            Speaker Name
          </label>
          <input
            type="text"
            id="speakerName"
            value={formData.speakerName || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, speakerName: e.target.value }))}
            placeholder="Full name of the speaker"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.speakerName ? 'border-red-300' : ''
            }`}
          />
          {errors?.speakerName && (
            <p className="mt-1 text-sm text-red-600">{errors.speakerName}</p>
          )}
        </div>
        
        {/* Speaker Credentials */}
        <div>
          <label htmlFor="speakerCredentials" className="block text-sm font-medium text-gray-700">
            Speaker Credentials
          </label>
          <textarea
            id="speakerCredentials"
            rows={3}
            value={formData.speakerCredentials || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, speakerCredentials: e.target.value }))}
            placeholder="Professional background, achievements, and expertise of the speaker"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.speakerCredentials ? 'border-red-300' : ''
            }`}
          />
          {errors?.speakerCredentials && (
            <p className="mt-1 text-sm text-red-600">{errors.speakerCredentials}</p>
          )}
        </div>
        
        {/* Topics */}
        <div>
          <label htmlFor="topics" className="block text-sm font-medium text-gray-700">
            Topics
          </label>
          <textarea
            id="topics"
            rows={3}
            value={formData.topics || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, topics: e.target.value }))}
            placeholder="Main topics that will be covered in the lecture"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.topics ? 'border-red-300' : ''
            }`}
          />
          {errors?.topics && (
            <p className="mt-1 text-sm text-red-600">{errors.topics}</p>
          )}
        </div>
        
        {/* Speaker Bio */}
        <div>
          <label htmlFor="speakerBio" className="block text-sm font-medium text-gray-700">
            Speaker Bio (Optional)
          </label>
          <textarea
            id="speakerBio"
            rows={3}
            value={formData.speakerBio || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, speakerBio: e.target.value }))}
            placeholder="Detailed biography of the speaker"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Speaker Image URL */}
        <div>
          <label htmlFor="speakerImageUrl" className="block text-sm font-medium text-gray-700">
            Speaker Image URL (Optional)
          </label>
          <input
            type="url"
            id="speakerImageUrl"
            value={formData.speakerImageUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, speakerImageUrl: e.target.value }))}
            placeholder="URL to the speaker's photo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Target Audience */}
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
            Target Audience (Optional)
          </label>
          <input
            type="text"
            id="targetAudience"
            value={formData.targetAudience || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
            placeholder="Who should attend this lecture? (e.g., Engineering students, Business professionals)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Presentation Format */}
        <div>
          <label htmlFor="presentationFormat" className="block text-sm font-medium text-gray-700">
            Presentation Format (Optional)
          </label>
          <select
            id="presentationFormat"
            value={formData.presentationFormat || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, presentationFormat: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select format</option>
            <option value="lecture">Lecture</option>
            <option value="panel-discussion">Panel Discussion</option>
            <option value="fireside-chat">Fireside Chat</option>
            <option value="interactive-session">Interactive Session</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExpertLectureForm; 