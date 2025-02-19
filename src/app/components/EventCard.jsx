'use client';

const EventCard = ({ event }) => (
  <div className="border-l-4 border-indigo-500 pl-3">
    <h4 className="font-medium">{event.title}</h4>
    <p className="text-sm text-gray-600">
      {event.date} • {event.location}
    </p>
    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
      {event.type}
    </span>
  </div>
);

export default EventCard;