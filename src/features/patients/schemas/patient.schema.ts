import { z } from 'zod';

export const genderSchema = z.enum(['male', 'female']);
type Gender = z.infer<typeof genderSchema>;

export const patientSchema = z.object({
  id: z.string(),
  patientNumber: z.number().optional(),
  email: z.string().min(1).max(255).email(),
  name: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string().optional(),
  gender: genderSchema.optional(),
  birthDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Patient = z.infer<typeof patientSchema>;

export const patientFormSchema = z.object({
  name: z.string().min(1, 'errors.required').min(2, 'errors.minLength'),
  lastName: z.string().min(1, 'errors.required').min(2, 'errors.minLength'),
  birthDate: z.string().optional(),
  gender: genderSchema.optional(),
  phone: z.string().min(1, 'errors.required'),
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
  address: z.string().min(1, 'errors.required'),
  password: z.string().min(6).optional(),
});
export type PatientFormData = z.infer<typeof patientFormSchema>;

export const patientsListResponseSchema = z.object({
  items: z.array(patientSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});

export const patientAntecedentsSchema = z.object({
  patientId: z.string(),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  medicalHistory: z.array(z.string()),
  familyHistory: z.array(z.string()),
  updatedAt: z.string(),
});

export type PatientAntecedents = z.infer<typeof patientAntecedentsSchema>;

export const updatePatientAntecedentsRequestSchema = z.object({
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  medicalHistory: z.array(z.string()).optional(),
  familyHistory: z.array(z.string()).optional(),
});

export type UpdatePatientAntecedentsRequest = z.infer<typeof updatePatientAntecedentsRequestSchema>;
