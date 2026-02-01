'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState, ErrorState } from '@/ui/molecules';
import { ClinicalHistoryCard } from '@/features/clinical-histories/ui';
import { useClinicalHistoryList } from '@/features/clinical-histories/hooks/useClinicalHistories';
import type { ClinicalHistory } from '@/features/clinical-histories/types/clinical-history.types';

const PAGE_SIZE = 10;

export default function ClinicalHistoriesPage() {
  const t = useTranslations();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useClinicalHistoryList({
    page,
    pageSize: PAGE_SIZE,
  });
  const histories = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

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
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {histories.map((history) => (
              <ClinicalHistoryCard
                key={history.id}
                history={history}
                onClick={() => handleView(history)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </ListPageTemplate>
  );
}
