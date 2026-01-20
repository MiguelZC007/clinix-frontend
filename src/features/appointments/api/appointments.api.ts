import { client } from '@/lib/api/client';
import { ApiResponseSchema } from '@/types/contracts/api-response';
import { appointmentSchema, appointmentsListResponseSchema } from '../schemas/appointment.schema';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentsListParams } from '../types/appointment.types';
import type { PaginatedData } from '@/types/contracts/api-response';

const ENDPOINT = '/appointments';

export async function getAppointments(params?: AppointmentsListParams): Promise<PaginatedData<Appointment>> {
  const response = await client.get(
    ENDPOINT,
    ApiResponseSchema(appointmentsListResponseSchema),
    { params }
  );
  return response.data;
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const response = await client.get(
    `${ENDPOINT}/${id}`,
    ApiResponseSchema(appointmentSchema)
  );
  return response.data;
}

export async function createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
  const response = await client.post(
    ENDPOINT,
    data,
    ApiResponseSchema(appointmentSchema)
  );
  return response.data;
}

export async function updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
  const response = await client.put(
    `${ENDPOINT}/${id}`,
    data,
    ApiResponseSchema(appointmentSchema)
  );
  return response.data;
}

export async function cancelAppointment(id: string, reason: string): Promise<Appointment> {
  const response = await client.put(
    `${ENDPOINT}/${id}/cancel`,
    { reason },
    ApiResponseSchema(appointmentSchema)
  );
  return response.data;
}
