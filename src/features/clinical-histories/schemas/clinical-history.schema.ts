import { z } from 'zod';

export const vitalSignsSchema = z.object({
  bloodPressure: z.string(),
  heartRate: z.number(),
  temperature: z.number(),
  weight: z.number(),
  height: z.number(),
});
export type VitalSigns = z.infer<typeof vitalSignsSchema>;

export const clinicalHistorySchema = z.object({
  id: z.string(),
  patientId: z.string(),
  patientName: z.string().optional(),
  reason: z.string(),
  symptoms: z.string(),
  physicalExam: z.string(),
  diagnosis: z.string(),
  treatment: z.string(),
  notes: z.string(),
  vitalSigns: vitalSignsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ClinicalHistory = z.infer<typeof clinicalHistorySchema>;

export const vitalSignsFormSchema = z.object({
  bloodPressure: z.string().min(1, 'errors.required'),
  heartRate: z.number().min(1, 'errors.required'),
  temperature: z.number().min(0.1, 'errors.required'),
  weight: z.number().min(0.1, 'errors.required'),
  height: z.number().min(1, 'errors.required'),
});

export const clinicalHistoryFormSchema = z.object({
  patientId: z.string().min(1, 'errors.required'),
  reason: z.string().min(1, 'errors.required'),
  symptoms: z.string().min(1, 'errors.required'),
  physicalExam: z.string().min(1, 'errors.required'),
  diagnosis: z.string().min(1, 'errors.required'),
  treatment: z.string().min(1, 'errors.required'),
  notes: z.string(),
  vitalSigns: vitalSignsFormSchema,
});
export type ClinicalHistoryFormData = z.infer<typeof clinicalHistoryFormSchema>;

export const clinicalHistoriesListResponseSchema = z.object({
  items: z.array(clinicalHistorySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
