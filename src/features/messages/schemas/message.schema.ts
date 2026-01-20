import { z } from 'zod';

export const messageTypeSchema = z.enum(['text', 'audio']);
export type MessageType = z.infer<typeof messageTypeSchema>;

export const messageStatusSchema = z.enum(['sending', 'sent', 'delivered', 'read']);
export type MessageStatus = z.infer<typeof messageStatusSchema>;

export const messageEntitySchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  type: messageTypeSchema,
  content: z.string(),
  audioUrl: z.string().optional(),
  audioDuration: z.number().optional(),
  status: messageStatusSchema,
  createdAt: z.coerce.date(),
});
export type Message = z.infer<typeof messageEntitySchema>;

export const conversationSchema = z.object({
  id: z.string(),
  participantId: z.string(),
  participantName: z.string(),
  participantInitials: z.string(),
  participantAvatar: z.string().optional(),
  lastMessage: z.string().optional(),
  lastMessageType: messageTypeSchema.optional(),
  lastMessageTime: z.coerce.date().optional(),
  unreadCount: z.number(),
  isOnline: z.boolean(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const messageFormSchema = z.object({
  content: z.string().min(1, 'errors.required').max(1000, 'errors.maxLength'),
});
export type MessageFormData = z.infer<typeof messageFormSchema>;

export const audioMessageSchema = z.object({
  audioUrl: z.string().min(1),
  audioDuration: z.number().min(1),
});
export type AudioMessageFormData = z.infer<typeof audioMessageSchema>;
