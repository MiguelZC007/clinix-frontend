import { http, HttpResponse } from 'msw';
import { MOCK_PATIENTS } from '@/features/patients/__mocks__/patients.mock';
import { MOCK_APPOINTMENTS } from '@/features/appointments/__mocks__/appointments.mock';
import { MOCK_CLINICAL_HISTORIES } from '@/features/clinical-histories/__mocks__/clinical-histories.mock';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/features/messages/__mocks__/messages.mock';
import type { Appointment } from '@/features/appointments/types/appointment.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

function convertAppointmentToBackendFormat(appointment: Appointment) {
  const [startHours, startMinutes] = appointment.startTime.split(':').map(Number);
  const [endHours, endMinutes] = appointment.endTime.split(':').map(Number);
  
  const startAppointment = new Date(appointment.date);
  startAppointment.setHours(startHours, startMinutes, 0, 0);
  
  const endAppointment = new Date(appointment.date);
  endAppointment.setHours(endHours, endMinutes, 0, 0);
  
  const [firstName, ...lastNameParts] = appointment.patientName.split(' ');
  const lastName = lastNameParts.join(' ');
  
  const statusMap: Record<string, string> = {
    scheduled: 'SCHEDULED',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
    pending: 'PENDING',
  };
  
  const patientId = appointment.patientId || `patient-${appointment.id}`;
  
  return {
    id: appointment.id,
    patientId: patientId,
    doctorId: appointment.doctorId,
    specialtyId: appointment.specialtyId,
    startAppointment: startAppointment.toISOString(),
    endAppointment: endAppointment.toISOString(),
    reason: appointment.reason,
    status: statusMap[appointment.status] || 'PENDING',
    patient: {
      id: patientId,
      name: firstName,
      lastName: lastName,
    },
    doctor: appointment.doctor,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
}

export const handlers = [
  http.get(`${API_BASE_URL}/patients`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: MOCK_PATIENTS,
        total: MOCK_PATIENTS.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/patients/:id`, ({ params }) => {
    const patient = MOCK_PATIENTS.find((p) => p.id === params.id);
    if (!patient) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Patient not found',
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: patient,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/patients`, async ({ request }) => {
    const body = await request.json();
    const newPatient = {
      ...body,
      id: String(MOCK_PATIENTS.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      data: newPatient,
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch(`${API_BASE_URL}/patients/:id`, async ({ params, request }) => {
    const body = await request.json();
    const patient = MOCK_PATIENTS.find((p) => p.id === params.id);
    if (!patient) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Patient not found',
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { ...patient, ...body, updatedAt: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    });
  }),

  http.delete(`${API_BASE_URL}/patients/:id`, ({ params }) => {
    const patient = MOCK_PATIENTS.find((p) => p.id === params.id);
    if (!patient) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Patient not found',
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: { deleted: true, id: params.id as string },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/patients/:id/antecedents`, ({ params }) => {
    const patient = MOCK_PATIENTS.find((p) => p.id === params.id);
    if (!patient) {
      return HttpResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        patientId: params.id as string,
        allergies: ['Penicilina'],
        medications: [],
        medicalHistory: [],
        familyHistory: [],
        updatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.put(`${API_BASE_URL}/patients/:id/antecedents`, async ({ params, request }) => {
    const patient = MOCK_PATIENTS.find((p) => p.id === params.id);
    if (!patient) {
      return HttpResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }
    const body = (await request.json()) as Record<string, unknown>;
    const allergies = Array.isArray(body.allergies) ? body.allergies : [];
    const medications = Array.isArray(body.medications) ? body.medications : [];
    const medicalHistory = Array.isArray(body.medicalHistory) ? body.medicalHistory : [];
    const familyHistory = Array.isArray(body.familyHistory) ? body.familyHistory : [];
    return HttpResponse.json({
      success: true,
      data: {
        patientId: params.id as string,
        allergies,
        medications,
        medicalHistory,
        familyHistory,
        updatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/patients/:id/clinic-histories`, ({ params }) => {
    const byPatient = MOCK_CLINICAL_HISTORIES.filter((h) => h.patientId === params.id);
    return HttpResponse.json({
      success: true,
      data: byPatient,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/patients/:id/appointments`, ({ params }) => {
    const byPatient = MOCK_APPOINTMENTS.filter((a) => a.patientId === params.id);
    const backendAppointments = byPatient.map(convertAppointmentToBackendFormat);
    return HttpResponse.json({
      success: true,
      data: backendAppointments,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/appointments`, () => {
    const backendAppointments = MOCK_APPOINTMENTS.map(convertAppointmentToBackendFormat);
    return HttpResponse.json({
      success: true,
      data: {
        items: backendAppointments,
        total: backendAppointments.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/appointments/:id`, ({ params }) => {
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === params.id);
    if (!appointment) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: convertAppointmentToBackendFormat(appointment),
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/appointments`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newAppointment = {
      id: String(MOCK_APPOINTMENTS.length + 1),
      patientId: body.patientId || '',
      doctorId: body.doctorId,
      specialtyId: body.specialtyId,
      startAppointment: body.startAppointment || new Date().toISOString(),
      endAppointment: body.endAppointment || new Date().toISOString(),
      reason: body.reason || '',
      status: 'PENDING',
      patient: body.patient || {
        id: body.patientId || '',
        name: 'New',
        lastName: 'Patient',
      },
      doctor: body.doctor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      data: newAppointment,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/clinic-histories`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: MOCK_CLINICAL_HISTORIES,
        total: MOCK_CLINICAL_HISTORIES.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/clinic-histories/:id`, ({ params }) => {
    const history = MOCK_CLINICAL_HISTORIES.find((h) => h.id === params.id);
    if (!history) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Clinical history not found',
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: history,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/clinic-histories`, async ({ request }) => {
    const body = await request.json();
    const newHistory = {
      ...body,
      id: String(MOCK_CLINICAL_HISTORIES.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      data: newHistory,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/conversations`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: MOCK_CONVERSATIONS,
        total: MOCK_CONVERSATIONS.length,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/conversations/:id/messages`, ({ params }) => {
    const messages = MOCK_MESSAGES[params.id as string] || [];
    return HttpResponse.json({
      success: true,
      data: {
        items: messages,
        total: messages.length,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/messages`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newMessage = {
      id: `m-${Date.now()}`,
      conversationId: body.conversationId,
      senderId: body.senderId || 'doctor-1',
      type: body.type,
      content: body.content || '',
      audioUrl: body.audioUrl,
      audioDuration: body.audioDuration,
      status: 'sent' as const,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      data: newMessage,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { phone: string; password: string };
    if (body.phone === '+584241234567' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Test',
            lastName: 'User',
            phone: body.phone,
            email: 'test@test.com',
          },
          accessToken: 'mock-token',
        },
        timestamp: new Date().toISOString(),
      });
    }
    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
      },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE_URL}/auth/forgot-password`, async () => {
    return HttpResponse.json({
      success: true,
      data: {
        message:
          'Si el número está registrado, recibirás un código por WhatsApp en los próximos minutos.',
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/auth/reset-password`, async () => {
    return HttpResponse.json({
      success: true,
      data: { message: 'Contraseña actualizada correctamente' },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/auth/logout`, async () => {
    return HttpResponse.json({
      success: true,
      data: null,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch(`${API_BASE_URL}/appointments/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === params.id);
    if (!appointment) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }
    const updated = { ...appointment, ...body };
    return HttpResponse.json({
      success: true,
      data: convertAppointmentToBackendFormat(updated),
      timestamp: new Date().toISOString(),
    });
  }),

  http.put(`${API_BASE_URL}/appointments/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === params.id);
    if (!appointment) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }
    const updated = { ...appointment, ...body };
    return HttpResponse.json({
      success: true,
      data: convertAppointmentToBackendFormat(updated),
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/appointments/:id/cancel`, async ({ params }) => {
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === params.id);
    if (!appointment) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }
    const cancelled = { ...appointment, status: 'cancelled' as const };
    return HttpResponse.json({
      success: true,
      data: convertAppointmentToBackendFormat(cancelled),
      timestamp: new Date().toISOString(),
    });
  }),

  http.put(`${API_BASE_URL}/appointments/:id/cancel`, async ({ params }) => {
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === params.id);
    if (!appointment) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Appointment not found',
        },
        { status: 404 }
      );
    }
    const cancelled = { ...appointment, status: 'cancelled' as const };
    return HttpResponse.json({
      success: true,
      data: convertAppointmentToBackendFormat(cancelled),
      timestamp: new Date().toISOString(),
    });
  }),

  http.put(`${API_BASE_URL}/conversations/:id/read`, async () => {
    return HttpResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/twilio/whatsapp/send`, async ({ request }) => {
    const body = (await request.json()) as { to?: string; body?: string };
    if (!body.to || !body.body) {
      return HttpResponse.json(
        { success: false, message: 'to and body are required' },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        messageSid: `SM${Date.now()}`,
        status: 'queued',
        to: body.to,
        from: 'whatsapp:+15675871709',
        body: body.body,
        dateCreated: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/twilio/message/:messageSid/status`, ({ params }) => {
    const messageSid = params.messageSid as string;
    if (!messageSid || messageSid.length < 10) {
      return HttpResponse.json(
        { success: false, message: 'Invalid messageSid' },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        sid: messageSid,
        status: 'delivered',
        to: 'whatsapp:+59170000001',
        from: 'whatsapp:+15675871709',
        body: 'Test message',
        dateCreated: new Date().toISOString(),
        dateSent: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),
];
