import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(1, 'errors.required'),
  password: z.string().min(6, 'errors.minLength'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
