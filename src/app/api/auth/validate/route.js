import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getAuthTokenFromRequest, verifyToken } from '../../../lib/auth/token';

export async function GET(request) {
  try {
    console.log('Auth validation endpoint called');
    
    // Get token from cookies
    const token = await getAuthTokenFromRequest(request);
    
    if (!token) {
      console.log('No auth token found in cookies');
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    
    // Verify token
    let payload;
    try {
      payload = await verifyToken(token);
      console.log('Token verified successfully');
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
    
    // Token is valid, get user data from database
    const { userId, userType } = payload;
    console.log(`Looking up user: ${userId} of type: ${userType}`);
    
    if (!userId || !userType) {
      console.error('Missing userId or userType in token');
      return NextResponse.json({ success: false, error: 'Invalid token data' }, { status: 401 });
    }
    
    // Connect to database
    const { db } = await connectDB();
    
    // Determine collection based on user type
    let collection;
    switch (userType) {
      case 'student':
        collection = db.collection('students');
        break;
      case 'startup':
        collection = db.collection('startups');
        break;
      case 'club':
        collection = db.collection('clubs');
        break;
      default:
        console.error(`Invalid user type: ${userType}`);
        return NextResponse.json({ success: false, error: 'Invalid user type' }, { status: 400 });
    }
    
    // Find user in database
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      console.error(`User not found: ${userId}`);
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    
    // Remove sensitive data
    delete user.password;
    
    // Add userType to the user object for frontend use
    user.userType = userType;
    
    console.log('Session validated successfully');
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
} 