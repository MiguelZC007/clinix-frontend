"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ConversationList } from "@/features/messages/ui/ConversationList";
import { ChatWindow } from "@/features/messages/ui/ChatWindow";
import type { Conversation } from "@/features/messages/types/message.types";
import { createConversation } from "@/features/messages/api/messages.api";
import {
  useConversations,
  useConversation,
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
    data: conversationDetail,
    refetch: refetchConversationDetail,
  } = useConversation(activeConversation?.id ?? null);
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
  const conversationForChat = conversationDetail ?? activeConversation;

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
        refetchConversationDetail();
      } catch (_error) {
        toast.error("Error al enviar mensaje");
      }
    },
    [activeConversation, currentUserId, sendMessageMutation, refetchMessages, refetchConversationDetail]
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
        refetchConversationDetail();
      } catch (_error) {
        toast.error("Error al enviar mensaje de audio");
      }
    },
    [activeConversation, currentUserId, sendMessageMutation, refetchMessages, refetchConversationDetail]
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

  if (conversationsError) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-destructive">
          Error al cargar conversaciones: {conversationsError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 bg-background rounded-lg border overflow-hidden">
      <div
        className={`w-full shrink-0 md:w-64 lg:w-80 ${
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
            conversation={conversationForChat}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onSendAudio={handleSendAudio}
            onBack={handleBack}
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
