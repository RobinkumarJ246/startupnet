'use client';

const EventFilters = ({ activeFilter, onFilterChange }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="flex space-x-4">
      <button
        onClick={() => onFilterChange('trending')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeFilter === 'trending'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Trending
      </button>
      <button
        onClick={() => onFilterChange('upcoming')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeFilter === 'upcoming'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => onFilterChange('spotlight')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeFilter === 'spotlight'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Spotlight
      </button>
    </div>
  </div>
);

export default EventFilters;