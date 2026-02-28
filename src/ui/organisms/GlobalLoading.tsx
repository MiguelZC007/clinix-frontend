'use client';

import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import { navigationLoadingAtom, apiLoadingAtom, loadingMessageAtom } from '@/lib/store/loading.atoms';
import { LoadingSpinner } from '@/ui/atoms/LoadingSpinner';

export function GlobalLoading() {
  const navigationLoading = useAtomValue(navigationLoadingAtom);
  const apiLoading = useAtomValue(apiLoadingAtom);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const t = useTranslations();

  const isLoading = navigationLoading || apiLoading;

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {loadingMessage && (
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        )}
        {!loadingMessage && navigationLoading && (
          <p className="text-sm text-muted-foreground">
            {t('common.loading') || 'Cargando...'}
          </p>
        )}
      </div>
    </div>
  );
}
