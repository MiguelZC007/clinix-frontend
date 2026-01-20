import { http, HttpResponse } from 'msw';
import { MOCK_PATIENTS } from '@/features/patients/__mocks__/patients.mock';
import { MOCK_APPOINTMENTS } from '@/features/appointments/__mocks__/appointments.mock';
import { MOCK_CLINICAL_HISTORIES } from '@/features/clinical-histories/__mocks__/clinical-histories.mock';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/features/messages/__mocks__/messages.mock';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

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

  http.put(`${API_BASE_URL}/patients/:id`, async ({ params, request }) => {
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
      data: patient,
      message: 'Patient deleted',
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/appointments`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        items: MOCK_APPOINTMENTS,
        total: MOCK_APPOINTMENTS.length,
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
      data: appointment,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/appointments`, async ({ request }) => {
    const body = await request.json();
    const newAppointment = {
      ...body,
      id: String(MOCK_APPOINTMENTS.length + 1),
      patientName: 'New Patient',
      patientInitials: 'NP',
      status: 'scheduled' as const,
    };
    return HttpResponse.json({
      success: true,
      data: newAppointment,
      timestamp: new Date().toISOString(),
    });
  }),

  http.get(`${API_BASE_URL}/clinical-histories`, () => {
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

  http.get(`${API_BASE_URL}/clinical-histories/:id`, ({ params }) => {
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

  http.post(`${API_BASE_URL}/clinical-histories`, async ({ request }) => {
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
    const body = await request.json() as any;
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
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'test@test.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: body.email,
            firstName: 'Test',
            lastName: 'User',
            role: 'doctor' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh-token',
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
      data: null,
      message: 'Reset link sent',
      timestamp: new Date().toISOString(),
    });
  }),

  http.post(`${API_BASE_URL}/auth/reset-password`, async () => {
    return HttpResponse.json({
      success: true,
      data: null,
      message: 'Password reset successfully',
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

  http.put(`${API_BASE_URL}/appointments/:id`, async ({ params, request }) => {
    const body = await request.json();
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
      data: { ...appointment, ...body },
      timestamp: new Date().toISOString(),
    });
  }),

  http.put(`${API_BASE_URL}/appointments/:id/cancel`, async ({ params, request }) => {
    const body = await request.json();
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
      data: { ...appointment, status: 'cancelled', ...body },
      timestamp: new Date().toISOString(),
    });
  }),

  http.put(`${API_BASE_URL}/conversations/:id/read`, async () => {
    return HttpResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  }),
];
