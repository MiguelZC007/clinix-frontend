'use client';

import { useState, useCallback } from 'react';
import { ConversationList, ChatWindow } from '@/features/messages';
import type { Conversation, Message } from '@/features/messages';

const CURRENT_USER_ID = 'doctor-1';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participantId: 'patient-1',
    participantName: 'Juan Pérez',
    participantInitials: 'JP',
    lastMessage: 'Gracias doctor, me siento mucho mejor',
    lastMessageType: 'text',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    participantId: 'patient-2',
    participantName: 'María González',
    participantInitials: 'MG',
    lastMessage: '',
    lastMessageType: 'audio',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '3',
    participantId: 'patient-3',
    participantName: 'Carlos López',
    participantInitials: 'CL',
    lastMessage: '¿A qué hora puedo pasar por los resultados?',
    lastMessageType: 'text',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: '4',
    participantId: 'patient-4',
    participantName: 'Ana Martínez',
    participantInitials: 'AM',
    lastMessage: 'Entendido, seguiré las indicaciones',
    lastMessageType: 'text',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '5',
    participantId: 'patient-5',
    participantName: 'Roberto Sánchez',
    participantInitials: 'RS',
    lastMessage: 'Buenos días doctor',
    lastMessageType: 'text',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    unreadCount: 0,
    isOnline: false,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'patient-1',
      type: 'text',
      content: 'Buenos días doctor, quería consultarle sobre mi tratamiento',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: CURRENT_USER_ID,
      type: 'text',
      content: 'Buenos días Juan, claro que sí. ¿Cómo se ha sentido con la medicación?',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 55),
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'patient-1',
      type: 'text',
      content: 'Me he sentido mucho mejor, ya no tengo los dolores de cabeza tan frecuentes',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      id: 'm4',
      conversationId: '1',
      senderId: CURRENT_USER_ID,
      type: 'text',
      content: 'Excelente, eso es muy buena señal. Recuerde tomar la medicación siempre a la misma hora y no suspenderla sin consultar primero.',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: 'm5',
      conversationId: '1',
      senderId: 'patient-1',
      type: 'audio',
      content: '',
      audioUrl: '/audio/message.webm',
      audioDuration: 12,
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: 'm6',
      conversationId: '1',
      senderId: 'patient-1',
      type: 'text',
      content: 'Gracias doctor, me siento mucho mejor',
      status: 'delivered',
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  '2': [
    {
      id: 'm7',
      conversationId: '2',
      senderId: CURRENT_USER_ID,
      type: 'text',
      content: 'Hola María, ¿cómo sigue su presión arterial?',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'm8',
      conversationId: '2',
      senderId: 'patient-2',
      type: 'audio',
      content: '',
      audioUrl: '/audio/message2.webm',
      audioDuration: 25,
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
  '3': [
    {
      id: 'm9',
      conversationId: '3',
      senderId: 'patient-3',
      type: 'text',
      content: 'Doctor, ya me hicieron los exámenes de sangre',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: 'm10',
      conversationId: '3',
      senderId: CURRENT_USER_ID,
      type: 'text',
      content: 'Perfecto Carlos, los resultados estarán listos mañana por la mañana',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    },
    {
      id: 'm11',
      conversationId: '3',
      senderId: 'patient-3',
      type: 'text',
      content: '¿A qué hora puedo pasar por los resultados?',
      status: 'delivered',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
};

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
