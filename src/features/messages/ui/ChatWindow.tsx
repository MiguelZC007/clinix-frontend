'use client';

import { useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, MessageSquare, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { Conversation, Message } from '../types/message.types';

type ChatWindowProps = {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  onBack?: () => void;
};

export function ChatWindow({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onSendAudio,
  onBack,
}: ChatWindowProps) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted/30">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
        </div>
        <p className="text-lg text-muted-foreground">{t('messages.noMessages')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {conversation.participantInitials}
              </AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{conversation.participantName}</h3>
            <p className="text-xs text-muted-foreground">
              {conversation.isOnline ? t('messages.online') : t('messages.offline')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
        </div>
      </ScrollArea>

      <MessageInput onSendMessage={onSendMessage} onSendAudio={onSendAudio} />
    </div>
  );
}
