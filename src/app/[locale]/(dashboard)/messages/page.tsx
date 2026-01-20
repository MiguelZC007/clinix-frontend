'use client';

import { useState, useCallback, useEffect } from 'react';
import { ConversationList, ChatWindow } from '@/features/messages';
import { useConversations, useMessages, useSendMessage } from '@/features/messages/hooks/useMessages';
import { useAuth } from '@/lib/auth/hooks';
import type { Conversation, Message } from '@/features/messages';
import { toast } from 'sonner';

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const { user } = useAuth();
  const currentUserId = user?.id || '';

  const { data: conversationsData, isLoading: isLoadingConversations, error: conversationsError } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages, error: messagesError, refetch: refetchMessages } = useMessages(activeConversation?.id || null);
  const { mutate: sendMessageMutation, isLoading: isSending } = useSendMessage();

  const conversations = conversationsData?.items || [];
  const messages = messagesData?.items || [];

  useEffect(() => {
    if (activeConversation && messagesData) {
      refetchMessages();
    }
  }, [activeConversation?.id]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversation || !currentUserId) return;

    try {
      await sendMessageMutation({
        conversationId: activeConversation.id,
        type: 'text',
        content,
      });
      refetchMessages();
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  }, [activeConversation, currentUserId, sendMessageMutation, refetchMessages]);

  const handleSendAudio = useCallback(async (audioBlob: Blob, duration: number) => {
    if (!activeConversation || !currentUserId) return;

    const audioUrl = URL.createObjectURL(audioBlob);

    try {
      await sendMessageMutation({
        conversationId: activeConversation.id,
        type: 'audio',
        content: '',
        audioUrl,
        audioDuration: duration,
      });
      refetchMessages();
    } catch (error) {
      toast.error('Error al enviar mensaje de audio');
    }
  }, [activeConversation, currentUserId, sendMessageMutation, refetchMessages]);

  const handleBack = useCallback(() => {
    setActiveConversation(null);
  }, []);

  if (isLoadingConversations) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-130px)]">
        <div className="text-muted-foreground">Cargando conversaciones...</div>
      </div>
    );
  }

  if (conversationsError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-130px)]">
        <div className="text-destructive">Error al cargar conversaciones: {conversationsError.message}</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] bg-background rounded-lg border overflow-hidden">
      <div className={`w-full md:w-80 shrink-0 ${activeConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={setActiveConversation}
        />
      </div>
      <div className={`flex-1 flex flex-col h-full ${activeConversation ? 'block' : 'hidden md:block'}`}>
        {activeConversation ? (
          isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Cargando mensajes...</div>
            </div>
          ) : (
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onSendAudio={handleSendAudio}
              onBack={handleBack}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Selecciona una conversación</div>
          </div>
        )}
      </div>
    </div>
  );
}
