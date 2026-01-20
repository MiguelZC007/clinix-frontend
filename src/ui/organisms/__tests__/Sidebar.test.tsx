import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  it('renderiza correctamente', () => {
    render(<Sidebar />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('muestra logo', () => {
    render(<Sidebar />);
    expect(screen.getByText('Clínica San Miguel')).toBeInTheDocument();
  });

  it('muestra items de navegacion', () => {
    render(<Sidebar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('aplica className personalizada', () => {
    const { container } = render(<Sidebar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
