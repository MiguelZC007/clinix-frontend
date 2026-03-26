'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Mic, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { messageFormSchema, type MessageFormData } from '../schemas/message.schema';
import { AudioRecorder } from './AudioRecorder';

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
};

export function MessageInput({ onSendMessage, onSendAudio, disabled }: MessageInputProps) {
  const t = useTranslations();
  const [showRecordingUI, setShowRecordingUI] = useState(false);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: MessageFormData) => {
    onSendMessage(data.content);
    form.reset();
  };

  const handleRecordingComplete = (audioBlob: Blob, duration: number) => {
    onSendAudio(audioBlob, duration);
    setShowRecordingUI(false);
  };

  const messageValue = form.watch('content');
  const showSendButton = messageValue.trim().length > 0;

  return (
    <div className="shrink-0 border-t p-4 bg-background">
      {showRecordingUI ? (
        <div className="flex items-center gap-2">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onCancel={() => setShowRecordingUI(false)}
            className="flex-1"
          />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={t('messages.typeMessage')}
                      disabled={disabled}
                      className="rounded-full px-4"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {showSendButton ? (
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-10 w-10"
                disabled={disabled || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className={cn('rounded-full h-10 w-10')}
                disabled={disabled}
                onMouseDown={() => setShowRecordingUI(true)}
                onTouchStart={() => setShowRecordingUI(true)}
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}
          </form>
        </Form>
      )}
    </div>
  );
}
