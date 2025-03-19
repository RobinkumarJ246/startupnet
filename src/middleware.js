import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Use a TextEncoder to convert your secret to Uint8Array
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function middleware(request) {
  console.log("Middleware running on:", request.nextUrl.pathname);
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/', 
    '/login', 
    '/register',
    '/register/student',
    '/register/startup',
    '/register/club',
    '/api/auth/login', 
    '/api/auth/test-login', 
    '/api/register',
    '/api/register/club',
    '/api/register/student',
    '/api/register/startup',
    '/api/profile/image/upload',
    '/api/profile/image/[id]'

  ];  
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path || 
                                               request.nextUrl.pathname.startsWith('/api/auth/'));
  
  // Get token from cookie
  const token = request.cookies.get('token')?.value;
  console.log("Token present:", !!token);

  // Helper function to verify token
  async function verifyToken() {
    try {
      if (!token) return null;
      
      const { payload } = await jose.jwtVerify(token, secret);
      return payload;
    } catch (error) {
      console.log("Token verification error:", error.message);
      return null;
    }
  }

  // If it's a public path and user is logged in, redirect to explore
  if (isPublicPath && token) {
    const payload = await verifyToken();
    if (payload) {
      console.log("Valid token on public path, redirecting to /explore");
      return NextResponse.redirect(new URL('/explore', request.url));
    } else {
      console.log("Invalid token on public path");
      // Token is invalid, clear it
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  // If it's a protected path and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    console.log("No token on protected path, redirecting to root -> /");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // For protected paths, verify token
  if (!isPublicPath && token) {
    const payload = await verifyToken();
    if (payload) {
      console.log("Valid token on protected path, proceeding");
      
      // Add user info to headers for use in protected routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId || '');
      requestHeaders.set('x-user-type', payload.userType || '');
      requestHeaders.set('x-user-email', payload.email || '');

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } else {
      console.log("Invalid token on protected path");
      // Token is invalid, redirect to root
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('token'); // Clear the invalid token
      return response;
    }
  }

  console.log("Default pass-through");
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};