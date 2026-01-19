'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState, ConfirmDialog } from '@/ui/molecules';
import { PatientTable, PatientFilters } from '@/features/patients/ui';
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

export default function PatientsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  const filteredPatients = MOCK_PATIENTS.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
      patient.document.includes(search)
  );

  const handleView = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  const handleEdit = (patient: Patient) => {
    router.push(`/patients/${patient.id}/edit`);
  };

  const handleDelete = () => {
    setDeletePatient(null);
  };

  return (
    <>
      <ListPageTemplate
        title={t('patients.title')}
        description={t('patients.description')}
        actions={
          <Button onClick={() => router.push('/patients/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('patients.newPatient')}
          </Button>
        }
        filters={<PatientFilters search={search} onSearchChange={setSearch} />}
      >
        {filteredPatients.length === 0 ? (
          <EmptyState
            type="patients"
            title={t('patients.emptyTitle')}
            description={t('patients.emptyDescription')}
            actionLabel={t('patients.newPatient')}
            onAction={() => router.push('/patients/new')}
          />
        ) : (
          <PatientTable
            patients={filteredPatients}
            page={page}
            totalPages={1}
            onPageChange={setPage}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={setDeletePatient}
          />
        )}
      </ListPageTemplate>

      <ConfirmDialog
        open={!!deletePatient}
        onOpenChange={(open) => !open && setDeletePatient(null)}
        title={t('patients.deleteConfirmTitle')}
        description={t('patients.deleteConfirmDescription')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
