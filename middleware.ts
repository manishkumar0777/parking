import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest) {
    // Middleware logic can be added here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to auth pages
        if (pathname.startsWith('/auth')) {
          return true;
        }

        // Require authentication for all other pages
        if (!token) {
          return false;
        }

        // Admin routes require admin role
        if (pathname.startsWith('/admin')) {
          return token.role === 'admin';
        }

        // User routes require user or admin role
        if (pathname.startsWith('/dashboard')) {
          return token.role === 'user' || token.role === 'admin';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
