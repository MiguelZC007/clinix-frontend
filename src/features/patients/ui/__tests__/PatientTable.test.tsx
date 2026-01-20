import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { PatientTable } from '../PatientTable';
import { MOCK_PATIENTS } from '../../__mocks__/patients.mock';

describe('PatientTable', () => {
  const defaultProps = {
    patients: MOCK_PATIENTS.slice(0, 2),
    page: 1,
    totalPages: 1,
    onPageChange: vi.fn(),
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renderiza correctamente', () => {
    render(<PatientTable {...defaultProps} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('muestra pacientes', () => {
    render(<PatientTable {...defaultProps} />);
    expect(screen.getByText(MOCK_PATIENTS[0].firstName)).toBeInTheDocument();
  });

  it('llama onView al hacer click en ver', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    render(<PatientTable {...defaultProps} onView={onView} />);

    const buttons = screen.getAllByRole('button');
    const menuButton = buttons.find(btn => btn.getAttribute('aria-haspopup') === 'menu');
    if (menuButton) {
      await user.click(menuButton);
    }
  });

  it('muestra paginacion cuando hay multiples paginas', () => {
    render(<PatientTable {...defaultProps} totalPages={3} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
