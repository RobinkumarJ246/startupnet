import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getAuthTokenFromRequest, verifyAuthToken } from '../../../lib/auth/token';
import { getTokenDataFromCookies } from '@/app/lib/auth/token';
import { connectToDatabase } from '@/app/lib/db';

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
    console.log('Validate API: Standardized userType from type:', enhancedUser.type);
  } else if (!enhancedUser.type && enhancedUser.userType) {
    enhancedUser.type = enhancedUser.userType;
    console.log('Validate API: Standardized type from userType:', enhancedUser.userType);
  }
  
  // Ensure all user types have their required display name fields
  const userType = enhancedUser.type || enhancedUser.userType;
  
  if (userType === 'club' && !enhancedUser.clubName && enhancedUser.name) {
    console.log('Validate API: Fixing missing clubName field for club user');
    enhancedUser.clubName = enhancedUser.name;
  } else if (userType === 'student' && !enhancedUser.fullName && enhancedUser.name) {
    console.log('Validate API: Fixing missing fullName field for student user');
    enhancedUser.fullName = enhancedUser.name;
  } else if (userType === 'startup' && !enhancedUser.companyName && enhancedUser.name) {
    console.log('Validate API: Fixing missing companyName field for startup user');
    enhancedUser.companyName = enhancedUser.name;
  }
  
  // Add a flag for profile image
  if (userType === 'student' || userType === 'club') {
    enhancedUser.hasProfileImage = true;
  }
  
  console.log('Validate API: Enhanced user data:', {
    id: enhancedUser._id,
    type: enhancedUser.type,
    name: enhancedUser.name,
    clubName: enhancedUser.clubName,
    fullName: enhancedUser.fullName,
    companyName: enhancedUser.companyName,
    hasProfileImage: enhancedUser.hasProfileImage
  });
  
  return enhancedUser;
}

export async function GET(request) {
  try {
    console.log('Received validation request');
    
    // First try to get token from request headers or cookies
    let token = getAuthTokenFromRequest(request);
    let tokenData;
    
    if (token) {
      try {
        // Verify the token from the request
        const verifyResult = await verifyAuthToken(token);
        if (verifyResult && verifyResult.valid) {
          tokenData = verifyResult.data;
          console.log('Token verified from request:', tokenData?._id);
        } else {
          console.log('Invalid token from request');
        }
      } catch (verifyError) {
        console.error('Error verifying token from request:', verifyError);
      }
    }
    
    // If no valid token from request, try from cookies (fallback)
    if (!tokenData) {
      try {
        tokenData = getTokenDataFromCookies();
        if (tokenData) {
          console.log('Retrieved token data from cookies:', tokenData?._id);
        } else {
          console.log('No token data in cookies');
        }
      } catch (cookieError) {
        console.error('Error getting token from cookies:', cookieError);
      }
    }
    
    // If still no token, user is not authenticated
    if (!tokenData) {
      console.log('No valid token found in request or cookies');
      return NextResponse.json(
        { error: 'No valid token found' },
        { status: 401 }
      );
    }
    
    // Ensure _id is properly formatted
    if (tokenData._id && typeof tokenData._id === 'string' && ObjectId.isValid(tokenData._id)) {
      try {
        tokenData._id = new ObjectId(tokenData._id);
      } catch (err) {
        console.warn('Could not convert string ID to ObjectId:', err.message);
      }
    }
    
    // Connect to MongoDB
    let client;
    try {
      console.log('Connecting to database...');
      ({ client } = await connectToDatabase());
      console.log('Connected to database successfully');
    } catch (dbError) {
      console.error('Database connection failed during validation:', dbError);
      
      // Enhance token data before returning
      const enhancedTokenData = addMissingFields(tokenData);
      
      // Return a special status to indicate database connection error
      // but still return the tokenData so client can use it for offline mode
      return NextResponse.json(
        { 
          message: 'Database connection error', 
          connectionError: true,
          user: enhancedTokenData
        }, 
        { status: 200 }
      );
    }
    
    // We successfully connected to the database, now get more user info
    try {
      const db = client.db();
      const userType = tokenData.userType || tokenData.type;
      
      const collection = userType === 'student' ? 'students' : 
        userType === 'startup' ? 'startups' : 
        userType === 'club' ? 'clubs' : null;
      
      if (!collection) {
        console.error('Invalid user type in token:', userType);
        await client.close();
        
        // Enhance token data before returning
        const enhancedTokenData = addMissingFields(tokenData);
        
        return NextResponse.json(
          { 
            error: 'Invalid user type',
            user: enhancedTokenData  
          },
          { status: 200 }  // Return 200 to allow fallback to token data
        );
      }
      
      console.log(`Looking for user in ${collection} collection with ID:`, tokenData._id);
      const user = await db.collection(collection).findOne({ _id: tokenData._id });
      
      await client.close();
      
      if (!user) {
        console.log('User not found in database');
        
        // Enhance token data before returning
        const enhancedTokenData = addMissingFields(tokenData);
        
        return NextResponse.json(
          { 
            error: 'User not found', 
            user: enhancedTokenData 
          },
          { status: 200 }  // Return 200 to allow fallback to token data
        );
      }
      
      // Enhance user data with missing fields
      const enhancedUser = addMissingFields(user);
      
      console.log('User validation successful', enhancedUser._id);
      return NextResponse.json({ user: enhancedUser }, { status: 200 });
    } catch (error) {
      console.error('Error fetching user data during validation:', error);
      
      // Close the database connection if it exists
      if (client) {
        await client.close();
      }
      
      // Enhance token data before returning
      const enhancedTokenData = addMissingFields(tokenData);
      
      // Return a special status to indicate database error during user fetch
      // but still return the tokenData so client can use it for offline mode
      return NextResponse.json(
        { 
          message: 'Database error during user fetch', 
          connectionError: true,
          user: enhancedTokenData
        }, 
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error during validation:', error);
    return NextResponse.json(
      { error: 'Validation failed: ' + error.message },
      { status: 500 }
    );
  }
} 