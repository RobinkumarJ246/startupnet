import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request) {
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/register'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value;

  // If it's a public path and user is logged in, redirect to explore
  if (isPublicPath && token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.redirect(new URL('/explore', request.url));
    } catch (error) {
      // Token is invalid, continue to public path
    }
  }

  // If it's a protected path and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For protected paths, verify token
  if (!isPublicPath && token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Add user info to headers for use in protected routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-type', decoded.userType);
      requestHeaders.set('x-user-email', decoded.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 