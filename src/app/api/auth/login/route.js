import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import bcryptjs from 'bcryptjs';
import * as jose from 'jose';
import { setAuthCookie } from '../../../lib/auth/token';

/**
 * Helper function to ensure all required fields are present based on user type
 */
function addMissingFields(userData) {
  if (!userData) return userData;

  // Make a copy to avoid modifying the original object
  const enhancedUser = { ...userData };
  
  // If we have a plain object from MongoDB, convert _id to string if needed
  if (enhancedUser._id && typeof enhancedUser._id !== 'string' && enhancedUser._id.toString) {
    enhancedUser._id = enhancedUser._id.toString();
  }
  
  // Standardize user type fields
  if (!enhancedUser.userType && enhancedUser.type) {
    enhancedUser.userType = enhancedUser.type;
  } else if (!enhancedUser.type && enhancedUser.userType) {
    enhancedUser.type = enhancedUser.userType;
  }
  
  // Ensure all user types have their required display name fields
  const userType = enhancedUser.type || enhancedUser.userType;
  
  if (userType === 'club' && !enhancedUser.clubName && enhancedUser.name) {
    console.log('Login API: Fixing missing clubName field for club user');
    enhancedUser.clubName = enhancedUser.name;
  } else if (userType === 'student' && !enhancedUser.fullName && enhancedUser.name) {
    console.log('Login API: Fixing missing fullName field for student user');
    enhancedUser.fullName = enhancedUser.name;
  } else if (userType === 'startup' && !enhancedUser.companyName && enhancedUser.name) {
    console.log('Login API: Fixing missing companyName field for startup user');
    enhancedUser.companyName = enhancedUser.name;
  }
  
  console.log('Login API: Enhanced user data:', {
    id: enhancedUser._id,
    type: enhancedUser.type,
    name: enhancedUser.name,
    clubName: enhancedUser.clubName,
    fullName: enhancedUser.fullName,
    companyName: enhancedUser.companyName
  });
  
  return enhancedUser;
}

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
      // Add debug logging for club users
      if (userType === 'club') {
        console.log('Looking up club user by email:', email);
      }
      
      user = await collection.findOne({ email });
      
      // For club users, log all fields to debug what data is coming from MongoDB
      if (userType === 'club' && user) {
        console.log('Club user found in database. Raw data:', {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          clubName: user.clubName,
          fullName: user.fullName,
          // Log all fields for debugging
          allFields: Object.keys(user)
        });
      }
      
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
      type: userType,
      userType: userType
    };
    
    // Copy all fields from the original user object, except password
    Object.keys(user).forEach(key => {
      if (key !== 'password' && key !== '_id' && key !== 'email' && key !== 'type' && key !== 'userType') {
        userData[key] = user[key];
      }
    });
    
    // Important debug info
    console.log('Login API - Original user data from DB:', {
      id: user._id.toString(),
      type: userType,
      name: user.name,
      clubName: user.clubName,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email
    });
    
    // Ensure all required fields are present based on user type
    const enhancedUser = addMissingFields(userData);
    
    // Create the response
    const response = NextResponse.json({
      success: true,
      user: enhancedUser
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