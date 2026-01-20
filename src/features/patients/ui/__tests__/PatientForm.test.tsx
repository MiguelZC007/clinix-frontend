import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { PatientForm } from '../PatientForm';
import { MOCK_PATIENTS } from '../../__mocks__/patients.mock';

describe('PatientForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza formulario vacio para nuevo paciente', () => {
    render(
      <PatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByLabelText(/firstName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lastName/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('prellena formulario con datos del paciente', () => {
    const patient = MOCK_PATIENTS[0];
    render(
      <PatientForm
        patient={patient}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const firstNameInput = screen.getByLabelText(/firstName/i) as HTMLInputElement;
    expect(firstNameInput.value).toBe(patient.firstName);
  });

  it('muestra errores de validacion', async () => {
    const user = userEvent.setup();
    render(
      <PatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('llama onSubmit con datos validos', async () => {
    const user = userEvent.setup();
    render(
      <PatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    await user.type(screen.getByLabelText(/firstName/i), 'Juan');
    await user.type(screen.getByLabelText(/lastName/i), 'Pérez');
    await user.type(screen.getByLabelText(/document/i), '12345678');
    await user.type(screen.getByLabelText(/birthDate/i), '1990-05-15');
    await user.type(screen.getByLabelText(/phone/i), '+591 70000001');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.type(screen.getByLabelText(/address/i), 'Av. Principal 123');

    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('llama onCancel al hacer click en cancelar', async () => {
    const user = userEvent.setup();
    render(
      <PatientForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('muestra loading state', () => {
    render(
      <PatientForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /save/i });
    expect(submitButton).toBeDisabled();
  });
});
