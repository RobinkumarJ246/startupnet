import { NextResponse } from 'next/server';
import { generateVerificationToken } from '@/app/lib/verification';
import emailService from '@/app/lib/email';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

/**
 * Resend verification email to a user
 */
export async function POST(request) {
  try {
    const { email, userType } = await request.json();
    
    // Validate input
    if (!email || !userType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    console.log(`Processing resend verification for ${email} (${userType})`);
    
    // Determine which collection to use based on user type
    let collection;
    switch (userType) {
      case 'student':
        collection = 'students';
        break;
      case 'startup':
        collection = 'startups';
        break;
      case 'club':
        collection = 'clubs';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid user type' },
          { status: 400 }
        );
    }
    
    // Find the user in the database
    const { client, db } = await connectToDatabase();
    const user = await db.collection(collection).findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }
    
    // Check if verification token was sent recently (within 5 minutes)
    const recentToken = await db.collection('verificationTokens').findOne({
      email,
      userType,
      createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes ago
    });
    
    if (recentToken) {
      return NextResponse.json(
        { error: 'Verification email was sent recently. Please wait before requesting a new one.' },
        { status: 429 } // Too Many Requests
      );
    }
    
    // Generate a new verification token
    const verificationToken = await generateVerificationToken(user, userType);
    
    // Get user name based on user type
    let name;
    switch (userType) {
      case 'student':
        name = user.fullName;
        break;
      case 'startup':
        name = user.companyName;
        break;
      case 'club':
        name = user.clubName;
        break;
      default:
        name = email;
    }
    
    // Send verification email
    await emailService.sendVerificationEmail({
      email,
      name,
      verificationToken,
      userType
    });
    
    console.log(`Resent verification email to ${email}`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Verification email has been resent'
    });
  } catch (error) {
    console.error('Error resending verification email:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while resending verification email' },
      { status: 500 }
    );
  }
} 