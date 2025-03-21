import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import * as jose from 'jose';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    // Get JWT token from cookie
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'startupsnet-secure-jwt-secret-key-2024';
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    try {
      const { payload } = await jose.jwtVerify(token, secret);
      const { userId, userType, email } = payload;
      
      // Get updated data from request
      const updatedData = await request.json();
      
      // Fetch database connection
      const db = await connectDB();
      
      // Determine which collection to update based on userType
      const collection = userType === 'student' ? 'students' : 
                         userType === 'startup' ? 'startups' : 
                         userType === 'club' ? 'clubs' : null;
      
      if (!collection) {
        return NextResponse.json(
          { error: 'Invalid user type' },
          { status: 400 }
        );
      }
      
      // Make sure we're updating the correct user
      if (userId.toString() !== updatedData.id.toString()) {
        return NextResponse.json(
          { error: 'Unauthorized to update this profile' },
          { status: 403 }
        );
      }
      
      // Check for any fields that shouldn't be updated
      const { password, email: updatedEmail, createdAt, _id, ...cleanedData } = updatedData;
      
      // Convert string ID to ObjectId
      let objectId;
      try {
        objectId = new ObjectId(userId);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        );
      }
      
      // Special handling for club data - maintain compatibility with both data formats
      if (userType === 'club') {
        // If university is set but parentOrganization isn't, set parentOrganization from university for backward compatibility
        if (cleanedData.university && !cleanedData.parentOrganization) {
          if (cleanedData.university === 'Other' && cleanedData.otherUniversity) {
            cleanedData.parentOrganization = cleanedData.otherUniversity;
          } else {
            cleanedData.parentOrganization = cleanedData.university;
          }
        }
        
        // Or if parentOrganization is set but university isn't, try to set university for newer format
        if (cleanedData.parentOrganization && !cleanedData.university) {
          // Check if parentOrganization matches any of our university options
          const universities = [
            "MIT", "Stanford", "Harvard", "Caltech", "VIT", 
            "IIT Delhi", "IIT Bombay", "BITS Pilani", "NIT Trichy"
          ];
          
          const matchedUniversity = universities.find(uni => 
            cleanedData.parentOrganization.includes(uni));
          
          if (matchedUniversity) {
            cleanedData.university = matchedUniversity;
          } else {
            cleanedData.university = "Other";
            cleanedData.otherUniversity = cleanedData.parentOrganization;
          }
        }
      }
      
      // Update user in database
      const result = await db.collection(collection).updateOne(
        { _id: objectId },
        { $set: cleanedData }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Fetch updated user from database
      const updatedUser = await db.collection(collection).findOne(
        { _id: objectId },
        { projection: { password: 0 } } // Exclude password
      );
      
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'Failed to retrieve updated user' },
          { status: 500 }
        );
      }
      
      // Create user object without sensitive data
      const userData = {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name || updatedUser.fullName || updatedUser.companyName || updatedUser.clubName,
        type: userType,
        // Include all fields from the database
        ...updatedUser,
        // Ensure the correct type-specific fields are included
        ...(userType === 'student' && {
          university: updatedUser.university,
          college: updatedUser.college,
          major: updatedUser.major,
          graduationYear: updatedUser.graduationYear,
          degree: updatedUser.degree,
          bio: updatedUser.bio,
          skills: updatedUser.skills,
          interests: updatedUser.interests
        }),
        ...(userType === 'startup' && {
          companyName: updatedUser.companyName,
          industry: updatedUser.industry,
          stage: updatedUser.stage,
          location: updatedUser.location,
          description: updatedUser.description,
          website: updatedUser.website,
          foundingDate: updatedUser.foundingDate,
          teamSize: updatedUser.teamSize,
          hiringRoles: updatedUser.hiringRoles
        }),
        ...(userType === 'club' && {
          clubName: updatedUser.clubName,
          parentOrganization: updatedUser.parentOrganization,
          memberCount: updatedUser.memberCount,
          location: updatedUser.location,
          description: updatedUser.description,
          foundedYear: updatedUser.foundedYear,
          website: updatedUser.website,
          events: updatedUser.events,
          focusAreas: updatedUser.focusAreas
        })
      };
      
      return NextResponse.json({
        user: userData,
        message: 'Profile updated successfully'
      });
      
    } catch (error) {
      console.error('Token validation error:', error);
      
      // Delete invalid token
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
      response.cookies.delete('token');
      
      return response;
    }
    
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 