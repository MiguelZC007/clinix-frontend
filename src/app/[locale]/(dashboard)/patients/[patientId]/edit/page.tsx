'use client';

import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { PatientForm } from '@/features/patients/ui';
import { ErrorState } from '@/ui/molecules';
import { usePatient, useUpdatePatient } from '@/features/patients/hooks/usePatients';
import type { PatientFormData } from '@/features/patients/schemas/patient.schema';
import { toast } from 'sonner';

export default function EditPatientPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: patient, isLoading: isLoadingPatient, error } = usePatient(patientId);
  const { mutate: updatePatient, isLoading: isUpdating } = useUpdatePatient();

  const handleSubmit = async (data: PatientFormData) => {
    if (!patient) return;

    try {
      await updatePatient(patientId, data);
      toast.success(t('patients.updateSuccess') || 'Paciente actualizado correctamente');
      router.push(`/patients/${patientId}`);
    } catch (error) {
      toast.error(t('patients.updateError') || 'Error al actualizar paciente');
    }
  };

  const handleCancel = () => {
    router.push(`/patients/${patientId}`);
  };

  if (isLoadingPatient) {
    return (
      <FormPageTemplate title={t('patients.editPatient')}>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">{t('common.loading') || 'Cargando...'}</div>
        </div>
      </FormPageTemplate>
    );
  }

  if (error || !patient) {
    return (
      <FormPageTemplate title={t('patients.editPatient')}>
        <ErrorState
          title={t('patients.notFound') || 'Paciente no encontrado'}
          description={error?.message || t('patients.notFoundDescription') || 'El paciente solicitado no existe'}
          onRetry={() => router.push('/patients')}
        />
      </FormPageTemplate>
    );
  }

  return (
    <FormPageTemplate
      title={t('patients.editPatient')}
      description={`${patient.firstName} ${patient.lastName}`}
    >
      <PatientForm
        patient={patient}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isUpdating}
      />
    </FormPageTemplate>
  );
}
