import { describe, it, expect } from 'vitest';
import {
  appointmentSchema,
  appointmentFormSchema,
  appointmentStatusSchema,
  appointmentsListResponseSchema,
} from '../schemas/appointment.schema';

describe('appointmentStatusSchema', () => {
  it('valida estados validos', () => {
    expect(appointmentStatusSchema.parse('scheduled')).toBe('scheduled');
    expect(appointmentStatusSchema.parse('completed')).toBe('completed');
    expect(appointmentStatusSchema.parse('cancelled')).toBe('cancelled');
  });

  it('rechaza estados invalidos', () => {
    expect(() => appointmentStatusSchema.parse('invalid')).toThrow();
    expect(() => appointmentStatusSchema.parse('')).toThrow();
  });
});

describe('appointmentSchema', () => {
  const validAppointment = {
    id: '1',
    patientName: 'Juan Pérez',
    patientInitials: 'JP',
    date: new Date('2024-01-15'),
    startTime: '09:00',
    endTime: '09:30',
    reason: 'Control rutinario',
    status: 'scheduled' as const,
  };

  it('valida cita completa correctamente', () => {
    const result = appointmentSchema.parse({
      ...validAppointment,
      date: '2024-01-15',
    });
    expect(result.id).toBe('1');
    expect(result.patientName).toBe('Juan Pérez');
  });

  it('convierte fecha string a Date', () => {
    const result = appointmentSchema.parse({
      ...validAppointment,
      date: '2024-01-15',
    });
    expect(result.date).toBeInstanceOf(Date);
  });

  it('rechaza cita sin campos requeridos', () => {
    expect(() => appointmentSchema.parse({})).toThrow();
  });
});

describe('appointmentFormSchema', () => {
  const validFormData = {
    patientId: '1',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '09:30',
    reason: 'Control rutinario',
  };

  it('valida formulario completo correctamente', () => {
    expect(appointmentFormSchema.parse(validFormData)).toEqual(validFormData);
  });

  it('rechaza patientId vacio', () => {
    expect(() =>
      appointmentFormSchema.parse({ ...validFormData, patientId: '' })
    ).toThrow();
  });

  it('rechaza date vacio', () => {
    expect(() =>
      appointmentFormSchema.parse({ ...validFormData, date: '' })
    ).toThrow();
  });

  it('rechaza reason vacio', () => {
    expect(() =>
      appointmentFormSchema.parse({ ...validFormData, reason: '' })
    ).toThrow();
  });

  it('rechaza campos faltantes', () => {
    expect(() => appointmentFormSchema.parse({})).toThrow();
  });
});

describe('appointmentsListResponseSchema', () => {
  const validResponse = {
    items: [
      {
        id: '1',
        patientName: 'Juan Pérez',
        patientInitials: 'JP',
        date: new Date('2024-01-15'),
        startTime: '09:00',
        endTime: '09:30',
        reason: 'Control rutinario',
        status: 'scheduled' as const,
      },
    ],
    total: 1,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };

  it('valida respuesta de lista correctamente', () => {
    const result = appointmentsListResponseSchema.parse({
      ...validResponse,
      items: validResponse.items.map((item) => ({
        ...item,
        date: '2024-01-15',
      })),
    });
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
  });
});
