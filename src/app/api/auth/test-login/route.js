import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// WARNING: This endpoint is for development testing only
// It should be disabled or removed in production
export async function POST(request) {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test login is disabled in production' },
      { status: 403 }
    );
  }

  try {
    const { email, userType } = await request.json();

    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Email and userType are required' },
        { status: 400 }
      );
    }

    console.log("TEST LOGIN:", { email, userType });

    // Create a mock user based on user type
    let userData;
    
    switch (userType) {
      case 'student':
        userData = {
          id: 'test-student-id',
          email,
          name: 'Test Student',
          type: 'student',
          university: 'Test University',
          major: 'Computer Science',
          graduationYear: '2024'
        };
        break;
      
      case 'startup':
        userData = {
          id: 'test-startup-id',
          email,
          name: 'Test Startup, Inc.',
          type: 'startup',
          companyName: 'Test Startup, Inc.',
          industry: 'Technology',
          stage: 'Seed',
          location: 'San Francisco, CA'
        };
        break;
      
      case 'club':
        userData = {
          id: 'test-club-id',
          email,
          name: 'Test Club',
          type: 'club',
          clubName: 'Test Club',
          parentOrganization: 'Test University',
          memberCount: 25,
          location: 'New York, NY'
        };
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid user type' },
          { status: 400 }
        );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: userData.id,
        userType,
        email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      user: userData,
      message: 'Test login successful'
    });
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: false, // Not secure for testing
      sameSite: 'lax',  // Less strict for testing
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 