import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import * as jose from 'jose';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
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
      
      // Get password data from request
      const { currentPassword, newPassword } = await request.json();
      
      // Validate input
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required' },
          { status: 400 }
        );
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      
      // Connect to DB
      const db = await connectDB();
      if (!db) {
        console.error('Failed to connect to database');
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
      }
      
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
      
      // Find user in database
      const user = await db.collection(collection).findOne({ _id: objectId });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password in database
      await db.collection(collection).updateOne(
        { _id: objectId },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      
      return NextResponse.json(
        { message: 'Password changed successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
} 