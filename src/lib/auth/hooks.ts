'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function useAuth() {
  const { data: session, status } = useNextAuthSession();
  const router = useRouter();
  const t = useTranslations();

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success(t('auth.logoutSuccess') || 'Sesión cerrada correctamente');
      router.push('/login');
    } catch (error) {
      toast.error(t('auth.logoutError') || 'Error al cerrar sesión');
    }
  };

  return {
    session,
    user: session?.user,
    accessToken: session?.accessToken,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    logout,
  };
}
