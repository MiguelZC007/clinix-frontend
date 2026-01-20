import { describe, it, expect } from 'vitest';
import {
  patientSchema,
  patientFormSchema,
  genderSchema,
  patientsListResponseSchema,
} from '../schemas/patient.schema';

describe('genderSchema', () => {
  it('valida generos validos', () => {
    expect(genderSchema.parse('male')).toBe('male');
    expect(genderSchema.parse('female')).toBe('female');
    expect(genderSchema.parse('other')).toBe('other');
  });

  it('rechaza generos invalidos', () => {
    expect(() => genderSchema.parse('invalid')).toThrow();
    expect(() => genderSchema.parse('')).toThrow();
    expect(() => genderSchema.parse(null)).toThrow();
  });
});

describe('patientSchema', () => {
  const validPatient = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    document: '12345678',
    birthDate: '1990-05-15',
    gender: 'male',
    phone: '+591 70000001',
    email: 'juan@example.com',
    address: 'Av. Principal 123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  it('valida paciente completo correctamente', () => {
    expect(patientSchema.parse(validPatient)).toEqual(validPatient);
  });

  it('rechaza email invalido', () => {
    expect(() =>
      patientSchema.parse({ ...validPatient, email: 'invalid-email' })
    ).toThrow();
  });

  it('rechaza paciente sin campos requeridos', () => {
    expect(() => patientSchema.parse({})).toThrow();
    expect(() => patientSchema.parse({ id: '1' })).toThrow();
  });
});

describe('patientFormSchema', () => {
  const validFormData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    document: '12345678',
    birthDate: '1990-05-15',
    gender: 'male' as const,
    phone: '+591 70000001',
    email: 'juan@example.com',
    address: 'Av. Principal 123',
  };

  it('valida formulario completo correctamente', () => {
    expect(patientFormSchema.parse(validFormData)).toEqual(validFormData);
  });

  it('rechaza firstName vacio', () => {
    expect(() =>
      patientFormSchema.parse({ ...validFormData, firstName: '' })
    ).toThrow();
  });

  it('rechaza firstName muy corto', () => {
    expect(() =>
      patientFormSchema.parse({ ...validFormData, firstName: 'A' })
    ).toThrow();
  });

  it('rechaza email invalido', () => {
    expect(() =>
      patientFormSchema.parse({ ...validFormData, email: 'invalid' })
    ).toThrow();
  });

  it('rechaza campos requeridos faltantes', () => {
    expect(() => patientFormSchema.parse({})).toThrow();
    expect(() =>
      patientFormSchema.parse({ firstName: 'Juan' })
    ).toThrow();
  });
});

describe('patientsListResponseSchema', () => {
  const validResponse = {
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

  it('valida respuesta de lista correctamente', () => {
    expect(patientsListResponseSchema.parse(validResponse)).toEqual(
      validResponse
    );
  });

  it('rechaza respuesta sin items', () => {
    expect(() =>
      patientsListResponseSchema.parse({
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      })
    ).toThrow();
  });

  it('rechaza respuesta con tipos incorrectos', () => {
    expect(() =>
      patientsListResponseSchema.parse({
        ...validResponse,
        total: 'invalid',
      })
    ).toThrow();
  });
});
