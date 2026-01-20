'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, ErrorState } from '@/ui/molecules';
import { ClinicalHistoryDetail } from '@/features/clinical-histories/ui';
import { useClinicalHistory } from '@/features/clinical-histories/hooks/useClinicalHistories';

export default function ClinicalHistoryDetailPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const historyId = params.historyId as string;

  const { data: history, isLoading, error } = useClinicalHistory(historyId);

  useEffect(() => {
    if (error && !isLoading) {
      const timer = setTimeout(() => {
        router.push('/clinical-histories');
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

  if (error || !history) {
    return (
      <ErrorState
        title={t('clinicalHistories.notFound') || 'Historia clínica no encontrada'}
        description={error?.message || t('clinicalHistories.notFoundDescription') || 'La historia clínica solicitada no existe'}
        onRetry={() => router.push('/clinical-histories')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('clinicalHistories.historyDetails')}
        description={
          <div className="flex items-center gap-2 mt-1">
            <User className="h-4 w-4" />
            <span>{history.patientName || `${history.patientId}`}</span>
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
