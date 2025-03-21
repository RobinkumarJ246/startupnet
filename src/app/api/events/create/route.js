import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    // Parse the request body
    const eventData = await req.json();
    
    // Extract event type
    const { type } = eventData;
    
    // Validate event type
    const validEventTypes = ['hackathon', 'culturals', 'expert-lecture', 'workshop', 'conference'];
    
    if (!type || !validEventTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid or missing event type. Must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate required fields (common across all event types)
    const commonRequiredFields = ['title', 'description', 'startDate', 'startTime', 'organizerId', 'organizerType'];
    
    for (const field of commonRequiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate fields specific to each event type
    const typeSpecificValidation = {
      hackathon: () => {
        const requiredFields = ['problemStatement', 'prizes', 'teamSize', 'submissionRequirements'];
        for (const field of requiredFields) {
          if (!eventData[field]) {
            return `Missing required field for hackathon: ${field}`;
          }
        }
        return null;
      },
      culturals: () => {
        const requiredFields = ['performanceType', 'participationRequirements'];
        for (const field of requiredFields) {
          if (!eventData[field]) {
            return `Missing required field for culturals: ${field}`;
          }
        }
        return null;
      },
      'expert-lecture': () => {
        const requiredFields = ['speakerName', 'speakerCredentials', 'topics'];
        for (const field of requiredFields) {
          if (!eventData[field]) {
            return `Missing required field for expert lecture: ${field}`;
          }
        }
        return null;
      },
      workshop: () => {
        const requiredFields = ['learningObjectives', 'prerequisites', 'materials'];
        for (const field of requiredFields) {
          if (!eventData[field]) {
            return `Missing required field for workshop: ${field}`;
          }
        }
        return null;
      },
      conference: () => {
        const requiredFields = ['agenda', 'speakers'];
        for (const field of requiredFields) {
          if (!eventData[field]) {
            return `Missing required field for conference: ${field}`;
          }
        }
        return null;
      }
    };
    
    // Perform type-specific validation
    const validationError = typeSpecificValidation[type]();
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    // Mode-specific validation
    if (eventData.mode === 'in-person' && !eventData.location) {
      return NextResponse.json(
        { error: 'Location is required for in-person events' },
        { status: 400 }
      );
    }
    
    if (eventData.mode === 'virtual' && !eventData.virtualLink) {
      return NextResponse.json(
        { error: 'Virtual link is required for virtual events' },
        { status: 400 }
      );
    }
    
    // Price validation
    if (!eventData.isFree && !eventData.price) {
      return NextResponse.json(
        { error: 'Price is required for paid events' },
        { status: 400 }
      );
    }
    
    // Create a new event with ID and timestamps
    const newEvent = {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
      attendees: [],
      status: 'active'
    };
    
    // Connect to database and save to appropriate collection based on event type
    const { db } = await connectToDatabase();
    const result = await db.collection(type).insertOne(newEvent);
    
    return NextResponse.json(
      { 
        message: 'Event created successfully', 
        event: {
          ...newEvent,
          _id: result.insertedId
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// Get event types and their required fields (for front-end form generation)
export async function GET() {
  try {
    const eventTypes = [
      {
        id: 'hackathon',
        label: 'Hackathon',
        description: 'A competitive event where participants collaborate to build innovative solutions',
        requiredFields: ['problemStatement', 'prizes', 'teamSize', 'submissionRequirements'],
        recommendedFor: ['club', 'startup']
      },
      {
        id: 'culturals',
        label: 'Cultural Event',
        description: 'Events showcasing art, music, dance, and cultural performances',
        requiredFields: ['performanceType', 'participationRequirements'],
        recommendedFor: ['club']
      },
      {
        id: 'expert-lecture',
        label: 'Expert Lecture',
        description: 'Educational sessions by industry experts and thought leaders',
        requiredFields: ['speakerName', 'speakerCredentials', 'topics'],
        recommendedFor: ['club', 'startup']
      },
      {
        id: 'workshop',
        label: 'Workshop',
        description: 'Hands-on training sessions to develop specific skills',
        requiredFields: ['learningObjectives', 'prerequisites', 'materials'],
        recommendedFor: ['club', 'startup']
      },
      {
        id: 'conference',
        label: 'Conference',
        description: 'Multi-session events with presentations, discussions, and networking',
        requiredFields: ['agenda', 'speakers'],
        recommendedFor: ['club', 'startup']
      }
    ];
    
    return NextResponse.json({ eventTypes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    );
  }
} 