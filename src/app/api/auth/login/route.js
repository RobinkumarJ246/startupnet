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
    // Add timeout handling with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 second timeout (just under Vercel's 10s limit)

    const body = await request.json();
    const { email, password, userType } = body;
    
    console.log(`Login attempt for ${email} as ${userType}`);
    
    if (!email || !password || !userType) {
      clearTimeout(timeoutId);
      return NextResponse.json({ 
        success: false, 
        error: 'Email, password, and user type are required' 
      }, { status: 400 });
    }
    
    // Connect to the MongoDB database with timeout
    let db;
    let connection;
    try {
      // Set up a promise race between connection and timeout
      const connectionPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 5000);
      });
      
      connection = await Promise.race([connectionPromise, timeoutPromise]);
      db = connection.db;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      clearTimeout(timeoutId);
      
      // Return a more useful error for debugging
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed',
        message: dbError.message,
        timeout: dbError.message.includes('timeout')
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
        clearTimeout(timeoutId);
        if (connection?.client) {
          await connection.client.close().catch(err => console.error('Error closing connection:', err));
        }
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid user type' 
        }, { status: 400 });
    }
    
    // Find user by email with timeout
    let user;
    try {
      // Set a time limit on the MongoDB operation
      const findOptions = { maxTimeMS: 3000 }; // 3 second timeout on the query itself
      
      if (userType === 'club') {
        console.log('Looking up club user by email:', email);
      }
      
      user = await collection.findOne({ email }, findOptions);
      
      if (userType === 'club' && user) {
        console.log('Club user found in database. Raw data:', {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          clubName: user.clubName,
          fullName: user.fullName,
          allFields: Object.keys(user)
        });
      }
      
      console.log(user ? 'User found' : 'User not found');
    } catch (findError) {
      console.error('Error finding user:', findError);
      clearTimeout(timeoutId);
      if (connection?.client) {
        await connection.client.close().catch(err => console.error('Error closing connection:', err));
      }
      
      // Check if this was a timeout error
      const isTimeout = findError.message.includes('timed out') || 
                        findError.name === 'MongoTimeoutError' ||
                        findError.message.includes('operation exceeded time limit');
      
      return NextResponse.json({ 
        success: false, 
        error: 'Error finding user',
        message: findError.message,
        timeout: isTimeout
      }, { status: isTimeout ? 504 : 500 });
    }
    
    if (!user) {
      clearTimeout(timeoutId);
      if (connection?.client) {
        await connection.client.close().catch(err => console.error('Error closing connection:', err));
      }
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
      clearTimeout(timeoutId);
      if (connection?.client) {
        await connection.client.close().catch(err => console.error('Error closing connection:', err));
      }
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
    
    // Clear timeout and close DB connection
    clearTimeout(timeoutId);
    if (connection?.client) {
      await connection.client.close().catch(err => console.error('Error closing connection:', err));
    }
    
    console.log('Login successful, returning response with auth cookie');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    
    // Check if this is an AbortController timeout
    if (error.name === 'AbortError') {
      return NextResponse.json({ 
        success: false, 
        error: 'Login request timed out', 
        timeout: true
      }, { status: 504 });
    }
    
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
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 