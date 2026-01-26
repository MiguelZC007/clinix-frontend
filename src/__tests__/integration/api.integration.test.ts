import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { api } from '@/lib/api/axios';
import { login, logout } from '@/features/auth/api/auth.api';
import {
  getPatients,
  createPatient,
  updatePatient,
  getPatientById,
  getPatientAntecedents,
  updatePatientAntecedents,
} from '@/features/patients/api/patients.api';
import {
  getClinicalHistories,
  getClinicalHistoryById,
  createClinicalHistory,
  getClinicalHistoriesByPatient,
} from '@/features/clinical-histories/api/clinical-histories.api';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsByPatient,
} from '@/features/appointments/api/appointments.api';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from '@/features/messages/api/messages.api';
import {
  sendWhatsAppMessage,
  getMessageStatus,
} from '@/features/twilio/api/whatsapp.api';
import type { CreatePatientRequest } from '@/features/patients/types/patient.types';
import type { CreateClinicalHistoryRequest } from '@/features/clinical-histories/types/clinical-history.types';
import type { CreateAppointmentRequest } from '@/features/appointments/types/appointment.types';
import type { SendMessageRequest } from '@/features/messages/types/message.types';
import { server } from '../mocks/server';

vi.mock('@/lib/api/axios', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/api/axios')>();
  return {
    ...original,
    getAuthToken: async () => process.env.TEST_ACCESS_TOKEN ?? null,
  };
});

describe.sequential('API endpoints', () => {
  const baseUrl = process.env.NEXT_API_URL ?? 'http://localhost:4000/v1';
  const testPhone = process.env.TEST_PHONE;
  const testPassword = process.env.TEST_PASSWORD;
  let token: string = process.env.TEST_ACCESS_TOKEN ?? '';
  const tokenWasProvided = Boolean(token);

  if (!token && (!testPhone || !testPassword)) {
    throw new Error('Define TEST_PHONE y TEST_PASSWORD en el entorno para ejecutar estas pruebas');
  }

  let lastAuthHeader: string | undefined;
  let interceptorId: number | undefined;
  let patientId: string | undefined;
  let clinicalHistoryId: string | undefined;
  let appointmentId: string | undefined;
  let conversationId: string | undefined;
  let whatsappMessageSid: string | undefined;

  const expectAuthHeader = (currentToken: string) => {
    expect(lastAuthHeader).toBe(`Bearer ${currentToken}`);
  };

  const buildPatientPayload = (): CreatePatientRequest => ({
    firstName: 'Paciente',
    lastName: 'Prueba',
    document: `DOC-${Date.now()}`,
    birthDate: '1990-01-01',
    gender: 'male',
    phone: '3000000000',
    email: `paciente-${Date.now()}@example.com`,
    address: 'Dirección de prueba',
  });

  const buildClinicalHistoryPayload = (patient: string): CreateClinicalHistoryRequest => ({
    patientId: patient,
    reason: 'Control de prueba',
    symptoms: 'Síntoma de prueba',
    physicalExam: 'Examen normal',
    diagnosis: 'Diagnóstico de prueba',
    treatment: 'Tratamiento de prueba',
    notes: 'Notas de prueba',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 70,
      temperature: 36.5,
      weight: 70,
      height: 170,
    },
  });

  const buildAppointmentPayload = (patient: string): CreateAppointmentRequest => ({
    patientId: patient,
    date: new Date().toISOString().slice(0, 10),
    startTime: '10:00',
    endTime: '10:30',
    reason: 'Cita de prueba',
  });

  const captureAuthHeader = () => {
    interceptorId = api.interceptors.request.use((config) => {
      const header =
        (config.headers?.Authorization as string | undefined) ??
        (config.headers as Record<string, unknown> | undefined)?.authorization;
      lastAuthHeader = typeof header === 'string' ? header : undefined;
      return config;
    });
  };

  beforeAll(() => {
    server.close();
    api.defaults.baseURL = baseUrl;
    captureAuthHeader();
  });

  afterAll(async () => {
    if (interceptorId !== undefined) {
      api.interceptors.request.eject(interceptorId);
    }
    if (token && !tokenWasProvided) {
      try {
        await logout();
      } catch {
        // Ignorar errores de cierre de sesión para no enmascarar resultados previos
      }
    }
  });

  it('realiza login y obtiene token', async () => {
    if (token) {
      expect(token.length).toBeGreaterThan(10);
      return;
    }
    const response = await login({ phone: testPhone, password: testPassword });
    token = response.accessToken;
    process.env.TEST_ACCESS_TOKEN = token;
    expect(token.length).toBeGreaterThan(10);
  });

  it('pacientes: lista y CRUD básico con token', async () => {
    const patients = await getPatients();
    expectAuthHeader(token);

    patientId = patients.items[0]?.id;

    if (!patientId) {
      const created = await createPatient(buildPatientPayload());
      expectAuthHeader(token);
      patientId = created.id;
    }

    const fetched = await getPatientById(patientId as string);
    expectAuthHeader(token);
    expect(fetched.id).toBe(patientId);

    const updated = await updatePatient(patientId as string, { address: 'Dirección actualizada' });
    expectAuthHeader(token);
    expect(updated.address).toBeDefined();

    const antecedents = await getPatientAntecedents(patientId as string);
    expectAuthHeader(token);
    await updatePatientAntecedents(patientId as string, {
      allergies: [...(antecedents.allergies ?? []), 'Polen'],
    });
    expectAuthHeader(token);
  }, 30000);

  it('historias clínicas: crea y consulta', async () => {
    const history = await createClinicalHistory(buildClinicalHistoryPayload(patientId as string));
    expectAuthHeader(token);
    clinicalHistoryId = history.id;

    const fetched = await getClinicalHistoryById(clinicalHistoryId);
    expectAuthHeader(token);
    expect(fetched.id).toBe(clinicalHistoryId);

    const listByPatient = await getClinicalHistoriesByPatient(patientId as string);
    expectAuthHeader(token);
    expect(Array.isArray(listByPatient)).toBe(true);

    const list = await getClinicalHistories();
    expectAuthHeader(token);
    expect(list.items.length).toBeGreaterThan(0);
  }, 30000);

  it('citas: crea, actualiza, cancela y consulta', async () => {
    const created = await createAppointment(buildAppointmentPayload(patientId as string));
    expectAuthHeader(token);
    appointmentId = created.id;

    const updated = await updateAppointment(appointmentId as string, { reason: 'Cita actualizada' });
    expectAuthHeader(token);
    expect(updated.reason).toBeDefined();

    const fetched = await getAppointmentById(appointmentId as string);
    expectAuthHeader(token);
    expect(fetched.id).toBe(appointmentId);

    const byPatient = await getAppointmentsByPatient(patientId as string);
    expectAuthHeader(token);
    expect(Array.isArray(byPatient)).toBe(true);

    const cancelled = await cancelAppointment(appointmentId as string);
    expectAuthHeader(token);
    expect(cancelled.status).toBeDefined();

    const list = await getAppointments();
    expectAuthHeader(token);
    expect(list.items.length).toBeGreaterThan(0);
  }, 30000);

  it('mensajes: conversaciones, mensajes y lectura', async () => {
    const conversations = await getConversations();
    expectAuthHeader(token);
    conversationId = conversations.items[0]?.id;

    if (!conversationId) {
      console.warn('No hay conversaciones disponibles; se omiten pruebas de mensajes');
      return;
    }

    const messages = await getMessages(conversationId);
    expectAuthHeader(token);
    if (messages.items.length > 0) {
      await markAsRead(conversationId);
      expectAuthHeader(token);
    }

    const sendPayload: SendMessageRequest = {
      conversationId,
      type: 'text',
      content: 'Mensaje de prueba',
    };
    const sent = await sendMessage(sendPayload);
    expectAuthHeader(token);
    expect(sent.conversationId).toBe(conversationId);
  });

  it('twilio: envío y consulta de estado (condicional)', async () => {
    const to = process.env.TEST_TWILIO_TO;
    const body = process.env.TEST_TWILIO_BODY ?? 'Mensaje de prueba';

    if (!to) {
      console.warn('TEST_TWILIO_TO no está definido; se omiten pruebas de Twilio');
      return;
    }

    const sent = await sendWhatsAppMessage({ to, body });
    expectAuthHeader(token);
    whatsappMessageSid = sent.messageSid;

    const status = await getMessageStatus(whatsappMessageSid);
    expectAuthHeader(token);
    expect(status.sid).toBe(whatsappMessageSid);
  });

  it('logout invalida sesión', async () => {
    if (tokenWasProvided) {
      console.warn('TEST_ACCESS_TOKEN fue provisto; se omite logout para no revocar el token');
      return;
    }
    await logout();
    expectAuthHeader(token);
    token = '';
    process.env.TEST_ACCESS_TOKEN = '';
  });
});
