export type Gender = 'male' | 'female' | 'other';

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  birthDate: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePatientRequest = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePatientRequest = Partial<CreatePatientRequest>;

export type PatientsListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};
