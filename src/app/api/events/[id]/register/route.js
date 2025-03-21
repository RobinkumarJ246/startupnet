import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = params;
  
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid event ID' }, { status: 400 });
    }
    
    const db = await connectDB();
    
    // Find the event
    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    
    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }
    
    // Check if event is full
    if (event.attendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json({ message: 'Event is full' }, { status: 400 });
    }
    
    // Check if user is already registered
    if (event.attendees && event.attendees.some(attendee => attendee.userId === userId)) {
      return NextResponse.json({ message: 'User already registered for this event' }, { status: 400 });
    }
    
    // Register user for the event
    const updateResult = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { 
          attendees: { 
            userId, 
            registeredAt: new Date(),
            status: 'confirmed' 
          } 
        } 
      }
    );
    
    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ message: 'Failed to register for event' }, { status: 500 });
    }
    
    // Get updated event
    const updatedEvent = await db.collection('events').findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { message: 'Failed to register for event', error: error.message },
      { status: 500 }
    );
  }
} 