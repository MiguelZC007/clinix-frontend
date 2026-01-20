import { describe, it, expect } from 'vitest';
import {
  getClinicalHistories,
  getClinicalHistoryById,
  createClinicalHistory,
} from '../api/clinical-histories.api';
import { MOCK_CLINICAL_HISTORIES } from '../__mocks__/clinical-histories.mock';

describe('getClinicalHistories', () => {
  it('retorna lista de historiales paginada', async () => {
    const result = await getClinicalHistories();
    expect(result.items).toHaveLength(MOCK_CLINICAL_HISTORIES.length);
    expect(result.total).toBe(MOCK_CLINICAL_HISTORIES.length);
  });

  it('filtra por patientId', async () => {
    const result = await getClinicalHistories({ patientId: '1' });
    expect(result.items.length).toBeGreaterThan(0);
  });
});

describe('getClinicalHistoryById', () => {
  it('retorna historial por id', async () => {
    const history = await getClinicalHistoryById('1');
    expect(history.id).toBe('1');
    expect(history.reason).toBeDefined();
  });

  it('lanza error si historial no existe', async () => {
    await expect(getClinicalHistoryById('999')).rejects.toThrow();
  });
});

describe('createClinicalHistory', () => {
  it('crea historial correctamente', async () => {
    const newHistory = {
      patientId: '1',
      reason: 'Nueva consulta',
      symptoms: 'Dolor de cabeza',
      physicalExam: 'Normal',
      diagnosis: 'Migraña',
      treatment: 'Analgésicos',
      notes: 'Control en 1 semana',
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.5,
        weight: 70,
        height: 170,
      },
    };

    const result = await createClinicalHistory(newHistory);
    expect(result.reason).toBe('Nueva consulta');
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });
});
