import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '7d'; // Token expires after 7 days

/**
 * Generate a JWT token
 * @param {Object} payload - Data to include in the token
 * @returns {Promise<string>} - The JWT token
 */
export async function generateToken(payload) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
  
  return token;
}

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Promise<Object>} - The decoded token payload
 */
export async function verifyAuthToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get auth token from request (cookies or headers)
 * @param {Request} request - Next.js request object
 * @returns {Promise<string|null>} The auth token or null if not found
 */
export async function getAuthTokenFromRequest(request) {
  try {
    console.log('Getting auth token from request');
    
    // First try to get token from cookies
    let token;
    
    // Try to get token from cookies
    try {
      const cookies = await request.cookies.getAll();
      const tokenCookie = cookies.find(cookie => cookie.name === 'token');
      token = tokenCookie?.value;
      
      if (token) {
        console.log('Token found in cookies');
        return token;
      }
    } catch (error) {
      console.error('Error getting token from cookies:', error);
    }
    
    // If not found in cookies, try Authorization header
    if (!token) {
      try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
          console.log('Token found in Authorization header');
          return token;
        }
      } catch (error) {
        console.error('Error getting token from headers:', error);
      }
    }
    
    console.log('No auth token found');
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} Decoded token payload
 */
export async function verifyToken(token) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'startupsnet-secure-jwt-secret-key-2024';
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

/**
 * Set auth cookie for different environments
 * @param {NextResponse} response - Next.js response object
 * @param {string} token - JWT token to set in cookie
 * @returns {NextResponse} Response with cookie set
 */
export function setAuthCookie(response, token) {
  console.log('Setting auth cookie, environment:', process.env.NODE_ENV);
  const isProduction = process.env.NODE_ENV === 'production';
  
  try {
    // Set the cookie with options appropriate for both development and production
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: isProduction, // Only use secure in production
      sameSite: isProduction ? 'none' : 'lax', // Use 'none' in production for cross-site requests
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    // For Vercel, add a header to ensure cookies are properly handled
    if (isProduction) {
      response.headers.set('Set-Cookie', 
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 7}`);
    }
    
    console.log('Auth cookie set successfully');
    return response;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    // Still return the response even if cookie setting fails
    return response;
  }
}

/**
 * Clear auth cookie
 * @param {NextResponse} response - Next.js response object
 * @returns {NextResponse} Response with cookie cleared
 */
export function clearAuthCookie(response) {
  response.cookies.delete('token');
  return response;
} 