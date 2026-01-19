'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/ui/molecules';
import { AppointmentCalendar } from '@/features/appointments';
import type { Appointment, AppointmentStatus } from '@/features/appointments';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'Juan Pérez',
    patientInitials: 'JP',
    date: today,
    startTime: '09:00',
    endTime: '09:30',
    reason: 'Control rutinario',
    status: 'scheduled',
  },
  {
    id: '2',
    patientName: 'María González',
    patientInitials: 'MG',
    date: today,
    startTime: '10:30',
    endTime: '11:00',
    reason: 'Dolor de cabeza persistente',
    status: 'scheduled',
  },
  {
    id: '3',
    patientName: 'Carlos López',
    patientInitials: 'CL',
    date: today,
    startTime: '11:30',
    endTime: '12:00',
    reason: 'Revisión post-operatoria',
    status: 'completed',
  },
  {
    id: '4',
    patientName: 'Ana Martínez',
    patientInitials: 'AM',
    date: today,
    startTime: '14:00',
    endTime: '14:45',
    reason: 'Primera consulta',
    status: 'scheduled',
  },
  {
    id: '5',
    patientName: 'Roberto Sánchez',
    patientInitials: 'RS',
    date: tomorrow,
    startTime: '09:30',
    endTime: '10:00',
    reason: 'Control de presión arterial',
    status: 'scheduled',
  },
  {
    id: '6',
    patientName: 'Elena Rodríguez',
    patientInitials: 'ER',
    date: tomorrow,
    startTime: '11:00',
    endTime: '11:30',
    reason: 'Exámenes de laboratorio',
    status: 'scheduled',
  },
  {
    id: '7',
    patientName: 'Pedro Fernández',
    patientInitials: 'PF',
    date: dayAfter,
    startTime: '10:00',
    endTime: '10:30',
    reason: 'Consulta dermatológica',
    status: 'scheduled',
  },
  {
    id: '8',
    patientName: 'Lucía Morales',
    patientInitials: 'LM',
    date: dayAfter,
    startTime: '15:00',
    endTime: '15:45',
    reason: 'Control prenatal',
    status: 'scheduled',
  },
  {
    id: '9',
    patientName: 'Miguel Torres',
    patientInitials: 'MT',
    date: nextWeek,
    startTime: '09:00',
    endTime: '09:30',
    reason: 'Seguimiento tratamiento',
    status: 'scheduled',
  },
  {
    id: '10',
    patientName: 'Carmen Díaz',
    patientInitials: 'CD',
    date: today,
    startTime: '16:00',
    endTime: '16:30',
    reason: 'Cita cancelada por paciente',
    status: 'cancelled',
  },
];

function getStatusBadge(status: AppointmentStatus, t: ReturnType<typeof useTranslations>) {
  const variants: Record<AppointmentStatus, 'default' | 'secondary' | 'destructive'> = {
    scheduled: 'default',
    completed: 'secondary',
    cancelled: 'destructive',
  };

  const labels: Record<AppointmentStatus, string> = {
    scheduled: t('appointments.scheduled'),
    completed: t('appointments.completed'),
    cancelled: t('appointments.cancelled'),
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

export default function AppointmentsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const dateLocale = locale === 'es' ? 'es-ES' : 'en-US';
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="space-y-4 h-full">
      <PageHeader
        title={t('appointments.title')}
        description={t('appointments.description')}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('appointments.newAppointment')}
          </Button>
        }
      />

      <AppointmentCalendar
        appointments={MOCK_APPOINTMENTS}
        onAppointmentClick={setSelectedAppointment}
      />

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {selectedAppointment?.patientInitials}
              </div>
              {selectedAppointment?.patientName}
            </DialogTitle>
            <DialogDescription>
              {t('appointments.appointmentDetails')}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('appointments.date')}</p>
                  <p className="font-medium">
                    {selectedAppointment.date.toLocaleDateString(dateLocale, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('appointments.time')}</p>
                  <p className="font-medium">
                    {selectedAppointment.startTime} - {selectedAppointment.endTime}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('appointments.reason')}</p>
                <p className="font-medium">{selectedAppointment.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('appointments.status')}</p>
                {getStatusBadge(selectedAppointment.status, t)}
              </div>
              <div className="flex gap-2 pt-4">
                {selectedAppointment.status === 'scheduled' && (
                  <>
                    <Button className="flex-1">
                      {t('appointments.startConsultation')}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      {t('common.edit')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
