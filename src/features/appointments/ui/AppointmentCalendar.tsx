'use client';

import { useState, useCallback } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarDayView } from './CalendarDayView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarMonthView } from './CalendarMonthView';
import type { Appointment, CalendarView } from '../types/appointment.types';

type AppointmentCalendarProps = {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
};

export function AppointmentCalendar({ appointments, onAppointmentClick }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');

  const handleNavigate = useCallback((direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }

    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const delta = direction === 'next' ? 1 : -1;

      switch (view) {
        case 'day':
          newDate.setDate(newDate.getDate() + delta);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() + delta * 7);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() + delta);
          break;
      }

      return newDate;
    });
  }, [view]);

  const handleDayClick = useCallback((date: Date) => {
    setCurrentDate(date);
    setView('day');
  }, []);

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
      />

      {view === 'day' && (
        <CalendarDayView
          currentDate={currentDate}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
        />
      )}

      {view === 'week' && (
        <CalendarWeekView
          currentDate={currentDate}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
          onDayClick={handleDayClick}
        />
      )}

      {view === 'month' && (
        <CalendarMonthView
          currentDate={currentDate}
          appointments={appointments}
          onAppointmentClick={onAppointmentClick}
          onDayClick={handleDayClick}
        />
      )}
    </div>
  );
}
