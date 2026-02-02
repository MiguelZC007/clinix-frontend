"use client";

import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "../types/message.types";

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
};

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const t = useTranslations();

  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (isYesterday) {
      return t("common.yesterday");
    }
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  };

  const title =
    conversation.title ??
    conversation.summary?.slice(0, 40) ??
    t("messages.conversation");

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          <MessageSquare className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium truncate">{title}</h4>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatTime(conversation.lastActivityAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
