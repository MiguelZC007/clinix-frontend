import { describe, it, expect } from 'vitest';
import {
  messageTypeSchema,
  messageStatusSchema,
  messageEntitySchema,
  conversationSchema,
  messageFormSchema,
  audioMessageSchema,
} from '../schemas/message.schema';

describe('messageTypeSchema', () => {
  it('valida tipos validos', () => {
    expect(messageTypeSchema.parse('text')).toBe('text');
    expect(messageTypeSchema.parse('audio')).toBe('audio');
  });

  it('rechaza tipos invalidos', () => {
    expect(() => messageTypeSchema.parse('invalid')).toThrow();
  });
});

describe('messageStatusSchema', () => {
  it('valida estados validos', () => {
    expect(messageStatusSchema.parse('sending')).toBe('sending');
    expect(messageStatusSchema.parse('sent')).toBe('sent');
    expect(messageStatusSchema.parse('delivered')).toBe('delivered');
    expect(messageStatusSchema.parse('read')).toBe('read');
  });

  it('rechaza estados invalidos', () => {
    expect(() => messageStatusSchema.parse('invalid')).toThrow();
  });
});

describe('messageEntitySchema', () => {
  const validMessage = {
    id: '1',
    conversationId: '1',
    senderId: 'user-1',
    type: 'text' as const,
    content: 'Hello',
    status: 'sent' as const,
    createdAt: new Date(),
  };

  it('valida mensaje completo correctamente', () => {
    const result = messageEntitySchema.parse({
      ...validMessage,
      createdAt: validMessage.createdAt.toISOString(),
    });
    expect(result.id).toBe('1');
    expect(result.content).toBe('Hello');
  });

  it('acepta audioUrl opcional', () => {
    const messageWithAudio = {
      ...validMessage,
      type: 'audio' as const,
      audioUrl: 'https://example.com/audio.webm',
      audioDuration: 10,
      createdAt: validMessage.createdAt.toISOString(),
    };
    expect(messageEntitySchema.parse(messageWithAudio)).toBeDefined();
  });

  it('rechaza mensaje sin campos requeridos', () => {
    expect(() => messageEntitySchema.parse({})).toThrow();
  });
});

describe('conversationSchema', () => {
  const validConversation = {
    id: '1',
    participantId: 'user-1',
    participantName: 'Juan Pérez',
    participantInitials: 'JP',
    unreadCount: 0,
    isOnline: true,
  };

  it('valida conversacion completa correctamente', () => {
    expect(conversationSchema.parse(validConversation)).toEqual(
      validConversation
    );
  });

  it('acepta campos opcionales', () => {
    const conversationWithOptional = {
      ...validConversation,
      participantAvatar: 'https://example.com/avatar.jpg',
      lastMessage: 'Hello',
      lastMessageType: 'text' as const,
      lastMessageTime: new Date().toISOString(),
    };
    expect(conversationSchema.parse(conversationWithOptional)).toBeDefined();
  });
});

describe('messageFormSchema', () => {
  const validFormData = {
    content: 'Hello world',
  };

  it('valida formulario correctamente', () => {
    expect(messageFormSchema.parse(validFormData)).toEqual(validFormData);
  });

  it('rechaza contenido vacio', () => {
    expect(() => messageFormSchema.parse({ content: '' })).toThrow();
  });

  it('rechaza contenido muy largo', () => {
    expect(() =>
      messageFormSchema.parse({ content: 'a'.repeat(1001) })
    ).toThrow();
  });
});

describe('audioMessageSchema', () => {
  const validAudio = {
    audioUrl: 'https://example.com/audio.webm',
    audioDuration: 10,
  };

  it('valida mensaje de audio correctamente', () => {
    expect(audioMessageSchema.parse(validAudio)).toEqual(validAudio);
  });

  it('rechaza audioUrl vacio', () => {
    expect(() =>
      audioMessageSchema.parse({ ...validAudio, audioUrl: '' })
    ).toThrow();
  });

  it('rechaza audioDuration menor a 1', () => {
    expect(() =>
      audioMessageSchema.parse({ ...validAudio, audioDuration: 0 })
    ).toThrow();
  });
});
