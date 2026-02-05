import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import { usePathname } from '@/i18n/navigation';
import { Sidebar } from '../Sidebar';

vi.mock('@/lib/auth/hooks', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

vi.mock('@/i18n/navigation', async () => {
  const actual = await vi.importActual<typeof import('@/i18n/navigation')>(
    '@/i18n/navigation'
  );
  return {
    ...actual,
    usePathname: vi.fn(() => '/'),
  };
});

describe('Sidebar', () => {
  it('renderiza correctamente', () => {
    render(<Sidebar />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('muestra logo expandido por defecto', () => {
    render(<Sidebar />);
    expect(screen.getByText('Clínica San Miguel')).toBeInTheDocument();
  });

  it('con collapsed=false tiene ancho completo', () => {
    render(<Sidebar collapsed={false} />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('w-64');
  });

  it('con collapsed=true tiene ancho reducido y navegacion presente', () => {
    render(<Sidebar collapsed={true} />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('w-16');
    expect(aside).toHaveAttribute('aria-expanded', 'false');
    const nav = screen.getByRole('navigation', { name: 'navigation.sidebar' });
    expect(nav).toBeInTheDocument();
  });

  it('muestra items de navegacion', () => {
    render(<Sidebar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('aplica className personalizada expandido', () => {
    const { container } = render(<Sidebar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('aplica className personalizada colapsado', () => {
    const { container } = render(
      <Sidebar collapsed={true} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('solo resalta la opcion activa: dashboard no activo cuando pathname no es raiz', () => {
    vi.mocked(usePathname).mockReturnValue('/patients');
    render(<Sidebar collapsed={false} />);
    const dashboardLink = screen.getByRole('link', {
      name: 'navigation.dashboard',
    });
    expect(dashboardLink).not.toHaveClass('bg-sidebar-accent');
  });
});
