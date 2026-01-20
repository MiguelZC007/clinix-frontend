export type {
  MessageType,
  MessageStatus,
  Message,
  Conversation,
  MessageFormData,
  AudioMessageFormData,
} from '../schemas/message.schema';
import type { MessageType } from '../schemas/message.schema';

export type SendMessageRequest = {
  conversationId: string;
  type: MessageType;
  content: string;
  audioUrl?: string;
  audioDuration?: number;
};
