"use client";

import { useState } from "react";
import { Search, MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "../types/message.types";

const CONVERSATION_SKELETON_COUNT = 7;

type ConversationListProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation?: () => void;
  isLoading?: boolean;
};

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading = false,
}: ConversationListProps) {
  const t = useTranslations();
  const [search, setSearch] = useState("");

  const searchLower = search.toLowerCase();
  const filteredConversations = conversations.filter((conv) => {
    const title = conv.title ?? conv.summary ?? "";
    return title.toLowerCase().includes(searchLower);
  });

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t("messages.title")}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewConversation}
            title={t("messages.newConversation")}
            aria-label={t("messages.newConversation")}
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("messages.searchConversations")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: CONVERSATION_SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3"
              >
                <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <p className="text-muted-foreground">
              {t("messages.noConversations")}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
