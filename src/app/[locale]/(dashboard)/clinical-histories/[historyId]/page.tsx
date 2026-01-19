'use client';

import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/ui/molecules';
import { ClinicalHistoryDetail } from '@/features/clinical-histories/ui';
import type { ClinicalHistory } from '@/features/clinical-histories/types/clinical-history.types';

const MOCK_HISTORY: ClinicalHistory = {
  id: '1',
  patientId: '1',
  patientName: 'Juan Pérez',
  reason: 'Dolor abdominal persistente desde hace 3 días',
  symptoms: 'Dolor en zona epigástrica, náuseas ocasionales, pérdida de apetito. El paciente refiere que el dolor aumenta después de las comidas.',
  physicalExam: 'Abdomen blando, depresible, dolor a la palpación en epigastrio. No hay signos de irritación peritoneal. Ruidos hidroaéreos presentes.',
  diagnosis: 'Gastritis aguda',
  treatment: 'Omeprazol 20mg cada 12 horas por 14 días.\nDieta blanda, evitar alimentos irritantes.\nSuspender consumo de café y alcohol.',
  notes: 'Control en 2 semanas. Si los síntomas persisten, considerar endoscopia.',
  vitalSigns: {
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 36.5,
    weight: 75,
    height: 175,
  },
  createdAt: '2024-01-20T10:00:00Z',
  updatedAt: '2024-01-20T10:00:00Z',
};

export default function ClinicalHistoryDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();

  const history = { ...MOCK_HISTORY, id: params.historyId as string };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('clinicalHistories.historyDetails')}
        description={
          <div className="flex items-center gap-2 mt-1">
            <User className="h-4 w-4" />
            <span>{history.patientName}</span>
            <Badge variant="secondary">
              {new Date(history.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/clinical-histories')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/patients/${history.patientId}`)}>
              <User className="mr-2 h-4 w-4" />
              {t('patients.patientDetails')}
            </Button>
          </div>
        }
      />

      <ClinicalHistoryDetail history={history} />
    </div>
  );
}
