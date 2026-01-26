import { z } from 'zod';
import { client } from '@/lib/api/client';
import { ApiResponseSchema, PaginatedResponseSchema } from '@/types/contracts/api-response';
import { messageEntitySchema, conversationSchema } from '../schemas/message.schema';
import type { Message, Conversation, SendMessageRequest } from '../types/message.types';
import type { PaginatedData } from '@/types/contracts/api-response';

const CONVERSATIONS_ENDPOINT = '/conversations';
const MESSAGES_ENDPOINT = '/messages';

export async function getConversations(): Promise<PaginatedData<Conversation>> {
  const response = await client.get(
    CONVERSATIONS_ENDPOINT,
    PaginatedResponseSchema(conversationSchema)
  );
  return response.data;
}

export async function getMessages(conversationId: string): Promise<PaginatedData<Message>> {
  const response = await client.get(
    `${CONVERSATIONS_ENDPOINT}/${conversationId}${MESSAGES_ENDPOINT}`,
    PaginatedResponseSchema(messageEntitySchema)
  );
  return response.data;
}

export async function sendMessage(data: SendMessageRequest): Promise<Message> {
  const response = await client.post(
    MESSAGES_ENDPOINT,
    data,
    ApiResponseSchema(messageEntitySchema)
  );
  return response.data;
}

export async function markAsRead(conversationId: string): Promise<void> {
  await client.put(
    `${CONVERSATIONS_ENDPOINT}/${conversationId}/read`,
    {},
    z.object({ success: z.boolean() })
  );
}
