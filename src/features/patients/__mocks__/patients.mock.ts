import type { Patient } from '../types/patient.types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    document: '12345678',
    birthDate: '1990-05-15',
    gender: 'male',
    phone: '+591 70000001',
    email: 'juan.perez@email.com',
    address: 'Av. Principal 123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    document: '87654321',
    birthDate: '1985-08-22',
    gender: 'female',
    phone: '+591 70000002',
    email: 'maria.gonzalez@email.com',
    address: 'Calle Secundaria 456',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'López',
    document: '11223344',
    birthDate: '1978-03-10',
    gender: 'male',
    phone: '+591 70000003',
    email: 'carlos.lopez@email.com',
    address: 'Calle Tercera 789',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
];

export function getMockPatientById(id: string): Patient | undefined {
  return MOCK_PATIENTS.find((patient) => patient.id === id);
}
