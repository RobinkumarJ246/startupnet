import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get event type from query parameter
    const type = searchParams.get('type') || 'all';
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;
    
    // Sorting parameters
    const sort = searchParams.get('sort') || 'startDate';
    const order = searchParams.get('order') === 'desc' ? -1 : 1;
    
    // Search parameter
    const search = searchParams.get('search') || '';
    
    // Validate event type
    const validEventTypes = ['hackathon', 'culturals', 'expertLecture', 'workshop', 'conference', 'all'];
    
    if (!validEventTypes.includes(type)) {
      return NextResponse.json(
        { message: 'Invalid event type' },
        { status: 400 }
      );
    }
    
    const db = await connectDB();
    
    // Prepare filter
    const filter = { status: 'active' };
    
    // Add type filter if not 'all'
    if (type !== 'all') {
      filter.eventType = type;
    }
    
    // Add search filter if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Get total count for pagination
    const total = await db.collection('events').countDocuments(filter);
    
    // Prepare sort object
    const sortObj = {};
    sortObj[sort] = order;
    
    // Fetch events
    const events = await db.collection('events')
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Prepare pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events', error: error.message },
      { status: 500 }
    );
  }
} 