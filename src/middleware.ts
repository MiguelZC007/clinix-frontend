import { withAuth } from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default withAuth(
  function onSuccess(req: NextRequest & { nextauth: { token: any } }) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const isAuthPage = pathname.includes('/login') || pathname.includes('/forgot-password');
        const isApiRoute = pathname.startsWith('/api');
        const isDashboardRoute = pathname.includes('/dashboard') ||
                                 pathname.includes('/patients') ||
                                 pathname.includes('/appointments') ||
                                 pathname.includes('/clinical-histories') ||
                                 pathname.includes('/messages');

        // Permitir acceso a rutas de autenticación y API sin token
        if (isAuthPage || isApiRoute) {
          return true;
        }

        // Proteger rutas del dashboard
        if (isDashboardRoute) {
          return token != null;
        }

        // Para otras rutas, permitir acceso
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
