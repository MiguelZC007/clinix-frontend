"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  usePatientList,
  useDeletePatient,
} from "@/features/patients/hooks/usePatients";
import type { Patient } from "@/features/patients/types/patient.types";
import { PatientTable, PatientFilters } from "@/features/patients/ui";
import { useRouter } from "@/i18n/navigation";
import { EmptyState, ConfirmDialog, ErrorState } from "@/ui/molecules";
import { ListPageTemplate } from "@/ui/templates";

export default function PatientsPage() {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  const { data, isLoading, error, refetch } = usePatientList({
    search,
    page,
    pageSize: 10,
  });
  const { mutate: deletePatientMutation, isLoading: isDeleting } =
    useDeletePatient();

  const patients = data?.items || [];
  const totalPages = data?.totalPages || 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleView = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  const handleEdit = (patient: Patient) => {
    router.push(`/patients/${patient.id}/edit`);
  };

  const handleDelete = async () => {
    if (!deletePatient) return;

    try {
      await deletePatientMutation(deletePatient.id);
      toast.success(
        t("patients.deleteSuccess") || "Paciente eliminado correctamente"
      );
      setDeletePatient(null);
      refetch();
    } catch (_error) {
      toast.error(t("patients.deleteError") || "Error al eliminar paciente");
    }
  };

  return (
    <>
      <ListPageTemplate
        title={t("patients.title")}
        description={t("patients.description")}
        actions={
          <Button onClick={() => router.push("/patients/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("patients.newPatient")}
          </Button>
        }
        filters={
          <PatientFilters search={search} onSearchChange={handleSearchChange} />
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">
              {t("common.loading") || "Cargando..."}
            </div>
          </div>
        ) : error ? (
          <ErrorState
            title={t("common.error") || "Error"}
            description={error.message}
            onRetry={refetch}
          />
        ) : patients.length === 0 ? (
          <EmptyState
            type="patients"
            title={t("patients.emptyTitle")}
            description={t("patients.emptyDescription")}
            actionLabel={t("patients.newPatient")}
            onAction={() => router.push("/patients/new")}
          />
        ) : (
          <PatientTable
            patients={patients}
            page={page}
            totalPages={totalPages}
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
        title={t("patients.deleteConfirmTitle")}
        description={t("patients.deleteConfirmDescription")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
