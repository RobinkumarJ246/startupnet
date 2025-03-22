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
    // Set cookie attributes properly for all environments
    const cookieAttributes = {
      name: 'token',
      value: token,
      httpOnly: true,
      secure: true, // Always use secure cookies for JWT tokens
      sameSite: isProduction ? 'none' : 'lax', // 'none' for production, 'lax' for dev
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      priority: 'high'
    };
    
    // Set the cookie
    response.cookies.set(cookieAttributes);
    
    // For Vercel, set a more explicit Set-Cookie header to ensure it works in all browsers
    // This is needed because NextResponse.cookies sometimes doesn't set complete attributes
    const cookieString = `token=${token}; Path=/; HttpOnly; Secure; SameSite=${isProduction ? 'None' : 'Lax'}; Max-Age=${60 * 60 * 24 * 7}; Priority=High`;
    response.headers.set('Set-Cookie', cookieString);
    
    console.log('Auth cookie set successfully with explicit header');
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

// Get token data directly from cookies without verification
export function getTokenDataFromCookies() {
  // Only run on client side
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Get the token from cookies - try both possible cookie names
    const tokenCookieNames = ['token', 'auth-token'];
    let token = null;
    
    for (const cookieName of tokenCookieNames) {
      const found = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${cookieName}=`))
        ?.split('=')[1];
      
      if (found) {
        token = found;
        console.log(`Found token in cookie: ${cookieName}`);
        break;
      }
    }
    
    // If no token was found in cookies, try localStorage as fallback
    if (!token && localStorage.getItem('user')) {
      console.log('No token found in cookies, using localStorage user data instead');
      const userData = JSON.parse(localStorage.getItem('user'));
      return {
        _id: userData._id || userData.id,
        email: userData.email || '',
        type: userData.type || userData.userType,
        userType: userData.userType || userData.type,
        name: userData.name || userData.fullName || userData.clubName || userData.companyName || '',
        fullName: userData.fullName || userData.name || '',
        clubName: userData.clubName || userData.name || '',
        companyName: userData.companyName || userData.name || ''
      };
    }
    
    if (!token) {
      console.log('No auth token found in cookies or localStorage');
      return null;
    }
    
    // Decode the token payload (second part) without verification
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Create a user object from token data
    return {
      _id: payload.userId || payload._id,
      email: payload.email || '',
      type: payload.userType || payload.type,
      userType: payload.userType || payload.type,
      name: payload.name || '',
      fullName: payload.fullName || payload.name || '',
      clubName: payload.clubName || payload.name || '',
      companyName: payload.companyName || payload.name || ''
    };
  } catch (error) {
    console.error('Error getting token data from cookies:', error);
    
    // If there was an error decoding the token but we have user data in localStorage,
    // return that as a fallback
    try {
      if (localStorage.getItem('user')) {
        console.log('Token decode error, using localStorage user data instead');
        const userData = JSON.parse(localStorage.getItem('user'));
        return {
          _id: userData._id || userData.id,
          email: userData.email || '',
          type: userData.type || userData.userType,
          userType: userData.userType || userData.type,
          name: userData.name || userData.fullName || userData.clubName || userData.companyName || '',
          fullName: userData.fullName || userData.name || '',
          clubName: userData.clubName || userData.name || '',
          companyName: userData.companyName || userData.name || ''
        };
      }
    } catch (fallbackError) {
      console.error('Fallback to localStorage also failed:', fallbackError);
    }
    
    return null;
  }
} 