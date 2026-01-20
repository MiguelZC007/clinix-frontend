import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  usePatientList,
  usePatient,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
} from '../usePatients';
import * as patientsApi from '../../api/patients.api';

vi.mock('../../api/patients.api');

describe('usePatientList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inicia con isLoading true', async () => {
    vi.mocked(patientsApi.getPatients).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    const { result } = renderHook(() => usePatientList());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('carga pacientes exitosamente', async () => {
    const mockPatients = {
      items: [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          document: '12345678',
          birthDate: '1990-05-15',
          gender: 'male' as const,
          phone: '+591 70000001',
          email: 'juan@example.com',
          address: 'Av. Principal 123',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };

    vi.mocked(patientsApi.getPatients).mockResolvedValue(mockPatients);

    const { result } = renderHook(() => usePatientList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPatients);
    expect(result.current.error).toBeNull();
  });

  it('maneja errores correctamente', async () => {
    const error = new Error('Network error');
    vi.mocked(patientsApi.getPatients).mockRejectedValue(error);

    const { result } = renderHook(() => usePatientList());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeNull();
  });
});

describe('usePatient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carga paciente por id', async () => {
    const mockPatient = {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      document: '12345678',
      birthDate: '1990-05-15',
      gender: 'male' as const,
      phone: '+591 70000001',
      email: 'juan@example.com',
      address: 'Av. Principal 123',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    };

    vi.mocked(patientsApi.getPatientById).mockResolvedValue(mockPatient);

    const { result } = renderHook(() => usePatient('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockPatient);
  });
});

describe('useCreatePatient', () => {
  it('crea paciente correctamente', async () => {
    const newPatient = {
      firstName: 'Nuevo',
      lastName: 'Paciente',
      document: '99999999',
      birthDate: '2000-01-01',
      gender: 'male' as const,
      phone: '+591 70000099',
      email: 'nuevo@example.com',
      address: 'Nueva Dirección',
    };

    const createdPatient = {
      ...newPatient,
      id: '999',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
    };

    vi.mocked(patientsApi.createPatient).mockResolvedValue(createdPatient);

    const { result } = renderHook(() => useCreatePatient());

    const patient = await result.current.mutate(newPatient);

    expect(patient).toEqual(createdPatient);
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useUpdatePatient', () => {
  it('actualiza paciente correctamente', async () => {
    const updates = { firstName: 'Actualizado' };
    const updatedPatient = {
      id: '1',
      firstName: 'Actualizado',
      lastName: 'Pérez',
      document: '12345678',
      birthDate: '1990-05-15',
      gender: 'male' as const,
      phone: '+591 70000001',
      email: 'juan@example.com',
      address: 'Av. Principal 123',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
    };

    vi.mocked(patientsApi.updatePatient).mockResolvedValue(updatedPatient);

    const { result } = renderHook(() => useUpdatePatient());

    const patient = await result.current.mutate('1', updates);

    expect(patient.firstName).toBe('Actualizado');
  });
});

describe('useDeletePatient', () => {
  it('elimina paciente correctamente', async () => {
    vi.mocked(patientsApi.deletePatient).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeletePatient());

    await result.current.mutate('1');

    expect(result.current.isLoading).toBe(false);
    expect(patientsApi.deletePatient).toHaveBeenCalledWith('1');
  });
});
