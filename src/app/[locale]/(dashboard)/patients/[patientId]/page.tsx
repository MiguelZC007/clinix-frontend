'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, ErrorState } from '@/ui/molecules';
import { PatientTabs } from '@/features/patients/ui';
import { usePatient } from '@/features/patients/hooks/usePatients';

export default function PatientDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: patient, isLoading, error } = usePatient(patientId);

  useEffect(() => {
    if (error && !isLoading) {
      const timer = setTimeout(() => {
        router.push('/patients');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">{t('common.loading') || 'Cargando...'}</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <ErrorState
        title={t('patients.notFound') || 'Paciente no encontrado'}
        description={error?.message || t('patients.notFoundDescription') || 'El paciente solicitado no existe'}
        onRetry={() => router.push('/patients')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${patient.name} ${patient.lastName}`}
        description={t('patients.patientDetails')}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/patients')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button onClick={() => router.push(`/patients/${patient.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </Button>
          </div>
        }
      />

      <PatientTabs patient={patient} />
    </div>
  );
}
