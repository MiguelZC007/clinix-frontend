export type { AppointmentStatus, Appointment, AppointmentFormData } from '../schemas/appointment.schema';
import type { AppointmentStatus } from '../schemas/appointment.schema';

export type CreateAppointmentRequest = {
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
};

export type UpdateAppointmentRequest = Partial<CreateAppointmentRequest>;

export type AppointmentsListParams = {
  page?: number;
  pageSize?: number;
  date?: string;
  status?: AppointmentStatus;
};

export type CalendarView = 'day' | 'week' | 'month';
