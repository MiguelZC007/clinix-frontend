import { z } from 'zod';

export const messageSchema = z.object({
  content: z.string().min(1, 'errors.required').max(1000, 'errors.maxLength'),
});

export type MessageFormData = z.infer<typeof messageSchema>;

export const audioMessageSchema = z.object({
  audioUrl: z.string().min(1),
  audioDuration: z.number().min(1),
});

export type AudioMessageFormData = z.infer<typeof audioMessageSchema>;
