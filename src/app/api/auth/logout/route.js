import { NextResponse } from 'next/server';
import { clearAuthCookie } from '../../../lib/auth/token';

export async function POST() {
  try {
    console.log('Logout endpoint called');
    
    // Create base response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear the authentication cookie
    clearAuthCookie(response);
    
    console.log('Auth cookie cleared');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to clear the cookie
    const response = NextResponse.json({
      success: false, 
      error: 'Logout failed',
      message: error.message
    }, { status: 500 });
    
    // Still try to clear the cookie
    clearAuthCookie(response);
    
    return response;
  }
} 