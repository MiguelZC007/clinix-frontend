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

  const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${t("common.today")}, ${time}`;
    }
    if (isYesterday) {
      return t("common.yesterday");
    }
    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  };

  const displayDate = formatDate(conversation.lastActivityAt);
  const preview =
    conversation.lastMessagePreview?.trim() ??
    conversation.summary?.trim() ??
    conversation.title?.trim() ??
    "";

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-muted/50",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <Avatar className="h-9 w-9 shrink-0 md:h-12 md:w-12">
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          <MessageSquare className="h-4 w-4 md:h-6 md:w-6" />
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{displayDate}</span>
        {preview ? (
          <p
            className="line-clamp-2 text-xs text-muted-foreground"
            title={preview}
          >
            {preview}
          </p>
        ) : null}
      </div>
    </div>
  );
}
