'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useCreateClinicalHistory } from '@/features/clinical-histories/hooks/useClinicalHistories';
import type { ClinicalHistoryFormData } from '@/features/clinical-histories/schemas/clinical-history.schema';
import { ClinicalHistoryForm } from '@/features/clinical-histories/ui';
import { useRouter } from '@/i18n/navigation';
import { FormPageTemplate } from '@/ui/templates';

export default function NewClinicalHistoryPage() {
  const t = useTranslations();
  const router = useRouter();

  const { mutate: createClinicalHistory, isLoading: isCreating } = useCreateClinicalHistory();

  const handleSubmit = async (data: ClinicalHistoryFormData) => {
    try {
      await createClinicalHistory(data);
      toast.success(t('clinicalHistories.createSuccess') || 'Historia clínica creada correctamente');
      router.push('/clinical-histories');
    } catch (_error) {
      toast.error(t('clinicalHistories.createError') || 'Error al crear historia clínica');
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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isCreating}
      />
    </FormPageTemplate>
  );
}
