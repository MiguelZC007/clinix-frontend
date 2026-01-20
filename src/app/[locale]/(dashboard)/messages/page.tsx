'use client';

import { useState, useCallback } from 'react';
import { ConversationList, ChatWindow } from '@/features/messages';
import { CURRENT_USER_ID, MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/features/messages/__mocks__/messages.mock';
import type { Conversation, Message } from '@/features/messages';

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  const currentMessages = activeConversation ? messages[activeConversation.id] || [] : [];

  const handleSendMessage = useCallback((content: string) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: CURRENT_USER_ID,
      type: 'text',
      content,
      status: 'sending',
      createdAt: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMessage],
    }));

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeConversation.id]: prev[activeConversation.id].map((m) =>
          m.id === newMessage.id ? { ...m, status: 'sent' as const } : m
        ),
      }));
    }, 500);
  }, [activeConversation]);

  const handleSendAudio = useCallback((audioBlob: Blob, duration: number) => {
    if (!activeConversation) return;

    const audioUrl = URL.createObjectURL(audioBlob);

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: CURRENT_USER_ID,
      type: 'audio',
      content: '',
      audioUrl,
      audioDuration: duration,
      status: 'sending',
      createdAt: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeConversation.id]: [...(prev[activeConversation.id] || []), newMessage],
    }));

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [activeConversation.id]: prev[activeConversation.id].map((m) =>
          m.id === newMessage.id ? { ...m, status: 'sent' as const } : m
        ),
      }));
    }, 500);
  }, [activeConversation]);

  const handleBack = useCallback(() => {
    setActiveConversation(null);
  }, []);

  return (
    <div className="flex h-[calc(100vh-130px)] bg-background rounded-lg border overflow-hidden">
      <div className={`w-full md:w-80 shrink-0 ${activeConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationList
          conversations={MOCK_CONVERSATIONS}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={setActiveConversation}
        />
      </div>
      <div className={`flex-1 flex flex-col h-full ${activeConversation ? 'block' : 'hidden md:block'}`}>
        <ChatWindow
          conversation={activeConversation}
          messages={currentMessages}
          currentUserId={CURRENT_USER_ID}
          onSendMessage={handleSendMessage}
          onSendAudio={handleSendAudio}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
