import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Mock database (replace with actual DB implementation)
const events = [
  {
    id: '1',
    title: 'TechCon 2023',
    description: 'The largest tech conference for students and startups, featuring keynotes, workshops, and networking opportunities.',
    type: 'conference',
    mode: 'in-person',
    startDate: '2023-07-15',
    endDate: '2023-07-17',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Convention Center, New York',
    maxAttendees: 1000,
    currentAttendees: 750,
    isFree: false,
    price: '99.99',
    hasEarlyBird: true,
    earlyBirdPrice: '79.99',
    earlyBirdEndDate: '2023-06-15',
    tags: ['Technology', 'Networking', 'Startups'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    organizer: 'Tech Association',
    organizerType: 'club',
    organizerId: '123',
    attendees: [],
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    title: 'Startup Pitch Night',
    description: 'Present your startup idea to a panel of investors and receive valuable feedback.',
    type: 'pitch-event',
    mode: 'hybrid',
    startDate: '2023-08-05',
    startTime: '18:30',
    endTime: '21:00',
    location: 'Startup Hub, San Francisco',
    virtualLink: 'https://zoom.us/j/123456789',
    maxAttendees: 200,
    currentAttendees: 120,
    isFree: true,
    tags: ['Pitch', 'Investors', 'Funding'],
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80',
    organizer: 'Venture Capital Partners',
    organizerType: 'startup',
    organizerId: '456',
    attendees: [],
    createdAt: '2023-02-10T10:30:00Z',
    updatedAt: '2023-02-10T10:30:00Z',
    status: 'active'
  },
  {
    id: '3',
    title: 'Design Thinking Workshop',
    description: 'Learn how to apply design thinking principles to solve complex problems and create innovative solutions.',
    type: 'workshop',
    mode: 'virtual',
    startDate: '2023-09-10',
    startTime: '10:00',
    endTime: '16:00',
    virtualLink: 'https://meet.google.com/abc-defg-hij',
    maxAttendees: 50,
    currentAttendees: 35,
    isFree: false,
    price: '49.99',
    tags: ['Design', 'Innovation', 'Workshop'],
    imageUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    organizer: 'Design Innovation Club',
    organizerType: 'club',
    organizerId: '789',
    attendees: [],
    createdAt: '2023-03-05T15:45:00Z',
    updatedAt: '2023-03-05T15:45:00Z',
    status: 'active'
  }
];

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const db = await connectToDatabase();
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid event ID' }, { status: 400 });
    }
    
    // Find the event by ID
    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { message: 'Failed to fetch event', error: error.message },
      { status: 500 }
    );
  }
} 