import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setAuthCookie } from '../../../lib/auth/token';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;
    
    if (!email || !password || !userType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email, password, and user type are required' 
      }, { status: 400 });
    }
    
    // Connect to the MongoDB database
    const { db } = await connectDB();
    
    // Determine which collection to query based on userType
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
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid user type' 
        }, { status: 400 });
    }
    
    // Find user by email
    const user = await collection.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid password' 
      }, { status: 401 });
    }
    
    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'startupsnet-secure-jwt-secret-key-2024';
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // Token expires in 7 days
    const token = await new jose.SignJWT({
      userId: user._id.toString(),
      userType,
      email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);
    
    // Create a sanitized user object without sensitive fields
    const userData = {
      _id: user._id.toString(),
      email: user.email,
      userType,
      name: user.fullName || user.companyName || user.clubName,
      // Add other user fields as needed
    };
    
    // Create the response
    const response = NextResponse.json({
      success: true,
      user: userData
    });
    
    // Set the auth cookie with proper settings for dev/prod environments
    setAuthCookie(response, token);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error', 
      message: error.message 
    }, { status: 500 });
  }
} 