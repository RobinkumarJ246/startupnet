import { NextResponse } from 'next/server';
import clientPromise, { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { email, password, userType } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log("Login attempt:", { email, userType });

    // Get the database - this will consistently use the 'users' database
    const db = await connectDB();
    
    // Find the user based on the provided userType or search in all collections
    let user = null;
    let foundUserType = null;
    
    if (userType) {
      // If userType is provided, only search that collection
      const collection = userType === 'student' ? 'students' : 
                         userType === 'startup' ? 'startups' : 
                         userType === 'club' ? 'clubs' : null;
      
      console.log(`Searching in collection: ${collection}`);
      
      if (collection) {
        user = await db.collection(collection).findOne({ email });
        if (user) {
          foundUserType = userType;
          console.log(`User found in ${collection}`);
        }
      }
    } else {
      // Check all collections for the user if userType not provided
      try {
        const [student, startup, club] = await Promise.all([
          db.collection('students').findOne({ email }),
          db.collection('startups').findOne({ email }),
          db.collection('clubs').findOne({ email })
        ]);

        if (student) {
          user = student;
          foundUserType = 'student';
          console.log(`User found in students`);
        } else if (startup) {
          user = startup;
          foundUserType = 'startup';
          console.log(`User found in startups`);
        } else if (club) {
          user = club;
          foundUserType = 'club';
          console.log(`User found in clubs`);
        }
      } catch (err) {
        console.log(`Error searching collections:`, err.message);
      }
    }

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log("User found:", { type: foundUserType, id: user._id });
    
    // Check if password field exists and is valid
    if (!user.password) {
      console.error("User has no password field!");
      return NextResponse.json(
        { error: 'Account is missing password. Please contact support.' },
        { status: 401 }
      );
    }

    // Try different approaches to compare password
    let isValidPassword = false;
    
    // First check if the password is stored in plain text (for debug/test accounts)
    if (password === user.password) {
      console.log("Plain text password match!");
      isValidPassword = true;
    } else {
      // Try bcrypt comparison
      try {
        // Using compareSync for more reliable results
        isValidPassword = bcrypt.compareSync(password, user.password);
        console.log("bcrypt.compareSync result:", isValidPassword);
      } catch (err) {
        console.error("Password comparison error:", err.message);
        
        // If the hash is invalid format, allow login with a direct match
        // This is a fallback for development only and should be removed in production
        if (process.env.NODE_ENV !== 'production' && password === user.password) {
          console.log("Fallback: direct password match for development");
          isValidPassword = true;
        }
      }
    }
    
    if (!isValidPassword) {
      console.log("Password validation failed");
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log("Login successful for:", email);

    // Create user object without sensitive data
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name || user.fullName || user.companyName || user.clubName,
      type: foundUserType,
      // Add type-specific fields
      ...(foundUserType === 'student' && {
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear
      }),
      ...(foundUserType === 'startup' && {
        companyName: user.companyName,
        industry: user.industry,
        stage: user.stage,
        location: user.location
      }),
      ...(foundUserType === 'club' && {
        clubName: user.clubName,
        parentOrganization: user.parentOrganization,
        memberCount: user.memberCount,
        location: user.location
      })
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        userType: foundUserType,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set the token as an HTTP-only cookie
    const response = NextResponse.json({
      user: userData,
      message: 'Login successful'
    });
    
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 