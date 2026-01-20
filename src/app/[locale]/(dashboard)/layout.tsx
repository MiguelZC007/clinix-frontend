'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/ui/templates';
import type { BreadcrumbItemData } from '@/ui/molecules';
import { LoadingSpinner } from '@/ui/atoms';

type DashboardLayoutPageProps = {
  children: React.ReactNode;
};

function useBreadcrumbs(): BreadcrumbItemData[] {
  const pathname = usePathname();
  const t = useTranslations();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItemData[] = [
    { label: t('navigation.dashboard'), href: '/dashboard' },
  ];

  if (segments.length > 1) {
    const currentPath: string[] = [];
    for (let i = 0; i < segments.length; i++) {
      currentPath.push(segments[i]);
      const href = '/' + currentPath.join('/');
      const segment = segments[i];

      if (segment === 'patients') {
        breadcrumbs.push({ label: t('navigation.patients'), href });
      } else if (segment === 'appointments') {
        breadcrumbs.push({ label: t('navigation.appointments'), href });
      } else if (segment === 'clinical-histories') {
        breadcrumbs.push({ label: t('navigation.clinicalHistories'), href });
      } else if (segment === 'messages') {
        breadcrumbs.push({ label: t('navigation.messages'), href });
      } else if (i === segments.length - 1) {
        // Último segmento (página actual)
        breadcrumbs.push({ label: segment });
      }
    }
  }

  return breadcrumbs;
}

export default function DashboardLayoutPage({ children }: DashboardLayoutPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs();

  useEffect(() => {
    // Si no hay sesión y ya terminó de cargar, redirigir a login
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el useEffect redirigirá)
  if (status === 'unauthenticated' || !session) {
    return null;
  }

  return <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>;
}
