import { NextResponse } from 'next/server';
import { verifyEmailWithToken } from '@/app/lib/verification';
import emailService from '@/app/lib/email';

/**
 * Verify user email with the provided token
 */
export async function POST(request) {
  try {
    const { token, email, type } = await request.json();
    
    // Validate input
    if (!token || !email || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    console.log(`Processing email verification for ${email} (${type})`);
    
    // Verify the token and update user's email verification status
    const user = await verifyEmailWithToken(token, email, type);
    
    // Send confirmation email
    try {
      let name;
      switch (type) {
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
      
      await emailService.sendVerificationSuccessEmail({
        email,
        name,
        userType: type
      });
      
      console.log(`Success confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue despite email error
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        emailVerified: user.emailVerified,
        type
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    
    let statusCode = 500;
    let errorMessage = 'An error occurred during email verification';
    
    // Handle specific errors
    if (error.message === 'Invalid token for this user') {
      statusCode = 400;
      errorMessage = 'Invalid verification token for this email';
    } else if (error.message === 'Token not found or already used') {
      statusCode = 400;
      errorMessage = 'This verification link has already been used or is invalid';
    } else if (error.message === 'Token has expired') {
      statusCode = 400;
      errorMessage = 'This verification link has expired. Please request a new one';
    } else if (error.message === 'User not found or already verified') {
      statusCode = 400;
      errorMessage = 'Your email is already verified or your account was not found';
    } else if (error.message.includes('jwt expired')) {
      statusCode = 400;
      errorMessage = 'Verification link has expired. Please request a new one';
    } else if (error.message.includes('invalid token')) {
      statusCode = 400;
      errorMessage = 'Invalid verification token';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 