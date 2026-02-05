"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ConversationList, ChatWindow } from "@/features/messages";
import type { Conversation } from "@/features/messages";
import {
  createConversation,
  patchConversation,
} from "@/features/messages/api/messages.api";
import {
  useConversations,
  useMessages,
  useSendMessage,
} from "@/features/messages/hooks/useMessages";
import { useAuth } from "@/lib/auth/hooks";

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const { user } = useAuth();
  const currentUserId = user?.id || "";

  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations();
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: _messagesError,
    refetch: refetchMessages,
  } = useMessages(activeConversation?.id || null);
  const { mutate: sendMessageMutation, isLoading: isSending } =
    useSendMessage();

  const conversations = conversationsData?.items || [];
  const messages = messagesData?.items || [];

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeConversation || !currentUserId) return;

      try {
        await sendMessageMutation({
          conversationId: activeConversation.id,
          type: "text",
          content,
        });
        refetchMessages();
      } catch (_error) {
        toast.error("Error al enviar mensaje");
      }
    },
    [activeConversation, currentUserId, sendMessageMutation, refetchMessages]
  );

  const handleSendAudio = useCallback(
    async (audioBlob: Blob, duration: number) => {
      if (!activeConversation || !currentUserId) return;

      const audioUrl = URL.createObjectURL(audioBlob);

      try {
        await sendMessageMutation({
          conversationId: activeConversation.id,
          type: "audio",
          content: "",
          audioUrl,
          audioDuration: duration,
        });
        refetchMessages();
      } catch (_error) {
        toast.error("Error al enviar mensaje de audio");
      }
    },
    [activeConversation, currentUserId, sendMessageMutation, refetchMessages]
  );

  const handleBack = useCallback(() => {
    setActiveConversation(null);
  }, []);

  const handleNewConversation = useCallback(async () => {
    try {
      const newConv = await createConversation();
      setActiveConversation(newConv);
      refetchConversations();
    } catch (_error) {
      toast.error("Error al crear conversación");
    }
  }, [refetchConversations]);

  const handleContextLimitChange = useCallback(
    async (conversationId: string, contextMessageLimit: number) => {
      try {
        await patchConversation(conversationId, { contextMessageLimit });
        setActiveConversation((prev) =>
          prev && prev.id === conversationId
            ? { ...prev, contextMessageLimit }
            : prev
        );
        refetchConversations();
      } catch (_error) {
        toast.error("Error al actualizar límite de contexto");
      }
    },
    [refetchConversations]
  );

  if (conversationsError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-130px)]">
        <div className="text-destructive">
          Error al cargar conversaciones: {conversationsError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] bg-background rounded-lg border overflow-hidden">
      <div
        className={`w-full md:w-80 shrink-0 ${
          activeConversation ? "hidden md:block" : "block"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversation?.id || null}
          onSelectConversation={setActiveConversation}
          onNewConversation={handleNewConversation}
          isLoading={isLoadingConversations}
        />
      </div>
      <div
        className={`flex-1 flex flex-col h-full ${
          activeConversation ? "block" : "hidden md:block"
        }`}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onSendAudio={handleSendAudio}
            onBack={handleBack}
            onContextLimitChange={handleContextLimitChange}
            isSending={isSending}
            isLoadingMessages={isLoadingMessages}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">
              Selecciona una conversación
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
