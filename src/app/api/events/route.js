import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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
  },
  {
    id: '4',
    title: 'AI Ethics Symposium',
    description: 'Join us for a day of discussions on ethical considerations in artificial intelligence development and deployment.',
    type: 'symposium',
    mode: 'in-person',
    startDate: '2023-10-20',
    startTime: '10:00',
    endTime: '17:00',
    location: 'University Auditorium, Boston',
    maxAttendees: 300,
    currentAttendees: 210,
    isFree: false,
    price: '29.99',
    tags: ['AI', 'Ethics', 'Technology'],
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    organizer: 'AI Research Group',
    organizerType: 'club',
    organizerId: '321',
    attendees: [],
    createdAt: '2023-04-15T09:20:00Z',
    updatedAt: '2023-04-15T09:20:00Z',
    status: 'active'
  },
  {
    id: '5',
    title: 'Product Management Masterclass',
    description: 'A comprehensive workshop on product management methodologies for startups and emerging businesses.',
    type: 'workshop',
    mode: 'hybrid',
    startDate: '2023-11-05',
    startTime: '09:30',
    endTime: '16:30',
    location: 'Innovation Hub, Chicago',
    virtualLink: 'https://zoom.us/j/987654321',
    maxAttendees: 100,
    currentAttendees: 45,
    isFree: false,
    price: '149.99',
    hasEarlyBird: true,
    earlyBirdPrice: '119.99',
    earlyBirdEndDate: '2023-10-15',
    tags: ['Product Management', 'Startups', 'Business'],
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    organizer: 'Product School',
    organizerType: 'startup',
    organizerId: '654',
    attendees: [],
    createdAt: '2023-05-20T11:30:00Z',
    updatedAt: '2023-05-20T11:30:00Z',
    status: 'active'
  }
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const typeParam = searchParams.get('type'); // specific event type (optional)
    const mode = searchParams.get('mode');
    const organizerType = searchParams.get('organizerType');
    const isFree = searchParams.get('isFree');
    const organizerId = searchParams.get('organizerId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search')?.toLowerCase();
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Determine which collections to query
    const eventTypes = ['hackathon', 'culturals', 'expert-lecture', 'workshop', 'conference'];
    const collectionsToQuery = typeParam ? [typeParam] : eventTypes;
    
    // Build the base query filter
    const baseFilter = {};
    
    if (mode) {
      baseFilter.mode = mode;
    }
    
    if (organizerType) {
      baseFilter.organizerType = organizerType;
    }
    
    if (isFree === 'true') {
      baseFilter.isFree = true;
    } else if (isFree === 'false') {
      baseFilter.isFree = false;
    }
    
    if (organizerId) {
      baseFilter.organizerId = organizerId;
    }
    
    if (tag) {
      baseFilter.tags = { $elemMatch: { $regex: new RegExp(tag, 'i') } };
    }
    
    if (search) {
      baseFilter.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { organizer: { $regex: new RegExp(search, 'i') } }
      ];
    }
    
    // Add status filter for active events only
    baseFilter.status = 'active';
    
    // Query each collection and combine results
    let allEvents = [];
    let totalEvents = 0;
    
    // Get the count from all collections
    for (const collectionName of collectionsToQuery) {
      const count = await db.collection(collectionName).countDocuments(baseFilter);
      totalEvents += count;
    }
    
    // Calculate how many results to skip
    const skip = (page - 1) * limit;
    
    // Figure out which collections to fetch from and how many from each
    let remainingLimit = limit;
    let currentSkip = skip;
    
    for (const collectionName of collectionsToQuery) {
      // Skip this collection if we've already collected enough events
      if (remainingLimit <= 0) continue;
      
      // Count documents in this collection
      const collectionCount = await db.collection(collectionName).countDocuments(baseFilter);
      
      // If skip is larger than the count, skip this collection entirely
      if (currentSkip >= collectionCount) {
        currentSkip -= collectionCount;
        continue;
      }
      
      // Get the events from this collection
      const collectionEvents = await db.collection(collectionName)
        .find(baseFilter)
        .sort({ startDate: 1 }) // Sort by start date ascending (upcoming first)
        .skip(currentSkip)
        .limit(remainingLimit)
        .toArray();
      
      // Add collection type to each event
      const eventsWithType = collectionEvents.map(event => ({
        ...event,
        collectionType: collectionName
      }));
      
      // Add the events to our list
      allEvents = [...allEvents, ...eventsWithType];
      
      // Reset skip for next collection since we've used it up
      currentSkip = 0;
      
      // Reduce remaining limit
      remainingLimit -= collectionEvents.length;
    }
    
    // Sort combined results by date
    allEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    // Prepare response by removing sensitive data
    const safeEvents = allEvents.map(event => {
      // Convert MongoDB _id to string
      const { _id, attendees, ...rest } = event;
      return {
        ...rest,
        id: _id.toString(),
        hasSpots: event.currentAttendees < event.maxAttendees
      };
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(totalEvents / limit);
    
    return NextResponse.json({
      events: safeEvents,
      pagination: {
        page,
        limit,
        totalEvents,
        totalPages,
        hasMore: page < totalPages
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}