// app/host-event/components/EventTypeSelector.js
export function EventTypeSelector({ onSelect, selectedType }) {
  const eventTypes = [
    { id: 'hackathon', name: 'Hackathon', icon: '💻' },
    { id: 'cultural', name: 'Cultural Event', icon: '🎭' },
    { id: 'music', name: 'Music Festival', icon: '🎵' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Event Type</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {eventTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`
              relative rounded-lg p-6 flex flex-col items-center text-center transition-all duration-300
              ${selectedType === type.id 
                ? 'bg-indigo-600 text-white shadow-lg border-2 border-indigo-600 transform scale-105' 
                : 'bg-white text-gray-700 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300'}
            `}
          >
            <span className="text-4xl mb-2">{type.icon}</span>
            <h3 className="text-lg font-medium">{type.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}