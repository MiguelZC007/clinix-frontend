'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FormPageTemplate } from '@/ui/templates';
import { PatientForm } from '@/features/patients/ui';
import type { PatientFormData } from '@/features/patients/schemas/patient.schema';
import type { Patient } from '@/features/patients/types/patient.types';

const MOCK_PATIENT: Patient = {
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
};

export default function EditPatientPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const patient = { ...MOCK_PATIENT, id: params.patientId as string };

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
