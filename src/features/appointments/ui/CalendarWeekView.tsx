'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Appointment } from '../types/appointment.types';

type CalendarWeekViewProps = {
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
  onDayClick?: (date: Date) => void;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function getAppointmentStyle(startTime: string, endTime: string) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const top = (startHour * 60 + startMin) * (48 / 60);
  const height = ((endHour * 60 + endMin) - (startHour * 60 + startMin)) * (48 / 60);
  return { top: `${top}px`, height: `${Math.max(height, 20)}px` };
}

function getStatusColor(status: Appointment['status']) {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-500/90 hover:bg-blue-500';
    case 'completed':
      return 'bg-emerald-500/90 hover:bg-emerald-500';
    case 'cancelled':
      return 'bg-red-500/90 hover:bg-red-500';
    default:
      return 'bg-blue-500/90 hover:bg-blue-500';
  }
}

export function CalendarWeekView({ currentDate, appointments, onAppointmentClick, onDayClick }: CalendarWeekViewProps) {
  const t = useTranslations();
  const weekDays = getWeekDays(currentDate);
  const today = new Date();

  const now = new Date();
  const isCurrentWeek = weekDays.some((d) => d.toDateString() === now.toDateString());
  const currentTimeTop = isCurrentWeek ? (now.getHours() * 60 + now.getMinutes()) * (48 / 60) : -1;
  const currentDayIndex = weekDays.findIndex((d) => d.toDateString() === now.toDateString());

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[600px] border rounded-lg overflow-hidden">
      <div className="flex border-b bg-muted/30">
        <div className="w-14 shrink-0" />
        {weekDays.map((day, idx) => {
          const isToday = day.toDateString() === today.toDateString();
          return (
            <div
              key={idx}
              className={cn(
                'flex-1 text-center py-2 cursor-pointer hover:bg-muted/50 transition-colors',
                isToday && 'bg-primary/10'
              )}
              onClick={() => onDayClick?.(day)}
            >
              <div className="text-xs text-muted-foreground">{t(`calendar.days.${DAY_KEYS[idx]}`)}</div>
              <div className={cn(
                'text-lg font-semibold',
                isToday && 'text-primary'
              )}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex relative" style={{ height: `${24 * 48}px` }}>
          <div className="w-14 shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="absolute text-xs text-muted-foreground text-right pr-2"
                style={{ top: `${hour * 48 - 8}px` }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIdx) => {
            const dayAppointments = appointments.filter(
              (apt) => apt.date.toDateString() === day.toDateString()
            );
            const isToday = day.toDateString() === today.toDateString();

            return (
              <div
                key={dayIdx}
                className={cn(
                  'flex-1 relative border-l',
                  isToday && 'bg-primary/5'
                )}
              >
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full border-t border-border"
                    style={{ top: `${hour * 48}px`, height: '48px' }}
                  />
                ))}

                {dayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={cn(
                      'absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-white text-xs cursor-pointer transition-colors overflow-hidden',
                      getStatusColor(apt.status)
                    )}
                    style={getAppointmentStyle(apt.startTime, apt.endTime)}
                    onClick={() => onAppointmentClick?.(apt)}
                  >
                    <div className="font-medium truncate">{apt.patientName}</div>
                    <div className="opacity-90 truncate">{apt.startTime}</div>
                  </div>
                ))}
              </div>
            );
          })}

          {isCurrentWeek && currentTimeTop >= 0 && currentDayIndex >= 0 && (
            <div
              className="absolute flex items-center z-20 pointer-events-none"
              style={{
                top: `${currentTimeTop}px`,
                left: `calc(3.5rem + ${(currentDayIndex / 7) * 100}% * (100% - 3.5rem) / 100%)`,
                width: `calc((100% - 3.5rem) / 7)`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
