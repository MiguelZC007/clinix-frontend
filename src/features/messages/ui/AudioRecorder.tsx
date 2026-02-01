'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Trash2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AudioRecorderProps = {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onCancel?: () => void;
  className?: string;
};

export function AudioRecorder({ onRecordingComplete, onCancel, className }: AudioRecorderProps) {
  const t = useTranslations();
  const [isRecording, setIsRecording] = useState(false);
  const [_isPaused, _setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    stopRecording();
    setAudioBlob(null);
    setDuration(0);
    onCancel?.();
  }, [stopRecording, onCancel]);

  const sendRecording = useCallback(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob, duration);
      setAudioBlob(null);
      setDuration(0);
    }
  }, [audioBlob, duration, onRecordingComplete]);

  if (audioBlob) {
    return (
      <div className={cn('flex items-center gap-3 p-3 bg-muted rounded-lg', className)}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={cancelRecording}
        >
          <Trash2 className="h-5 w-5" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary/60 rounded-full"
                style={{ height: `${Math.random() * 20 + 4}px` }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{formatDuration(duration)}</span>
        </div>

        <Button
          type="button"
          size="icon"
          className="rounded-full"
          onClick={sendRecording}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className={cn('flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg', className)}>
        <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          {t('messages.recording')}
        </span>
        <span className="text-sm text-muted-foreground">{formatDuration(duration)}</span>
        
        <div className="flex-1" />
        
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={stopRecording}
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      className={cn('rounded-full', className)}
      onClick={startRecording}
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
}
