import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import { patientSchema, patientsListResponseSchema } from '../schemas/patient.schema';
import type { Patient, CreatePatientRequest, UpdatePatientRequest, PatientsListParams } from '../types/patient.types';
import type { PaginatedData } from '@/types/contracts/api-response';

const PATIENTS_ENDPOINT = '/patients';

export async function getPatients(params?: PatientsListParams): Promise<PaginatedData<Patient>> {
  const response = await client.get(
    PATIENTS_ENDPOINT,
    ApiResponseSchema(patientsListResponseSchema),
    { params }
  );
  return response.data;
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await client.get(
    `${PATIENTS_ENDPOINT}/${id}`,
    ApiResponseSchema(patientSchema)
  );
  return response.data;
}

export async function createPatient(data: CreatePatientRequest): Promise<Patient> {
  const response = await client.post(
    PATIENTS_ENDPOINT,
    data,
    ApiResponseSchema(patientSchema)
  );
  return response.data;
}

export async function updatePatient(id: string, data: UpdatePatientRequest): Promise<Patient> {
  const response = await client.put(
    `${PATIENTS_ENDPOINT}/${id}`,
    data,
    ApiResponseSchema(patientSchema)
  );
  return response.data;
}

export async function deletePatient(id: string): Promise<void> {
  await client.delete(
    `${PATIENTS_ENDPOINT}/${id}`,
    ApiResponseSchema(patientSchema)
  );
}
