'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState } from '@/ui/molecules';
import { ClinicalHistoryCard } from '@/features/clinical-histories/ui';
import { MOCK_CLINICAL_HISTORIES } from '@/features/clinical-histories/__mocks__/clinical-histories.mock';
import type { ClinicalHistory } from '@/features/clinical-histories/types/clinical-history.types';

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
      {MOCK_CLINICAL_HISTORIES.length === 0 ? (
        <EmptyState
          type="clinical-histories"
          title={t('clinicalHistories.emptyTitle')}
          description={t('clinicalHistories.emptyDescription')}
          actionLabel={t('clinicalHistories.newHistory')}
          onAction={() => router.push('/clinical-histories/new')}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {MOCK_CLINICAL_HISTORIES.map((history) => (
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
