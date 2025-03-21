import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { password, confirmText } = await request.json();
    
    // Validate input
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }
    
    if (confirmText !== 'DELETE') {
      return NextResponse.json({ error: 'Please type DELETE to confirm account deletion' }, { status: 400 });
    }
    
    // Get token from cookies - using async approach
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload;
    
    try {
      const { payload: verifiedPayload } = await jose.jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const { userId, userType } = payload;
    
    if (!userId || !userType) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    
    // Connect to DB
    const db = await connectDB();
    if (!db) {
      console.error('Failed to connect to database');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    // Determine collection based on userType
    let collection;
    if (userType === 'student') {
      collection = db.collection('students');
    } else if (userType === 'startup') {
      collection = db.collection('startups');
    } else if (userType === 'club') {
      collection = db.collection('clubs');
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }
    
    if (!collection) {
      console.error('Collection not found:', userType);
      return NextResponse.json({ error: 'Collection not found' }, { status: 500 });
    }
    
    // Find user
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 401 });
    }
    
    // Delete user
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(userId) });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
    
    // Clear authentication cookie
    const response = NextResponse.json({ 
      message: 'Account deleted successfully',
      success: true
    });
    
    // Set cookie to expire in the past to delete it
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 