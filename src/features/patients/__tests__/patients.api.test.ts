import { describe, it, expect } from 'vitest';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../api/patients.api';
import { MOCK_PATIENTS } from '../__mocks__/patients.mock';

describe('getPatients', () => {
  it('retorna lista de pacientes paginada', async () => {
    const result = await getPatients();
    expect(result.items).toHaveLength(MOCK_PATIENTS.length);
    expect(result.total).toBe(MOCK_PATIENTS.length);
    expect(result.page).toBe(1);
  });

  it('pasa parametros de paginacion', async () => {
    const result = await getPatients({ page: 1, pageSize: 5 });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it('retorna pacientes correctamente tipados', async () => {
    const result = await getPatients();
    expect(result.items[0]).toHaveProperty('id');
    expect(result.items[0]).toHaveProperty('firstName');
    expect(result.items[0]).toHaveProperty('email');
  });
});

describe('getPatientById', () => {
  it('retorna paciente por id', async () => {
    const patient = await getPatientById('1');
    expect(patient.id).toBe('1');
    expect(patient.firstName).toBe('Juan');
  });

  it('lanza error si paciente no existe', async () => {
    await expect(getPatientById('999')).rejects.toThrow();
  });
});

describe('createPatient', () => {
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

    const result = await createPatient(newPatient);
    expect(result.firstName).toBe('Nuevo');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });
});

describe('updatePatient', () => {
  it('actualiza paciente correctamente', async () => {
    const updates = {
      firstName: 'Juan Actualizado',
    };

    const result = await updatePatient('1', updates);
    expect(result.firstName).toBe('Juan Actualizado');
    expect(result.updatedAt).toBeDefined();
  });

  it('lanza error si paciente no existe', async () => {
    await expect(updatePatient('999', { firstName: 'Test' })).rejects.toThrow();
  });
});

describe('deletePatient', () => {
  it('elimina paciente correctamente', async () => {
    await expect(deletePatient('1')).resolves.toBeUndefined();
  });

  it('lanza error si paciente no existe', async () => {
    await expect(deletePatient('999')).rejects.toThrow();
  });
});
