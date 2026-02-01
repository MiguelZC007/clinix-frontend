import { z } from 'zod';
import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import {
  clinicalHistoryBackendSchema,
  mapClinicalHistoryFromBackend,
} from '../schemas/clinical-history.schema';
import type { ClinicalHistory, CreateClinicalHistoryRequest, ClinicalHistoriesListParams } from '../types/clinical-history.types';
import type { PaginatedData } from '@/types/contracts/api-response';

const ENDPOINT = '/clinic-histories';

function parseApiData<T>(response: { data: T }): T {
  return response.data;
}

export async function getClinicalHistories(params?: ClinicalHistoriesListParams): Promise<PaginatedData<ClinicalHistory>> {
  const response = await client.get(
    ENDPOINT,
    ApiResponseSchema(z.array(clinicalHistoryBackendSchema)),
    { params }
  );
  const data = parseApiData(response);
  const list = Array.isArray(data) ? data : [];
  return {
    items: list.map(mapClinicalHistoryFromBackend),
    total: list.length,
    page: 1,
    pageSize: list.length,
    totalPages: list.length > 0 ? 1 : 0,
  };
}

export async function getClinicalHistoryById(id: string): Promise<ClinicalHistory> {
  const response = await client.get(
    `${ENDPOINT}/${id}`,
    ApiResponseSchema(clinicalHistoryBackendSchema)
  );
  const data = parseApiData(response);
  return mapClinicalHistoryFromBackend(data);
}

export async function createClinicalHistory(data: CreateClinicalHistoryRequest): Promise<ClinicalHistory> {
  const response = await client.post(
    ENDPOINT,
    data,
    ApiResponseSchema(clinicalHistoryBackendSchema)
  );
  const apiData = parseApiData(response);
  return mapClinicalHistoryFromBackend(apiData);
}

export async function getClinicalHistoriesByPatient(patientId: string): Promise<ClinicalHistory[]> {
  const response = await client.get(
    `/patients/${patientId}/clinic-histories`,
    ApiResponseSchema(z.array(clinicalHistoryBackendSchema))
  );
  const data = parseApiData(response);
  const arr = Array.isArray(data) ? data : [];
  return arr.map(mapClinicalHistoryFromBackend);
}
