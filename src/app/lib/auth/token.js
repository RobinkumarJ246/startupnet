import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

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
 * Get the auth token from the request (from cookies)
 * @param {Request} request - The request object
 * @returns {Promise<string|null>} - The token or null if not found
 */
export async function getAuthTokenFromRequest(request) {
  try {
    // Try to get the token from cookies first
    try {
      const cookieStore = await cookies();
      const authToken = cookieStore.get('auth_token')?.value;
      
      if (authToken) {
        return authToken;
      }
    } catch (cookieError) {
      console.log('Could not access cookie store:', cookieError.message);
      // Continue to try other methods
    }
    
    // If cookies aren't available, try to get from Authorization header
    if (request && request.headers) {
      try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
      } catch (headerError) {
        console.log('Could not access request headers:', headerError.message);
      }
    }
    
    // Try to extract cookie from request manually
    if (request && request.cookies) {
      try {
        const cookies = request.cookies;
        const authCookie = cookies.get('auth_token');
        if (authCookie) {
          return authCookie.value;
        }
      } catch (requestCookieError) {
        console.log('Could not access request cookies:', requestCookieError.message);
      }
    }
    
    // As a last resort, check Cookie header manually
    if (request && request.headers) {
      try {
        const cookieHeader = request.headers.get('Cookie');
        if (cookieHeader) {
          const cookies = cookieHeader.split(';');
          for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'auth_token') {
              return value;
            }
          }
        }
      } catch (cookieHeaderError) {
        console.log('Could not parse Cookie header:', cookieHeaderError.message);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
}

/**
 * Set the auth token as a cookie
 * @param {Response} response - The response object
 * @param {string} token - The token to set
 * @returns {Response} - The updated response
 */
export function setAuthTokenCookie(response, token) {
  // Calculate expiry date (7 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  
  // Set the cookie
  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiryDate
  });
  
  return response;
}

/**
 * Clear the auth token cookie
 * @param {Response} response - The response object
 * @returns {Response} - The updated response
 */
export function clearAuthTokenCookie(response) {
  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0) // Set expiry to epoch to delete the cookie
  });
  
  return response;
} 