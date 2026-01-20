export type { Gender, Patient, PatientFormData } from '../schemas/patient.schema';
import type { Patient } from '../schemas/patient.schema';

export type CreatePatientRequest = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePatientRequest = Partial<CreatePatientRequest>;

export type PatientsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};
