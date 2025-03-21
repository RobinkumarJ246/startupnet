import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    const { eventType } = data;
    
    // Validate event type
    const validEventTypes = ['hackathon', 'culturals', 'expertLecture', 'workshop', 'conference'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { message: `Invalid event type: ${eventType}` },
        { status: 400 }
      );
    }
    
    // Connect to database
    const db = await connectDB();
    
    // Prepare the event data with common fields
    const eventData = {
      title: data.title,
      description: data.description,
      eventType: eventType,
      eventMode: data.eventMode,
      startDate: data.startDate,
      endDate: data.endDate || null,
      startTime: data.startTime,
      endTime: data.endTime || null,
      isRecurring: data.isRecurring || false,
      recurringPattern: data.isRecurring ? data.recurringPattern : null,
      recurringUntil: data.isRecurring ? data.recurringUntil : null,
      
      // Location fields
      venue: data.venue || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      country: data.country || null,
      zipCode: data.zipCode || null,
      directions: data.directions || null,
      virtualLink: data.virtualLink || null,
      platformInfo: data.platformInfo || null,
      
      // Registration details
      maxAttendees: parseInt(data.maxAttendees, 10) || 0,
      isFree: data.isFree || false,
      price: data.isFree ? 0 : parseFloat(data.price) || 0,
      hasEarlyBird: !data.isFree && data.hasEarlyBird || false,
      earlyBirdPrice: !data.isFree && data.hasEarlyBird ? parseFloat(data.earlyBirdPrice) || 0 : null,
      earlyBirdEndDate: !data.isFree && data.hasEarlyBird ? data.earlyBirdEndDate : null,
      registrationDeadline: data.registrationDeadline || null,
      
      // Other common fields
      imageUrl: data.imageUrl || null,
      tags: data.tags || [],
      organizerId: data.organizerId || null,
      organizerName: data.organizerName || null,
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      attendees: [],
      status: 'active'
    };
    
    // Add type-specific fields based on the event type
    switch (eventType) {
      case 'hackathon':
        Object.assign(eventData, {
          theme: data.theme,
          otherTheme: data.theme === 'other' ? data.otherTheme : null,
          problemStatement: data.problemStatement,
          technicalRequirements: data.technicalRequirements,
          prizes: data.prizes,
          judgingCriteria: data.judgingCriteria,
          mentors: data.mentors || null,
          resources: data.resources || null
        });
        break;
        
      case 'culturals':
        Object.assign(eventData, {
          performanceType: data.performanceType,
          otherPerformanceType: data.performanceType === 'other' ? data.otherPerformanceType : null,
          participationRequirements: data.participationRequirements,
          judgesInfo: data.judgesInfo || null,
          prizes: data.prizes || null,
          equipmentProvided: data.equipmentProvided || null
        });
        break;
        
      case 'expertLecture':
        Object.assign(eventData, {
          speakerName: data.speakerName,
          speakerCredentials: data.speakerCredentials,
          topicsCovered: data.topicsCovered,
          speakerBio: data.speakerBio || null,
          speakerImageUrl: data.speakerImageUrl || null,
          targetAudience: data.targetAudience || null,
          presentationFormat: data.presentationFormat || null
        });
        break;
        
      case 'workshop':
        Object.assign(eventData, {
          learningObjectives: data.learningObjectives,
          prerequisites: data.prerequisites,
          materials: data.materials,
          instructorName: data.instructorName || null,
          instructorCredentials: data.instructorCredentials || null,
          workshopStructure: data.workshopStructure || null,
          softwareRequirements: data.softwareRequirements || null
        });
        break;
        
      case 'conference':
        Object.assign(eventData, {
          agenda: data.agenda,
          speakers: data.speakers || [],
          conferenceThemes: data.conferenceThemes || null,
          partners: data.partners || null,
          specialActivities: data.specialActivities || null
        });
        break;
    }
    
    // Insert event data into the events collection
    const result = await db.collection('events').insertOne(eventData);
    
    return NextResponse.json({
      message: 'Event created successfully',
      eventId: result.insertedId
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
} 