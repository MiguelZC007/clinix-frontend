import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Rutas que no requieren autenticación
  const isAuthPage = pathname.includes('/login') || pathname.includes('/forgot-password');
  const isApiRoute = pathname.startsWith('/api');
  
  // Rutas protegidas (requieren autenticación)
  const isProtectedRoute = pathname.includes('/dashboard') ||
                           pathname.includes('/patients') ||
                           pathname.includes('/appointments') ||
                           pathname.includes('/clinical-histories') ||
                           pathname.includes('/messages') ||
                           pathname === '/' ||
                           pathname === '/es' ||
                           pathname === '/en';

  // Obtener token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Si está intentando acceder a una ruta protegida sin token, redirigir a login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Preservar el locale si existe
    const localeMatch = pathname.match(/^\/(es|en)/);
    if (localeMatch) {
      loginUrl.pathname = `/${localeMatch[1]}/login`;
    } else {
      // Si no hay locale, usar el default (es)
      loginUrl.pathname = '/login';
    }
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado e intenta acceder a login, redirigir al dashboard
  if (isAuthPage && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    const localeMatch = pathname.match(/^\/(es|en)/);
    if (localeMatch) {
      dashboardUrl.pathname = `/${localeMatch[1]}/dashboard`;
    } else {
      dashboardUrl.pathname = '/dashboard';
    }
    return NextResponse.redirect(dashboardUrl);
  }

  // Permitir acceso a rutas de autenticación y API sin verificar token
  if (isAuthPage || isApiRoute) {
    return intlMiddleware(request);
  }

  // Aplicar middleware de i18n para todas las rutas
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(es|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
