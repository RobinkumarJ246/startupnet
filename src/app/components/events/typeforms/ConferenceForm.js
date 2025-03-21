'use client';

const ConferenceForm = ({ formData, setFormData, errors }) => {
  // Helper function for adding speakers
  const addSpeaker = () => {
    const newSpeaker = {
      name: '',
      role: '',
      bio: '',
      imageUrl: ''
    };
    
    const currentSpeakers = formData.speakers ? JSON.parse(formData.speakers) : [];
    const updatedSpeakers = [...currentSpeakers, newSpeaker];
    
    setFormData(prev => ({
      ...prev,
      speakers: JSON.stringify(updatedSpeakers)
    }));
  };
  
  // Helper function for removing speakers
  const removeSpeaker = (index) => {
    const currentSpeakers = formData.speakers ? JSON.parse(formData.speakers) : [];
    const updatedSpeakers = currentSpeakers.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      speakers: JSON.stringify(updatedSpeakers)
    }));
  };
  
  // Helper function for updating speaker information
  const updateSpeaker = (index, field, value) => {
    const currentSpeakers = formData.speakers ? JSON.parse(formData.speakers) : [];
    const updatedSpeakers = [...currentSpeakers];
    updatedSpeakers[index] = {
      ...updatedSpeakers[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      speakers: JSON.stringify(updatedSpeakers)
    }));
  };
  
  const speakers = formData.speakers ? JSON.parse(formData.speakers) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Conference Details</h2>
      
      <div className="space-y-4">
        {/* Agenda */}
        <div>
          <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">
            Agenda
          </label>
          <textarea
            id="agenda"
            rows={5}
            value={formData.agenda || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
            placeholder="Detailed schedule of the conference sessions and activities"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.agenda ? 'border-red-300' : ''
            }`}
          />
          {errors?.agenda && (
            <p className="mt-1 text-sm text-red-600">{errors.agenda}</p>
          )}
        </div>
        
        {/* Speakers */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="speakers" className="block text-sm font-medium text-gray-700">
              Speakers
            </label>
            <button
              type="button"
              onClick={addSpeaker}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Speaker
            </button>
          </div>
          
          {speakers.length === 0 && (
            <div className={`mt-1 p-4 border border-dashed rounded-md text-center text-gray-400 ${
              errors?.speakers ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}>
              No speakers added yet. Click "Add Speaker" to add conference speakers.
            </div>
          )}
          
          {speakers.length > 0 && (
            <div className="space-y-4 mt-3">
              {speakers.map((speaker, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Name
                      </label>
                      <input
                        type="text"
                        value={speaker.name}
                        onChange={(e) => updateSpeaker(index, 'name', e.target.value)}
                        placeholder="Speaker's name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Role
                      </label>
                      <input
                        type="text"
                        value={speaker.role}
                        onChange={(e) => updateSpeaker(index, 'role', e.target.value)}
                        placeholder="Speaker's role or title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-500">
                      Bio
                    </label>
                    <textarea
                      rows={2}
                      value={speaker.bio}
                      onChange={(e) => updateSpeaker(index, 'bio', e.target.value)}
                      placeholder="Brief biography of the speaker"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-500">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={speaker.imageUrl}
                      onChange={(e) => updateSpeaker(index, 'imageUrl', e.target.value)}
                      placeholder="URL to speaker's photo"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {errors?.speakers && (
            <p className="mt-1 text-sm text-red-600">{errors.speakers}</p>
          )}
        </div>
        
        {/* Conference Themes */}
        <div>
          <label htmlFor="themes" className="block text-sm font-medium text-gray-700">
            Conference Themes (Optional)
          </label>
          <textarea
            id="themes"
            rows={2}
            value={formData.themes || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, themes: e.target.value }))}
            placeholder="Main themes or tracks of the conference"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Partners/Sponsors */}
        <div>
          <label htmlFor="sponsors" className="block text-sm font-medium text-gray-700">
            Partners/Sponsors (Optional)
          </label>
          <textarea
            id="sponsors"
            rows={2}
            value={formData.sponsors || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, sponsors: e.target.value }))}
            placeholder="List of sponsors or partners supporting the conference"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Special Activities */}
        <div>
          <label htmlFor="specialActivities" className="block text-sm font-medium text-gray-700">
            Special Activities (Optional)
          </label>
          <textarea
            id="specialActivities"
            rows={2}
            value={formData.specialActivities || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, specialActivities: e.target.value }))}
            placeholder="Any special activities like networking sessions, panel discussions, etc."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ConferenceForm; 