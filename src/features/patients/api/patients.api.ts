import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import { patientSchema, patientsListResponseSchema, patientAntecedentsSchema } from '../schemas/patient.schema';
import type { Patient, CreatePatientRequest, UpdatePatientRequest, PatientsListParams, PatientAntecedents, UpdatePatientAntecedentsRequest } from '../types/patient.types';
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
  const response = await client.patch(
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

export async function getPatientAntecedents(id: string): Promise<PatientAntecedents> {
  const response = await client.get(
    `${PATIENTS_ENDPOINT}/${id}/antecedents`,
    ApiResponseSchema(patientAntecedentsSchema)
  );
  return response.data;
}

export async function updatePatientAntecedents(id: string, data: UpdatePatientAntecedentsRequest): Promise<PatientAntecedents> {
  const response = await client.put(
    `${PATIENTS_ENDPOINT}/${id}/antecedents`,
    data,
    ApiResponseSchema(patientAntecedentsSchema)
  );
  return response.data;
}
