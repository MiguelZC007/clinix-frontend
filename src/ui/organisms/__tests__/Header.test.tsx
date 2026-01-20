import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';
import type { BreadcrumbItemData } from '@/ui/molecules';

describe('Header', () => {
  const breadcrumbs: BreadcrumbItemData[] = [
    { label: 'Home', href: '/' },
    { label: 'Patients' },
  ];

  it('renderiza correctamente', () => {
    render(<Header breadcrumbs={breadcrumbs} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('muestra breadcrumbs', () => {
    render(<Header breadcrumbs={breadcrumbs} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Patients')).toBeInTheDocument();
  });

  it('muestra boton de menu en mobile', () => {
    render(<Header breadcrumbs={breadcrumbs} onMenuClick={vi.fn()} />);
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });

  it('llama onMenuClick al hacer click en menu', async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    render(<Header breadcrumbs={breadcrumbs} onMenuClick={onMenuClick} />);

    const menuButton = screen.getByRole('button');
    await user.click(menuButton);

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('aplica className personalizada', () => {
    const { container } = render(
      <Header breadcrumbs={breadcrumbs} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
