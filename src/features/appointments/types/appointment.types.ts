export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  patientName: string;
  patientInitials: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  status: AppointmentStatus;
};

export type CalendarView = 'day' | 'week' | 'month';
