'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Send, Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { messageSchema, type MessageFormData } from '../schemas/message.schema';

type MessageInputProps = {
  onSendMessage: (content: string) => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
};

export function MessageInput({ onSendMessage, onSendAudio, disabled }: MessageInputProps) {
  const t = useTranslations();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: MessageFormData) => {
    onSendMessage(data.content);
    form.reset();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSendAudio(audioBlob, recordingDuration);
        stream.getTracks().forEach((track) => track.stop());
        setRecordingDuration(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const messageValue = form.watch('content');
  const showSendButton = messageValue.trim().length > 0;

  return (
    <div className="shrink-0 border-t p-4 bg-background">
      {isRecording ? (
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium">{t('messages.recording')}</span>
            <span className="text-sm text-muted-foreground">{formatDuration(recordingDuration)}</span>
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="rounded-full h-12 w-12"
            onClick={stopRecording}
          >
            <Square className="h-5 w-5" />
          </Button>
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
                onMouseDown={startRecording}
                onTouchStart={startRecording}
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
