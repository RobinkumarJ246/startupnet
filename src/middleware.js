import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decrypt } from './app/lib/session';

const protectedRoutes = ['/'];
const publicRoutes = ['/login'];

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  try {
    // ✅ Await the cookies function properly
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;
    console.log('Cookie:', cookie);

    if (cookie) {
      const session = await decrypt(cookie); // ✅ Decrypt the session
      console.log('Session:', session);

      if (isPublicRoute && session?.email) {
        // ✅ Redirect logged-in users from login to dashboard
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }

      if (isProtectedRoute && !session?.email) {
        // ✅ Redirect unauthenticated users from protected routes to login
        return NextResponse.redirect(new URL('/login', req.nextUrl));
      }
    } else if (isProtectedRoute) {
      // ✅ If no session and trying to access protected route -> redirect to login
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  } catch (error) {
    console.error('Middleware Error:', error);
    // ✅ Handle session or decryption failure by redirecting to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  // ✅ Allow access if no issues
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/'], // ✅ Define routes where the middleware should run
};
