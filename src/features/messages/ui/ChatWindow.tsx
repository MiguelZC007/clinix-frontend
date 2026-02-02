"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import type { Conversation, Message } from "../types/message.types";

const CONTEXT_LIMIT_OPTIONS = [5, 10, 20, 50] as const;

type ChatWindowProps = {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  onBack?: () => void;
  onContextLimitChange?: (
    conversationId: string,
    contextMessageLimit: number
  ) => void;
  isSending?: boolean;
  isLoadingMessages?: boolean;
};

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onSendAudio,
  onBack,
  onContextLimitChange,
  isSending = false,
  isLoadingMessages = false,
}: ChatWindowProps) {
  const t = useTranslations();
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/30">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-lg text-muted-foreground">
          {t("messages.noMessages")}
        </p>
      </div>
    );
  }

  const title =
    conversation.title ??
    conversation.summary?.slice(0, 50) ??
    t("messages.conversation");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              <MessageSquare className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium truncate max-w-[200px]">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {t("messages.assistant")}
            </p>
          </div>
        </div>
        {onContextLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {t("messages.contextLimit")}
            </span>
            <Select
              value={String(conversation.contextMessageLimit ?? 10)}
              onValueChange={(v) =>
                onContextLimitChange(conversation.id, Number(v))
              }
            >
              <SelectTrigger className="w-[90px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTEXT_LIMIT_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0 p-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              {t("messages.loadingMessages")}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.role === "user"}
              />
            ))}
            {isSending && (
              <div className="flex justify-start mb-2">
                <div className="max-w-[70%] rounded-2xl px-4 py-2 bg-muted rounded-bl-md">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                    {t("messages.assistantWriting")}
                  </p>
                </div>
              </div>
            )}
            <div ref={scrollAnchorRef} />
          </div>
        )}
      </ScrollArea>

      <MessageInput
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
        disabled={isSending}
      />
    </div>
  );
}
