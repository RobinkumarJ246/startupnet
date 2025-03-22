import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAuthTokenFromRequest, verifyAuthToken } from '../../../lib/auth/token';
import { connectToDatabase } from '@/app/lib/db';

export async function GET(request, { params }) {
  let client;
  
  try {
    console.log('Profile API: Received request for profile ID:', params.id);
    
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
          console.log('Profile API: Authenticated user accessing profile, userId:', authenticatedUserId);
        }
      } catch (tokenError) {
        console.error('Token verification error:', tokenError);
        // Continue as unauthenticated user
      }
    }
    
    // Get profile ID from URL params - ensure it exists
    const profileId = params?.id;
    if (!profileId) {
      console.error('Profile API: Missing profile ID in params');
      return NextResponse.json(
        { message: 'Missing profile ID' },
        { status: 400 }
      );
    }
    
    console.log('Profile API: Looking up profile with ID:', profileId);
    
    // Validate profile ID
    if (!ObjectId.isValid(profileId)) {
      console.error('Profile API: Invalid ObjectId format:', profileId);
      return NextResponse.json(
        { message: 'Invalid profile ID format' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    try {
      console.log('Profile API: Connecting to database...');
      const connection = await connectToDatabase();
      client = connection.client;
      const db = client.db();
      console.log('Profile API: Database connection successful');

      // Try to find the user in all collections
      const collections = ['students', 'startups', 'clubs'];
      let profile = null;
      let userType = null;
      
      // Search through all collections for the profile
      for (const collectionName of collections) {
        console.log(`Profile API: Searching in ${collectionName} collection...`);
        try {
          const collection = db.collection(collectionName);
          const result = await collection.findOne({ 
            _id: new ObjectId(profileId) 
          });
          
          if (result) {
            profile = result;
            userType = collectionName === 'students' ? 'student' : 
                      collectionName === 'startups' ? 'startup' : 'club';
            console.log(`Profile API: Found profile in ${collectionName}, type: ${userType}`);
            break;
          }
        } catch (collectionError) {
          console.error(`Profile API: Error querying ${collectionName}:`, collectionError);
          // Continue to next collection
        }
      }
      
      // Close database connection
      if (client) {
        await client.close();
        console.log('Profile API: Closed database connection');
      }
      
      if (!profile) {
        console.log('Profile API: Profile not found for ID:', profileId);
        return NextResponse.json(
          { message: 'Profile not found' },
          { status: 404 }
        );
      }
      
      // Ensure ID is properly formatted for all users before sending
      if (profile._id) {
        profile._id = profile._id.toString();
      }
      
      // Add the user type to the profile
      profile.type = userType;
      
      // Add authentication status to the response
      profile.isAuthenticated = isAuthenticated;
      
      // Check if the user has a profile picture by doing a simple check
      // This makes it easier for the frontend to know
      const checkForProfilePic = async () => {
        try {
          // Only perform this check if the hasProfilePic field doesn't already exist
          if (profile.hasProfilePic === undefined) {
            console.log('Profile API: Checking for profile picture existence...');
            
            // Reconnect to the database for GridFS check
            const { client: imgClient, db: imgDb } = await connectToDatabase();
            
            // Create a GridFS bucket
            const { GridFSBucket } = require('mongodb');
            const bucket = new GridFSBucket(imgDb, { bucketName: 'profileImages' });
            
            // Search criteria based on user ID
            const criteria = [
              { 'metadata.userId': profile._id.toString() },
              { 'metadata.userId': new ObjectId(profile._id) },
              { filename: new RegExp(`^${profile._id}`, 'i') }
            ];
            
            // Try each criteria
            let fileExists = false;
            for (const criterion of criteria) {
              const files = await bucket.find(criterion).toArray();
              if (files.length > 0) {
                fileExists = true;
                console.log(`Profile API: Found profile picture with criteria: ${JSON.stringify(criterion)}`);
                break;
              }
            }
            
            profile.hasProfilePic = fileExists;
            console.log(`Profile API: Profile picture exists: ${fileExists}`);
          }
        } catch (imgError) {
          console.error('Error checking for profile picture:', imgError);
          // Default to true for student and club accounts, as they usually have default images
          profile.hasProfilePic = (userType === 'student' || userType === 'club');
        }
      };
      
      // Check for profile pictures
      await checkForProfilePic();
      
      // Remove password and sensitive info for all users
      delete profile.password;
      delete profile.token;
      delete profile.resetToken;
      delete profile.resetTokenExpiry;
      
      // Filter out sensitive information for non-authenticated users or when viewing other profiles
      if (!isAuthenticated || (authenticatedUserId && authenticatedUserId !== profile._id.toString())) {
        console.log('Profile API: Returning limited public profile data');
        
        // Save the important fields we want to keep in public view
        const name = userType === 'student' ? profile.fullName || profile.name : 
                    userType === 'startup' ? profile.companyName : 
                    profile.clubName;
        
        // Make sure hasProfilePic property is set for all user types
        const hasProfilePic = profile.hasProfilePic || 
                             (userType === 'student' && profile.hasProfilePic !== false) || 
                             (userType === 'club' && profile.hasProfilePic !== false) || 
                             !!profile.profileImageUrl;
      
        // Create user type-specific public profiles
        if (userType === 'student') {
          const publicProfile = {
            _id: profile._id,
            name: name,
            fullName: name,
            hasProfilePic: hasProfilePic,
            university: profile.university,
            course: profile.course,
            major: profile.major,
            graduationYear: profile.graduationYear,
            bio: profile.bio,
            skills: profile.skills,
            interests: profile.interests,
            linkedinUrl: profile.linkedinUrl,
            githubUrl: profile.githubUrl,
            country: profile.country,
            state: profile.state,
            type: userType,
            userType: userType,
            isAuthenticated: false
          };
          return NextResponse.json(publicProfile);
        } 
        else if (userType === 'startup') {
          const publicProfile = {
            _id: profile._id,
            companyName: name,
            name: name,
            hasProfilePic: hasProfilePic,
            industry: profile.industry,
            stage: profile.stage,
            location: profile.location,
            foundingYear: profile.foundingYear,
            website: profile.website,
            description: profile.description,
            focusAreas: profile.focusAreas,
            hiringRoles: profile.hiringRoles,
            linkedinUrl: profile.linkedinUrl,
            type: userType,
            userType: userType,
            isAuthenticated: false
          };
          return NextResponse.json(publicProfile);
        }
        else if (userType === 'club') {
          const publicProfile = {
            _id: profile._id,
            clubName: name,
            name: name,
            hasProfilePic: hasProfilePic,
            university: profile.university,
            parentOrganization: profile.parentOrganization,
            college: profile.college,
            foundingYear: profile.foundingYear,
            clubType: profile.clubType,
            location: profile.location,
            website: profile.socialLinks?.website,
            clubDescription: profile.clubDescription,
            description: profile.clubDescription,
            mainActivities: profile.mainActivities,
            socialLinks: profile.socialLinks,
            type: userType,
            userType: userType,
            isAuthenticated: false
          };
          return NextResponse.json(publicProfile);
        }
      }
      
      // If the user is authenticated and viewing their own profile, return full profile
      console.log('Profile API: Returning complete profile data');
      return NextResponse.json(profile);
      
    } catch (dbError) {
      console.error('Database connection/query error:', dbError);
      return NextResponse.json(
        { message: 'Database error', error: dbError.message },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error) {
    console.error('Error in profile API:', error);
    
    // Clean up database connection if it exists
    if (client) {
      await client.close().catch(err => console.error('Error closing client:', err));
    }
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoNetworkError' || 
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('connection') ||
        error.message?.includes('SSL')) {
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