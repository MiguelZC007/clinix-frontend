'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useCreateClinicalHistory } from '@/features/clinical-histories/hooks/useClinicalHistories';
import type { ClinicalHistoryFormData } from '@/features/clinical-histories/schemas/clinical-history.schema';
import { ClinicalHistoryForm } from '@/features/clinical-histories/ui';
import { usePatientList } from '@/features/patients/hooks/usePatients';
import { useRouter } from '@/i18n/navigation';
import { FormPageTemplate } from '@/ui/templates';

export default function NewClinicalHistoryPage() {
  const t = useTranslations();
  const router = useRouter();

  const { data: patientsData, isLoading: isLoadingPatients } = usePatientList();
  const { mutate: createClinicalHistory, isLoading: isCreating } = useCreateClinicalHistory();

  const patients = patientsData?.items || [];

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
      {isLoadingPatients ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">{t('common.loading') || 'Cargando...'}</div>
        </div>
      ) : (
        <ClinicalHistoryForm
          patients={patients}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating}
        />
      )}
    </FormPageTemplate>
  );
}
