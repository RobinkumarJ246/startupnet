'use client';

const LocationSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
      
      {(formData.eventMode === 'in-person' || formData.eventMode === 'hybrid') && (
        <div className="mb-4">
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
            Venue Name
          </label>
          <input
            type="text"
            id="venue"
            value={formData.venue || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.venue ? 'border-red-300' : ''
            }`}
            placeholder="Enter venue name"
          />
          {errors?.venue && (
            <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
          )}
          
          <div className="mt-3">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors?.address ? 'border-red-300' : ''
              }`}
              placeholder="Enter full address"
              rows={3}
            />
            {errors?.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors?.city ? 'border-red-300' : ''
                }`}
                placeholder="City"
              />
              {errors?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.state || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors?.state ? 'border-red-300' : ''
                }`}
                placeholder="State"
              />
              {errors?.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={formData.country || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors?.country ? 'border-red-300' : ''
                }`}
                placeholder="Country"
              />
              {errors?.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                Zip/Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Zip/Postal Code"
              />
            </div>
          </div>
          
          <div className="mt-3">
            <label htmlFor="directions" className="block text-sm font-medium text-gray-700">
              Directions (Optional)
            </label>
            <textarea
              id="directions"
              value={formData.directions || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, directions: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Additional directions to help attendees find the venue"
              rows={2}
            />
          </div>
        </div>
      )}
      
      {(formData.eventMode === 'virtual' || formData.eventMode === 'hybrid') && (
        <div>
          <label htmlFor="virtualLink" className="block text-sm font-medium text-gray-700">
            Virtual Meeting Link
          </label>
          <input
            type="url"
            id="virtualLink"
            value={formData.virtualLink || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, virtualLink: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.virtualLink ? 'border-red-300' : ''
            }`}
            placeholder="https://..."
          />
          {errors?.virtualLink && (
            <p className="mt-1 text-sm text-red-600">{errors.virtualLink}</p>
          )}
          
          <div className="mt-3">
            <label htmlFor="platformInfo" className="block text-sm font-medium text-gray-700">
              Platform Information (Optional)
            </label>
            <textarea
              id="platformInfo"
              value={formData.platformInfo || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, platformInfo: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Additional information about the virtual platform (e.g., password, waiting room, etc.)"
              rows={2}
            />
          </div>
        </div>
      )}
      
      {!formData.eventMode && (
        <p className="text-sm text-amber-600">
          Please select an event mode (In-Person, Virtual, or Hybrid) in the Basic Details section.
        </p>
      )}
    </div>
  );
};

export default LocationSection; 