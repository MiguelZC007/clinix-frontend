import { describe, it, expect } from 'vitest';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} from '../api/messages.api';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '../__mocks__/messages.mock';

describe('getConversations', () => {
  it('retorna lista de conversaciones paginada', async () => {
    const result = await getConversations();
    expect(result.items).toHaveLength(MOCK_CONVERSATIONS.length);
    expect(result.total).toBe(MOCK_CONVERSATIONS.length);
  });

  it('retorna conversaciones correctamente tipadas', async () => {
    const result = await getConversations();
    expect(result.items[0]).toHaveProperty('id');
    expect(result.items[0]).toHaveProperty('participantName');
    expect(result.items[0]).toHaveProperty('unreadCount');
  });
});

describe('getMessages', () => {
  it('retorna mensajes de una conversacion', async () => {
    const result = await getMessages('1');
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]).toHaveProperty('id');
    expect(result.items[0]).toHaveProperty('content');
  });

  it('retorna lista vacia si no hay mensajes', async () => {
    const result = await getMessages('999');
    expect(result.items).toHaveLength(0);
  });
});

describe('sendMessage', () => {
  it('envia mensaje de texto correctamente', async () => {
    const message = {
      conversationId: '1',
      type: 'text' as const,
      content: 'Nuevo mensaje',
    };

    const result = await sendMessage(message);
    expect(result.content).toBe('Nuevo mensaje');
    expect(result.type).toBe('text');
    expect(result.id).toBeDefined();
  });

  it('envia mensaje de audio correctamente', async () => {
    const message = {
      conversationId: '1',
      type: 'audio' as const,
      content: '',
      audioUrl: 'https://example.com/audio.webm',
      audioDuration: 10,
    };

    const result = await sendMessage(message);
    expect(result.type).toBe('audio');
    expect(result.audioUrl).toBeDefined();
    expect(result.senderId).toBeDefined();
  });
});

describe('markAsRead', () => {
  it('marca conversacion como leida', async () => {
    await expect(markAsRead('1')).resolves.not.toThrow();
  });
});
