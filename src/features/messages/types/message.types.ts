export type MessageType = 'text' | 'audio';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  audioUrl?: string;
  audioDuration?: number;
  status: MessageStatus;
  createdAt: Date;
};

export type Conversation = {
  id: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageType?: MessageType;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
};

export type SendMessageRequest = {
  conversationId: string;
  type: MessageType;
  content: string;
  audioUrl?: string;
  audioDuration?: number;
};
