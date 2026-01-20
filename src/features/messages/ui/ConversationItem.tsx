'use client';

import { useTranslations } from 'next-intl';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Conversation } from '../types/message.types';

type ConversationItemProps = {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
};

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const t = useTranslations();

  const formatTime = (date: Date | undefined) => {
    if (!date) return '';
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (isYesterday) {
      return t('common.yesterday');
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50',
        isActive && 'bg-muted'
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {conversation.participantInitials}
          </AvatarFallback>
        </Avatar>
        {conversation.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium truncate">{conversation.participantName}</h4>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
            {conversation.lastMessageType === 'audio' && (
              <Mic className="h-3 w-3 shrink-0" />
            )}
            {conversation.lastMessageType === 'audio'
              ? t('messages.voiceMessage')
              : conversation.lastMessage || t('messages.startConversation')}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="shrink-0 ml-2 h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
