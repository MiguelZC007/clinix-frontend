'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { PatientForm } from '@/features/patients/ui';
import type { PatientFormData } from '@/features/patients/schemas/patient.schema';

export default function NewPatientPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    try {
      console.log('Create patient:', data);
      router.push('/patients');
    } finally {
      setIsLoading(false);
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
