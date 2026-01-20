'use client';

import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/ui/molecules';
import { ClinicalHistoryDetail } from '@/features/clinical-histories/ui';
import { getMockClinicalHistoryById, MOCK_CLINICAL_HISTORIES } from '@/features/clinical-histories/__mocks__/clinical-histories.mock';

export default function ClinicalHistoryDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();

  const history = getMockClinicalHistoryById(params.historyId as string) ?? { ...MOCK_CLINICAL_HISTORIES[0], id: params.historyId as string };

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
