import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import { clinicalHistorySchema, clinicalHistoriesListResponseSchema } from '../schemas/clinical-history.schema';
import type { ClinicalHistory, CreateClinicalHistoryRequest, ClinicalHistoriesListParams } from '../types/clinical-history.types';
import type { PaginatedData } from '@/types/contracts/api-response';

const ENDPOINT = '/clinical-histories';

export async function getClinicalHistories(params?: ClinicalHistoriesListParams): Promise<PaginatedData<ClinicalHistory>> {
  const response = await client.get(
    ENDPOINT,
    ApiResponseSchema(clinicalHistoriesListResponseSchema),
    { params }
  );
  return response.data;
}

export async function getClinicalHistoryById(id: string): Promise<ClinicalHistory> {
  const response = await client.get(
    `${ENDPOINT}/${id}`,
    ApiResponseSchema(clinicalHistorySchema)
  );
  return response.data;
}

export async function createClinicalHistory(data: CreateClinicalHistoryRequest): Promise<ClinicalHistory> {
  const response = await client.post(
    ENDPOINT,
    data,
    ApiResponseSchema(clinicalHistorySchema)
  );
  return response.data;
}
