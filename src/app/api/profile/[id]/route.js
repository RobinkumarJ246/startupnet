import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getAuthTokenFromRequest, verifyAuthToken } from '../../../lib/auth/token';

export async function GET(request, { params }) {
  try {
    // Check if the user is authenticated
    let isAuthenticated = false;
    let authenticatedUserId = null;
    
    // Get the auth token if present
    let authToken = null;
    try {
      authToken = await getAuthTokenFromRequest(request);
    } catch (cookieError) {
      console.error('Error accessing cookies:', cookieError);
      // Continue as unauthenticated if cookies can't be accessed
    }
    
    if (authToken) {
      try {
        // Verify the token
        const decodedToken = await verifyAuthToken(authToken);
        if (decodedToken && decodedToken.userId) {
          isAuthenticated = true;
          authenticatedUserId = decodedToken.userId;
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        // Continue as unauthenticated user
      }
    }
    
    // Get profile ID from URL params
    const profileId = params.id;
    
    // Validate profile ID
    if (!profileId || !ObjectId.isValid(profileId)) {
      return NextResponse.json(
        { message: 'Invalid profile ID' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    let db;
    try {
      db = await connectDB();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { message: 'Database connection error', error: dbError.message },
        { status: 503 } // Service Unavailable
      );
    }
    
    // Try to find the user in all collections
    const collections = ['students', 'startups', 'clubs'];
    let profile = null;
    let userType = null;
    
    try {
      for (const collection of collections) {
        const result = await db.collection(collection).findOne(
          { _id: new ObjectId(profileId) }
        );
        
        if (result) {
          profile = result;
          userType = collection === 'students' ? 'student' : 
                    collection === 'startups' ? 'startup' : 'club';
          break;
        }
      }
    } catch (queryError) {
      console.error('Database query error:', queryError);
      return NextResponse.json(
        { message: 'Error querying database', error: queryError.message },
        { status: 500 }
      );
    }
    
    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Add the user type to the profile
    profile.type = userType;
    
    // Add authentication status to the response
    profile.isAuthenticated = isAuthenticated;
    
    // Filter out sensitive information for non-authenticated users
    if (!isAuthenticated) {
      // Save the important fields we want to keep in public view
      const name = userType === 'student' ? profile.name : 
                  userType === 'startup' ? profile.companyName : 
                  profile.clubName;
      const profileImageUrl = profile.profileImageUrl;
      const bioOrDescription = profile.bio || profile.description;
      
      // Remove common sensitive fields
      delete profile.password;
      delete profile.token;
      delete profile.resetToken;
      delete profile.resetTokenExpiry;
      
      // Filter out user type-specific sensitive data
      if (userType === 'student') {
        const publicProfile = {
          _id: profile._id,
          name: name,
          profileImageUrl: profileImageUrl,
          university: profile.university,
          major: profile.major,
          graduationYear: profile.graduationYear,
          bio: bioOrDescription,
          skills: profile.skills,
          interests: profile.interests,
          type: userType,
          isAuthenticated: false
        };
        return NextResponse.json(publicProfile);
      } 
      else if (userType === 'startup') {
        const publicProfile = {
          _id: profile._id,
          companyName: name,
          profileImageUrl: profileImageUrl,
          industry: profile.industry,
          stage: profile.stage,
          location: profile.location,
          foundingDate: profile.foundingDate,
          website: profile.website,
          description: bioOrDescription,
          focusAreas: profile.focusAreas,
          type: userType,
          isAuthenticated: false
        };
        return NextResponse.json(publicProfile);
      }
      else if (userType === 'club') {
        const publicProfile = {
          _id: profile._id,
          clubName: name,
          profileImageUrl: profileImageUrl,
          university: profile.university,
          college: profile.college,
          foundedYear: profile.foundedYear,
          website: profile.website,
          description: bioOrDescription,
          focusAreas: profile.focusAreas,
          activities: profile.activities,
          type: userType,
          isAuthenticated: false
        };
        return NextResponse.json(publicProfile);
      }
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoNetworkError' || 
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('connection') ||
        error.message.includes('SSL')) {
      return NextResponse.json(
        { message: 'Database connection error', error: error.message },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 