'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { ClinicalHistoryForm } from '@/features/clinical-histories/ui';
import type { ClinicalHistoryFormData } from '@/features/clinical-histories/schemas/clinical-history.schema';
import type { Patient } from '@/features/patients/types/patient.types';

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    document: '12345678',
    birthDate: '1990-05-15',
    gender: 'male',
    phone: '+591 70000001',
    email: 'juan.perez@email.com',
    address: 'Av. Principal 123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    document: '87654321',
    birthDate: '1985-08-22',
    gender: 'female',
    phone: '+591 70000002',
    email: 'maria.gonzalez@email.com',
    address: 'Calle Secundaria 456',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
];

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
