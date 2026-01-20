'use client';

import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/ui/molecules';
import { PatientTabs } from '@/features/patients/ui';
import { getMockPatientById, MOCK_PATIENTS } from '@/features/patients/__mocks__/patients.mock';

export default function PatientDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();

  const patient = getMockPatientById(params.patientId as string) ?? { ...MOCK_PATIENTS[0], id: params.patientId as string };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
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
