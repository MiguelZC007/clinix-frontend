import { describe, it, expect } from 'vitest';
import { MOCK_CONVERSATIONS } from '../__mocks__/messages.mock';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  patchConversation,
} from '../api/messages.api';

describe('getConversations', () => {
  it('retorna lista de conversaciones paginada', async () => {
    const result = await getConversations();
    expect(result.items).toHaveLength(MOCK_CONVERSATIONS.length);
    expect(result.total).toBe(MOCK_CONVERSATIONS.length);
  });

  it('retorna conversaciones correctamente tipadas', async () => {
    const result = await getConversations();
    expect(result.items[0]).toHaveProperty('id');
    expect(result.items[0]).toHaveProperty('title');
    expect(result.items[0]).toHaveProperty('lastActivityAt');
    expect(result.items[0]).toHaveProperty('contextMessageLimit');
  });
});

describe('getMessages', () => {
  it('retorna mensajes de una conversacion', async () => {
    const result = await getMessages('1');
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]).toHaveProperty('id');
    expect(result.items[0]).toHaveProperty('content');
    expect(result.items[0]).toHaveProperty('role');
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
    expect(result.role).toBe('user');
    expect(result.id).toBeDefined();
  });
});

describe('patchConversation', () => {
  it('actualiza contextMessageLimit', async () => {
    const result = await patchConversation('1', { contextMessageLimit: 20 });
    expect(result.contextMessageLimit).toBe(20);
    expect(result.id).toBe('1');
  });
});

describe('markAsRead', () => {
  it('marca conversacion como leida', async () => {
    await expect(markAsRead('1')).resolves.not.toThrow();
  });
});
