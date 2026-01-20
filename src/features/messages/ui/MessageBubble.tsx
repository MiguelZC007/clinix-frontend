'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Pause, Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Message } from '../types/message.types';

type MessageBubbleProps = {
  message: Message;
  isOwn: boolean;
};

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const t = useTranslations();
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStatus = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case 'sending':
        return <div className="h-3 w-3 rounded-full border border-current animate-pulse" />;
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn('flex mb-2', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md'
        )}
      >
        {message.type === 'audio' ? (
          <div className="flex items-center gap-3 min-w-[200px]">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-10 w-10 rounded-full shrink-0',
                isOwn
                  ? 'bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground'
                  : 'bg-primary/10 hover:bg-primary/20 text-primary'
              )}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1 rounded-full',
                      isOwn ? 'bg-primary-foreground/40' : 'bg-primary/40'
                    )}
                    style={{ height: `${Math.random() * 16 + 4}px` }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={cn('text-xs', isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {formatDuration(message.audioDuration || 0)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}

        <div className={cn('flex items-center justify-end gap-1 mt-1', isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          <span className="text-[10px]">{formatTime(message.createdAt)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
