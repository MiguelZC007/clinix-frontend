import { z } from 'zod';

export const appointmentStatusSchema = z.enum(['scheduled', 'completed', 'cancelled']);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  patientId: z.string().optional(),
  patientName: z.string(),
  patientInitials: z.string(),
  date: z.coerce.date(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string(),
  status: appointmentStatusSchema,
});
export type Appointment = z.infer<typeof appointmentSchema>;

export const appointmentFormSchema = z.object({
  patientId: z.string().min(1, 'errors.required'),
  date: z.string().min(1, 'errors.required'),
  startTime: z.string().min(1, 'errors.required'),
  endTime: z.string().min(1, 'errors.required'),
  reason: z.string().min(1, 'errors.required'),
});
export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export const appointmentsListResponseSchema = z.object({
  items: z.array(appointmentSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
});
