'use client';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { PatientForm } from '@/features/patients/ui';
import { useCreatePatient } from '@/features/patients/hooks/usePatients';
import type { PatientFormData } from '@/features/patients/schemas/patient.schema';
import { toast } from 'sonner';

export default function NewPatientPage() {
  const t = useTranslations();
  const router = useRouter();
  const { mutate: createPatient, isLoading } = useCreatePatient();

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await createPatient(data);
      toast.success(t('patients.createSuccess') || 'Paciente creado correctamente');
      router.push('/patients');
    } catch (error) {
      toast.error(t('patients.createError') || 'Error al crear paciente');
    }
  };

  const handleCancel = () => {
    router.push('/patients');
  };

  return (
    <FormPageTemplate
      title={t('patients.newPatient')}
      description={t('patients.personalInfoDescription')}
    >
      <PatientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </FormPageTemplate>
  );
}
