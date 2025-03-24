import { NextResponse } from 'next/server';
import { verifyEmailWithCode } from '@/app/lib/verification';
import emailService from '@/app/lib/email';

/**
 * Verify user email with the provided verification code
 */
export async function POST(request) {
  try {
    const { code, email, userType } = await request.json();
    
    // Validate input
    if (!code || !email || !userType) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    console.log(`Processing verification code for ${email} (${userType})`);
    
    // Verify the code and update user's email verification status
    const user = await verifyEmailWithCode(code, email, userType);
    
    // Send confirmation email
    try {
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
      
      await emailService.sendVerificationSuccessEmail({
        email,
        name,
        userType
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
        type: userType
      }
    });
  } catch (error) {
    console.error('Verification code error:', error);
    
    let statusCode = 500;
    let errorMessage = 'An error occurred during email verification';
    
    // Handle specific errors
    if (error.message === 'Invalid verification code or already used') {
      statusCode = 400;
      errorMessage = 'Invalid verification code or already used';
    } else if (error.message === 'Verification code has expired') {
      statusCode = 400;
      errorMessage = 'This verification code has expired. Please request a new one';
    } else if (error.message === 'User not found or already verified') {
      statusCode = 400;
      errorMessage = 'Your email is already verified or your account was not found';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 