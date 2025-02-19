'use client';

import EventCard from './EventCard';

const EventSection = ({ title, events }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="font-semibold mb-4">{title}</h3>
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);

export default EventSection;