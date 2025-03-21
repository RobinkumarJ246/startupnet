import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import * as jose from 'jose';
import { ObjectId } from 'mongodb';

export async function GET(request) {
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
      
      // Fetch user from database to get latest data
      const db = await connectDB();
      
      // Determine which collection to query based on userType
      const collection = userType === 'student' ? 'students' : 
                         userType === 'startup' ? 'startups' : 
                         userType === 'club' ? 'clubs' : null;
      
      if (!collection) {
        return NextResponse.json(
          { error: 'Invalid user type' },
          { status: 400 }
        );
      }
      
      // Convert userId to ObjectId
      let objectId;
      try {
        objectId = new ObjectId(userId);
      } catch (error) {
        console.error('Invalid ObjectId format:', error);
        return NextResponse.json(
          { error: 'Invalid user ID format' },
          { status: 400 }
        );
      }
      
      // Find user in database
      const user = await db.collection(collection).findOne(
        { _id: objectId },
        { projection: { password: 0 } } // Exclude password
      );
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Create user object without sensitive data
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name || user.fullName || user.companyName || user.clubName,
        type: userType,
        // Add type-specific fields
        ...(userType === 'student' && {
          university: user.university,
          college: user.college,
          major: user.major,
          graduationYear: user.graduationYear,
          degree: user.degree,
          bio: user.bio,
          skills: user.skills,
          interests: user.interests
        }),
        ...(userType === 'startup' && {
          companyName: user.companyName,
          industry: user.industry,
          stage: user.stage,
          location: user.location,
          website: user.website,
          foundingDate: user.foundingDate,
          teamSize: user.teamSize,
          description: user.description
        }),
        ...(userType === 'club' && {
          clubName: user.clubName,
          parentOrganization: user.parentOrganization,
          memberCount: user.memberCount,
          location: user.location,
          description: user.description,
          foundedYear: user.foundedYear,
          website: user.website,
          events: user.events,
          focusAreas: user.focusAreas
        })
      };
      
      return NextResponse.json({
        user: userData,
        authenticated: true
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
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 