import { z } from 'zod';
import { client } from '@/lib/api/client';
import { ApiResponseSchema, MessageResponseSchema } from '@/types/contracts/api-response';
import type { LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth.types';

const ENDPOINT = '/auth';

const loginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }),
  accessToken: z.string(),
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
