import { z } from 'zod';

export const messageTypeSchema = z.enum(['text', 'audio']);
export type MessageType = z.infer<typeof messageTypeSchema>;

export const messageStatusSchema = z.enum(['sending', 'sent', 'delivered', 'read']);
export type MessageStatus = z.infer<typeof messageStatusSchema>;

export const conversationSchema = z.object({
  id: z.string(),
  model: z.string(),
  systemPrompt: z.string(),
  summary: z.string().optional(),
  lastActivityAt: z.coerce.date(),
  isActive: z.boolean(),
  doctorId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contextMessageLimit: z.number().optional(),
  title: z.string().optional(),
  lastMessagePreview: z.string().optional(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const messageEntitySchema = z.object({
  id: z.string(),
  conversationId: z.string().optional(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  tokenCount: z.number(),
  readAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Message = z.infer<typeof messageEntitySchema>;

export const messageFormSchema = z.object({
  content: z.string().min(1, 'errors.required').max(1000, 'errors.maxLength'),
});
export type MessageFormData = z.infer<typeof messageFormSchema>;

export const audioMessageSchema = z.object({
  audioUrl: z.string().min(1),
  audioDuration: z.number().min(1),
});
export type AudioMessageFormData = z.infer<typeof audioMessageSchema>;
