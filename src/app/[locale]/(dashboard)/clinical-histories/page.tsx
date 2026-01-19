'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState } from '@/ui/molecules';
import { ClinicalHistoryCard } from '@/features/clinical-histories/ui';
import type { ClinicalHistory } from '@/features/clinical-histories/types/clinical-history.types';

const MOCK_HISTORIES: ClinicalHistory[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Juan Pérez',
    reason: 'Dolor abdominal persistente desde hace 3 días',
    symptoms: 'Dolor en zona epigástrica, náuseas ocasionales',
    physicalExam: 'Abdomen blando, dolor a la palpación en epigastrio',
    diagnosis: 'Gastritis aguda',
    treatment: 'Omeprazol 20mg cada 12 horas por 14 días. Dieta blanda.',
    notes: 'Control en 2 semanas',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.5,
      weight: 75,
      height: 175,
    },
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'María González',
    reason: 'Control rutinario',
    symptoms: 'Sin síntomas actuales',
    physicalExam: 'Examen físico normal',
    diagnosis: 'Paciente sana',
    treatment: 'Continuar con estilo de vida saludable',
    notes: 'Próximo control en 6 meses',
    vitalSigns: {
      bloodPressure: '110/70',
      heartRate: 68,
      temperature: 36.2,
      weight: 62,
      height: 165,
    },
    createdAt: '2024-01-18T14:30:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
  },
];

export default function ClinicalHistoriesPage() {
  const t = useTranslations();
  const router = useRouter();

  const handleView = (history: ClinicalHistory) => {
    router.push(`/clinical-histories/${history.id}`);
  };

  return (
    <ListPageTemplate
      title={t('clinicalHistories.title')}
      description={t('clinicalHistories.description')}
      actions={
        <Button onClick={() => router.push('/clinical-histories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('clinicalHistories.newHistory')}
        </Button>
      }
    >
      {MOCK_HISTORIES.length === 0 ? (
        <EmptyState
          type="clinical-histories"
          title={t('clinicalHistories.emptyTitle')}
          description={t('clinicalHistories.emptyDescription')}
          actionLabel={t('clinicalHistories.newHistory')}
          onAction={() => router.push('/clinical-histories/new')}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {MOCK_HISTORIES.map((history) => (
            <ClinicalHistoryCard
              key={history.id}
              history={history}
              onClick={() => handleView(history)}
            />
          ))}
        </div>
      )}
    </ListPageTemplate>
  );
}
