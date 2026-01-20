import { z } from 'zod';
import { client } from '@/lib/api/client';
import { ApiResponseSchema, MessageResponseSchema } from '@/types/contracts/api-response';
import type { LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth.types';

const ENDPOINT = '/auth';

const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(['admin', 'doctor', 'nurse', 'receptionist']),
    avatar: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post(
    `${ENDPOINT}/login`,
    data,
    ApiResponseSchema(loginResponseSchema)
  );
  return response.data;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await client.post(
    `${ENDPOINT}/forgot-password`,
    data,
    MessageResponseSchema
  );
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await client.post(
    `${ENDPOINT}/reset-password`,
    data,
    MessageResponseSchema
  );
}

export async function logout(): Promise<void> {
  await client.post(
    `${ENDPOINT}/logout`,
    {},
    MessageResponseSchema
  );
}
