'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/ui/molecules';
import { AppointmentCalendar } from '@/features/appointments';
import { MOCK_APPOINTMENTS } from '@/features/appointments/__mocks__/appointments.mock';
import type { Appointment, AppointmentStatus } from '@/features/appointments';

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
