import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import bcryptjs from 'bcryptjs';
import * as jose from 'jose';
import { setAuthCookie } from '../../../lib/auth/token';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;
    
    console.log(`Login attempt for ${email} as ${userType}`);
    
    if (!email || !password || !userType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email, password, and user type are required' 
      }, { status: 400 });
    }
    
    // Connect to the MongoDB database
    let db;
    try {
      const connection = await connectDB();
      db = connection.db;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed',
        message: dbError.message
      }, { status: 500 });
    }
    
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
    let user;
    try {
      user = await collection.findOne({ email });
      console.log(user ? 'User found' : 'User not found');
    } catch (findError) {
      console.error('Error finding user:', findError);
      return NextResponse.json({ 
        success: false, 
        error: 'Error finding user',
        message: findError.message
      }, { status: 500 });
    }
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }
    
    // Compare password with multiple fallbacks
    let passwordMatch = false;
    try {
      // Try bcryptjs compare
      passwordMatch = await bcryptjs.compare(password, user.password);
      console.log('Password validation result:', passwordMatch);
    } catch (bcryptError) {
      console.error('bcryptjs.compare error:', bcryptError);
      
      // Fallback 1: Try direct string comparison if in development (for testing accounts)
      if (process.env.NODE_ENV !== 'production' && password === user.password) {
        console.log('Using fallback password validation (direct comparison)');
        passwordMatch = true;
      } else {
        // Fallback 2: Try manual bcrypt comparison if the hash has the right format
        try {
          if (user.password.startsWith('$2')) {
            // This is a bcrypt hash - try manual comparison
            console.log('Attempting manual bcrypt hash comparison');
            
            // Use synchronous version which might be more reliable in serverless environment
            passwordMatch = bcryptjs.compareSync(password, user.password);
            console.log('Manual bcrypt comparison result:', passwordMatch);
          }
        } catch (fallbackError) {
          console.error('Fallback password validation error:', fallbackError);
        }
      }
    }
    
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
    
    console.log('Login successful, returning response with auth cookie');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    
    // Log more details about the error
    if (error.name === 'MongoServerError') {
      console.error('MongoDB server error details:', {
        code: error.code,
        codeName: error.codeName,
        errmsg: error.errmsg
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Server error', 
      message: error.message,
      errorType: error.name
    }, { status: 500 });
  }
} 