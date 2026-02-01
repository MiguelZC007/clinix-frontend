import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import type { BreadcrumbItemData } from '@/ui/molecules';
import { DashboardLayout } from '../DashboardLayout';

describe('DashboardLayout', () => {
  const breadcrumbs: BreadcrumbItemData[] = [
    { label: 'Home', href: '/' },
  ];

  it('renderiza correctamente', () => {
    render(
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('muestra sidebar en desktop', () => {
    render(
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Clínica San Miguel')).toBeInTheDocument();
  });

  it('muestra header con breadcrumbs', () => {
    render(
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renderiza children en main', () => {
    render(
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div>Main Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });
});
