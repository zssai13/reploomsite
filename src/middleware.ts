import { auth } from '@/lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const isOnLogin = req.nextUrl.pathname === '/login';

  // Redirect to login if accessing admin without auth
  if (isOnAdmin && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to admin if already logged in and on login page
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/admin', req.nextUrl));
  }
});

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
