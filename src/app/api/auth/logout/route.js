import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json({
      message: 'Logged out successfully',
      success: true
    });
    
    // Delete the token cookie
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 