'use client';

import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/ui/templates';
import type { BreadcrumbItemData } from '@/ui/molecules';

type DashboardLayoutPageProps = {
  children: React.ReactNode;
};

function useBreadcrumbs(): BreadcrumbItemData[] {
  const pathname = usePathname();
  const t = useTranslations();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItemData[] = [
    { label: t('navigation.dashboard'), href: '/' },
  ];

  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    if (segment === 'patients') {
      breadcrumbs.push({ label: t('navigation.patients'), href: '/patients' });
    } else if (segment === 'appointments') {
      breadcrumbs.push({ label: t('navigation.appointments'), href: '/appointments' });
    } else if (segment === 'messages') {
      breadcrumbs.push({ label: t('navigation.messages'), href: '/messages' });
    } else if (segment === 'clinical-histories') {
      breadcrumbs.push({ label: t('navigation.clinicalHistories'), href: '/clinical-histories' });
    } else if (segment === 'new') {
      breadcrumbs.push({ label: t('common.create') });
    } else if (segment === 'edit') {
      breadcrumbs.push({ label: t('common.edit') });
    } else {
      breadcrumbs.push({ label: `#${segment.slice(0, 8)}`, href: currentPath });
    }
  }

  return breadcrumbs;
}

export default function DashboardLayoutPage({ children }: DashboardLayoutPageProps) {
  const breadcrumbs = useBreadcrumbs();

  return <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>;
}
