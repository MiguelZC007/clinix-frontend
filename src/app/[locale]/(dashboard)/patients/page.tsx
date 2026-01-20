'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListPageTemplate } from '@/ui/templates';
import { EmptyState, ConfirmDialog } from '@/ui/molecules';
import { PatientTable, PatientFilters } from '@/features/patients/ui';
import { MOCK_PATIENTS } from '@/features/patients/__mocks__/patients.mock';
import type { Patient } from '@/features/patients/types/patient.types';

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
