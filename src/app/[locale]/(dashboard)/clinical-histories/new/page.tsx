'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { ClinicalHistoryForm } from '@/features/clinical-histories/ui';
import { MOCK_PATIENTS } from '@/features/patients/__mocks__/patients.mock';
import type { ClinicalHistoryFormData } from '@/features/clinical-histories/schemas/clinical-history.schema';

export default function NewClinicalHistoryPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ClinicalHistoryFormData) => {
    setIsLoading(true);
    try {
      console.log('Create clinical history:', data);
      router.push('/clinical-histories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/clinical-histories');
  };

  return (
    <FormPageTemplate
      title={t('clinicalHistories.newHistory')}
    >
      <ClinicalHistoryForm
        patients={MOCK_PATIENTS}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </FormPageTemplate>
  );
}
