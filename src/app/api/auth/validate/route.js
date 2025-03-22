import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAuthTokenFromRequest, verifyAuthToken } from '../../../lib/auth/token';
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
  
  // Add a flag for profile picture
  if (!enhancedUser.hasProfilePic) {
    // For students, clubs, and startups, assume they all can have profile pictures
    enhancedUser.hasProfilePic = true;
  }
  
  console.log('Validate API: Enhanced user data:', {
    id: enhancedUser._id,
    type: enhancedUser.type,
    name: enhancedUser.name,
    clubName: enhancedUser.clubName,
    fullName: enhancedUser.fullName,
    companyName: enhancedUser.companyName,
    hasProfilePic: enhancedUser.hasProfilePic
  });
  
  return enhancedUser;
}

export async function GET(request) {
  try {
    console.log('Received validation request');
    
    // First try to get token from request headers or cookies
    const token = await getAuthTokenFromRequest(request);
    
    // If no token found, check if there's user data in the request body
    // This allows client to pass user data from localStorage
    let userData = null;
    let userFoundInDb = false;
    
    if (!token) {
      console.log('No token found in request, checking for user data in cookies/localStorage');
      try {
        // Try to extract user data from request
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const userType = url.searchParams.get('userType');
        
        if (userId && userType) {
          console.log(`Found user info in request: ${userId} (${userType})`);
          userData = { _id: userId, type: userType };
        } else {
          console.log('No user data found in request');
          return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
          );
        }
      } catch (extractError) {
        console.error('Error extracting user data from request:', extractError);
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }
    } else {
      // Token found, try to verify it
      try {
        userData = await verifyAuthToken(token);
        if (userData) {
          console.log('Token verified successfully, user ID:', userData.userId || userData._id);
        }
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError.message);
        
        // Extract userId and userType from request for fallback
        try {
          const url = new URL(request.url);
          const userId = url.searchParams.get('userId');
          const userType = url.searchParams.get('userType');
          
          if (userId && userType) {
            console.log(`Using fallback user info from request: ${userId} (${userType})`);
            userData = { _id: userId, type: userType };
          } else {
            console.log('No fallback user data found in request');
            return NextResponse.json(
              { error: 'Invalid authentication token' },
              { status: 401 }
            );
          }
        } catch (extractError) {
          console.error('Error extracting fallback user data:', extractError);
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
          );
        }
      }
    }
    
    // Ensure userId is correctly identified regardless of where it's stored in the object
    const userId = userData.userId || userData._id || userData.id;
    const userType = userData.userType || userData.type;
    
    if (!userId) {
      console.error('No user ID found in auth data');
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 401 }
      );
    }
    
    console.log(`Validating user: ${userId} (${userType || 'unknown type'})`);
    
    // Connect to MongoDB to get full user data
    let client = null;
    try {
      const { client: dbClient, db } = await connectToDatabase();
      client = dbClient;
      
      let collection;
      if (userType === 'student') {
        collection = 'students';
      } else if (userType === 'startup') {
        collection = 'startups';
      } else if (userType === 'club') {
        collection = 'clubs';
      } else {
        console.error('Invalid user type:', userType);
        // Try all collections as a fallback
        collection = null;
      }
      
      let user = null;
      
      // Convert ID to ObjectId if possible
      let queryId;
      try {
        if (ObjectId.isValid(userId)) {
          queryId = new ObjectId(userId);
        } else {
          queryId = userId;
        }
      } catch (idError) {
        console.error('Error converting ID to ObjectId:', idError);
        queryId = userId;
      }
      
      // Try to find user in specified collection first
      if (collection) {
        console.log(`Looking for user in ${collection} collection with ID:`, queryId);
        user = await db.collection(collection).findOne({ _id: queryId });
        
        if (user) {
          console.log(`User found in ${collection} collection`);
          userFoundInDb = true;
        }
      }
      
      // If user not found and no specific collection was specified, try all collections
      if (!user) {
        const collections = ['students', 'startups', 'clubs'];
        console.log('User not found in specific collection, trying all collections');
        
        for (const coll of collections) {
          if (coll === collection) continue; // Skip if we already checked this collection
          
          console.log(`Looking for user in ${coll} collection with ID:`, queryId);
          user = await db.collection(coll).findOne({ _id: queryId });
          
          if (user) {
            console.log(`User found in ${coll} collection`);
            // Update the user type if needed
            if (coll === 'students') user.type = user.type || 'student';
            if (coll === 'startups') user.type = user.type || 'startup';
            if (coll === 'clubs') user.type = user.type || 'club';
            userFoundInDb = true;
            break;
          }
        }
      }
      
      // If user not found in database, return basic user data from auth
      if (!user) {
        console.log('User not found in database, returning basic user data');
        const enhancedUserData = addMissingFields(userData);
        
        return NextResponse.json(
          { 
            message: 'User not found in database', 
            user: enhancedUserData,
            dbUser: false
          }, 
          { status: 200 }  // Return 200 to allow client to function
        );
      }
      
      // User found in database, return full user data
      const enhancedUser = addMissingFields(user);
      console.log('User validation successful', enhancedUser._id);
      
      return NextResponse.json(
        { 
          user: enhancedUser,
          dbUser: true
        }, 
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error during validation:', dbError);
      
      // Return basic user data from auth token/request
      const enhancedUserData = addMissingFields(userData);
      
      return NextResponse.json(
        { 
          message: 'Database error, using basic user data', 
          user: enhancedUserData,
          dbUser: false,
          dbError: true
        }, 
        { status: 200 }  // Return 200 to allow client to function
      );
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error) {
    console.error('Error during validation:', error);
    return NextResponse.json(
      { error: 'Validation failed: ' + error.message },
      { status: 500 }
    );
  }
} 