'use client';

const DateTimeSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Date and Time</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.startDate ? 'border-red-300' : ''
            }`}
          />
          {errors?.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date (Optional)
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            min={formData.startDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors?.startTime ? 'border-red-300' : ''
            }`}
          />
          {errors?.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time (Optional)
          </label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.isRecurring || false}
            onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
            This is a recurring event
          </label>
        </div>
        
        {formData.isRecurring && (
          <div className="mt-3 ml-6">
            <label htmlFor="recurringPattern" className="block text-sm font-medium text-gray-700">
              Recurring Pattern
            </label>
            <select
              id="recurringPattern"
              value={formData.recurringPattern || 'weekly'}
              onChange={(e) => setFormData(prev => ({ ...prev, recurringPattern: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            
            <div className="mt-3">
              <label htmlFor="recurringUntil" className="block text-sm font-medium text-gray-700">
                Recurring Until
              </label>
              <input
                type="date"
                id="recurringUntil"
                value={formData.recurringUntil || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, recurringUntil: e.target.value }))}
                min={formData.startDate}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimeSection;