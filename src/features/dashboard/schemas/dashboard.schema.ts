import { z } from 'zod';

export const recentConsultationSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  patientLastName: z.string(),
  consultationReason: z.string(),
  createdAt: z.string(),
});

export const dashboardSummarySchema = z.object({
  patientsCount: z.number(),
  appointmentsThisWeek: z.number(),
  totalHistories: z.number(),
  consultationsToday: z.number(),
  recentConsultations: z.array(recentConsultationSchema),
});

export type DashboardSummarySchema = z.infer<typeof dashboardSummarySchema>;
export type RecentConsultationSchema = z.infer<typeof recentConsultationSchema>;
