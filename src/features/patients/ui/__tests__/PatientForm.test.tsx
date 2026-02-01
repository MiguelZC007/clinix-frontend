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

    expect(screen.getByLabelText('patients.name')).toBeInTheDocument();
    expect(screen.getByLabelText('patients.lastName')).toBeInTheDocument();
    expect(screen.getByLabelText('patients.email')).toBeInTheDocument();
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

    const nameInput = screen.getByLabelText('patients.name') as HTMLInputElement;
    expect(nameInput.value).toBe(patient.name);
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

    await user.type(screen.getByLabelText('patients.name'), 'Juan');
    await user.type(screen.getByLabelText('patients.lastName'), 'Pérez');
    await user.type(screen.getByLabelText('patients.birthDate'), '1990-05-15');
    await user.type(screen.getByLabelText('patients.phone'), '+591 70000001');
    await user.type(screen.getByLabelText('patients.email'), 'juan@example.com');
    await user.type(screen.getByLabelText('patients.address'), 'Av. Principal 123');

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
