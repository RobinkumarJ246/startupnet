import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'startDate', 'endDate', 
      'organizer', 'organizerType', 'type'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Add metadata
    data.createdAt = new Date().toISOString();
    data.updatedAt = new Date().toISOString();
    data.status = 'pending';
    
    // Insert the event into the database
    const result = await db.collection('events').insertOne(data);
    
    return NextResponse.json({ 
      success: true, 
      eventId: result.insertedId,
      message: 'Hackathon event created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating hackathon event:', error);
    return NextResponse.json(
      { error: 'Failed to create hackathon event' },
      { status: 500 }
    );
  }
} 