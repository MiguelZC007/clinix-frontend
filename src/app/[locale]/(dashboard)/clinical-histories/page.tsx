'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState, ErrorState } from '@/ui/molecules';
import { ClinicalHistoryCard } from '@/features/clinical-histories/ui';
import { useClinicalHistoryList } from '@/features/clinical-histories/hooks/useClinicalHistories';
import type { ClinicalHistory } from '@/features/clinical-histories/types/clinical-history.types';

export default function ClinicalHistoriesPage() {
  const t = useTranslations();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useClinicalHistoryList();
  const histories = data?.items || [];

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
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">{t('common.loading') || 'Cargando...'}</div>
        </div>
      ) : error ? (
        <ErrorState
          title={t('common.error') || 'Error'}
          description={error.message}
          onRetry={refetch}
        />
      ) : histories.length === 0 ? (
        <EmptyState
          type="clinical-histories"
          title={t('clinicalHistories.emptyTitle')}
          description={t('clinicalHistories.emptyDescription')}
          actionLabel={t('clinicalHistories.newHistory')}
          onAction={() => router.push('/clinical-histories/new')}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {histories.map((history) => (
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
