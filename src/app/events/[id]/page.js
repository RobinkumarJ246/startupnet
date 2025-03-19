'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, Tag, ArrowLeft, Ticket, Share2 } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';

const EventPage = ({ params }) => {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Get user type from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserType(parsedUser.type);
    }
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Handle event registration
  const handleRegister = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register for event');
      }

      // Refresh event data to show updated attendees
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Event not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Events</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Event Header */}
          <div className="relative h-96">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-blue-700"></div>
            )}
            
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {event.eventType}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {event.eventMode}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(event.startDate)}</span>
                    {event.endDate && <span> - {formatDate(event.endDate)}</span>}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(event.startTime)}</span>
                    {event.endTime && <span> - {formatTime(event.endTime)}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                </div>

                {/* Event Type Specific Details */}
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
                  {event.eventType === 'culturals' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Performance Type</h3>
                        <p className="text-gray-600">{event.performanceType}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Participation Requirements</h3>
                        <p className="text-gray-600">{event.participationRequirements}</p>
                      </div>
                      {event.judgesInfo && (
                        <div>
                          <h3 className="font-medium">Judges/Special Guests</h3>
                          <p className="text-gray-600">{event.judgesInfo}</p>
                        </div>
                      )}
                      {event.prizes && (
                        <div>
                          <h3 className="font-medium">Prizes</h3>
                          <p className="text-gray-600">{event.prizes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {event.eventType === 'expertLecture' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Speaker</h3>
                        <p className="text-gray-600">{event.speakerName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Credentials</h3>
                        <p className="text-gray-600">{event.speakerCredentials}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Topics Covered</h3>
                        <p className="text-gray-600">{event.topicsCovered}</p>
                      </div>
                    </div>
                  )}

                  {event.eventType === 'workshop' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Learning Objectives</h3>
                        <p className="text-gray-600">{event.learningObjectives}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Prerequisites</h3>
                        <p className="text-gray-600">{event.prerequisites}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Materials</h3>
                        <p className="text-gray-600">{event.materials}</p>
                      </div>
                    </div>
                  )}

                  {event.eventType === 'conference' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Agenda</h3>
                        <p className="text-gray-600">{event.agenda}</p>
                      </div>
                      {event.speakers && event.speakers.length > 0 && (
                        <div>
                          <h3 className="font-medium">Speakers</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {event.speakers.map((speaker, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium">{speaker.name}</h4>
                                <p className="text-sm text-gray-600">{speaker.role}</p>
                                <p className="text-sm text-gray-600 mt-2">{speaker.bio}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {event.eventType === 'meetup' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Target Audience</h3>
                        <p className="text-gray-600">{event.targetAudience}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Format</h3>
                        <p className="text-gray-600">{event.meetupFormat}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Activities</h3>
                        <p className="text-gray-600">{event.activityDescription}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-semibold">
                        {event.isFree ? 'Free' : `₹${event.price}`}
                      </span>
                    </div>

                    {event.hasEarlyBird && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>Early Bird Price</span>
                        <span className="font-semibold">₹{event.earlyBirdPrice}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Attendees</span>
                      <span className="font-semibold">
                        {event.attendees?.length || 0} / {event.maxAttendees}
                      </span>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Location</span>
                        <div className="text-right">
                          {event.venue && <p className="font-medium">{event.venue}</p>}
                          {event.address && <p className="text-sm text-gray-600">{event.address}</p>}
                          {event.city && event.state && (
                            <p className="text-sm text-gray-600">
                              {event.city}, {event.state}
                            </p>
                          )}
                        </div>
                      </div>

                      {event.virtualLink && (
                        <div className="mb-4">
                          <a
                            href={event.virtualLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Join Virtual Event →
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleRegister}
                        disabled={event.attendees?.length >= event.maxAttendees}
                        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          event.attendees?.length >= event.maxAttendees
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        {event.attendees?.length >= event.maxAttendees
                          ? 'Event Full'
                          : 'Register Now'}
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          // You might want to add a toast notification here
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage; 