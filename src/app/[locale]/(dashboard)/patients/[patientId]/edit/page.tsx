'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { PatientForm } from '@/features/patients/ui';
import { getMockPatientById, MOCK_PATIENTS } from '@/features/patients/__mocks__/patients.mock';
import type { PatientFormData } from '@/features/patients/schemas/patient.schema';

export default function EditPatientPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const patient = getMockPatientById(params.patientId as string) ?? { ...MOCK_PATIENTS[0], id: params.patientId as string };

  const handleSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    try {
      console.log('Update patient:', data);
      router.push(`/patients/${patient.id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/patients/${patient.id}`);
  };

  return (
    <FormPageTemplate
      title={t('patients.editPatient')}
      description={`${patient.firstName} ${patient.lastName}`}
    >
      <PatientForm
        patient={patient}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </FormPageTemplate>
  );
}
