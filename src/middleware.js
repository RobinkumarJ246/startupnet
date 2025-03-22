import { NextResponse } from 'next/server';
import * as jose from 'jose';

// Make sure we're using the environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'startupsnet-secure-jwt-secret-key-2024';
const secret = new TextEncoder().encode(JWT_SECRET);

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
    '/api/auth/logout',
    '/api/auth/validate',
    '/api/auth/test-login', 
    '/api/register',
    '/api/register/club',
    '/api/register/student',
    '/api/register/startup',
    '/api/profile/image/upload',
    '/api/profile/image',
    '/api/profile/image/[id]',
    '/faq',
    '/pricing',
    '/stay_tuned',
    '/raffab',
    // Public assets
    '/favicon.ico',
    '/_next',
    '/assets'
  ];  

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/auth/') ||
    request.nextUrl.pathname.startsWith('/api/profile/image') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/assets/') ||
    request.nextUrl.pathname.startsWith('/favicon')
  );
  
  // Explicit check for all API endpoints to ensure they're working properly
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log("API endpoint accessed, allowing through middleware");
    return NextResponse.next();
  }

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
  // But only redirect the login and register pages, not all public paths
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register' || 
       request.nextUrl.pathname.startsWith('/register/')) && token) {
    try {
      const payload = await verifyToken();
      if (payload) {
        console.log("Valid token on login/register path, redirecting to /explore");
        return NextResponse.redirect(new URL('/explore', request.url));
      } else {
        console.log("Invalid token on public path");
        // Token is invalid, clear it and continue
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    } catch (error) {
      console.log("Error verifying token on public path:", error);
      // Continue without redirection if verification fails
      return NextResponse.next();
    }
  }

  // If it's a protected path and user is not logged in, check if it's the explore page
  if (!isPublicPath && !token) {
    // Special handling for explore page - just let them through as it has client-side auth
    if (request.nextUrl.pathname === '/explore' || request.nextUrl.pathname === '/profile' ||
        request.nextUrl.pathname.startsWith('/profile/')) {
      console.log("Letting unauthenticated request to explore/profile page through - client will handle auth");
      return NextResponse.next();
    }
    
    console.log("No token on protected path, redirecting to root with login required flag");
    const url = new URL('/', request.url);
    url.searchParams.set('loginRequired', 'true');
    return NextResponse.redirect(url);
  }

  // For protected paths, verify token
  if (!isPublicPath && token) {
    try {
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
        // Special handling for explore and profile pages
        if (request.nextUrl.pathname === '/explore' || request.nextUrl.pathname === '/profile' || 
            request.nextUrl.pathname.startsWith('/profile/')) {
          console.log("Invalid token on explore/profile, but letting through for client-side handling");
          return NextResponse.next();
        }
        
        console.log("Invalid token on protected path");
        // Token is invalid, redirect to root with login required flag
        const url = new URL('/', request.url);
        url.searchParams.set('loginRequired', 'true');
        const response = NextResponse.redirect(url);
        response.cookies.delete('token'); // Clear the invalid token
        return response;
      }
    } catch (error) {
      console.log("Error in token verification:", error);
      // For critical pages like explore and profile, let them through anyway
      if (request.nextUrl.pathname === '/explore' || request.nextUrl.pathname === '/profile' ||
          request.nextUrl.pathname.startsWith('/profile/')) {
        return NextResponse.next();
      }
      
      // For other pages, redirect to login
      const url = new URL('/', request.url);
      url.searchParams.set('loginRequired', 'true');
      return NextResponse.redirect(url);
    }
  }

  console.log("Default pass-through");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder
     * 5. public/assets folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};