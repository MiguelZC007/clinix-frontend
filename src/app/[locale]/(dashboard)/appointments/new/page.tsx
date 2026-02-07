"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCreateAppointment,
  useSpecialties,
} from "@/features/appointments/hooks/useAppointments";
import type { AppointmentFormData } from "@/features/appointments/schemas/appointment.schema";
import { AppointmentForm } from "@/features/appointments/ui";
import { useRouter } from "@/i18n/navigation";
import { FormPageTemplate } from "@/ui/templates";

function toISOAppointment(dateStr: string, timeStr: string): string {
  const date = new Date(`${dateStr}T${timeStr}`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

export default function NewAppointmentPage() {
  const t = useTranslations();
  const router = useRouter();
  const { data: specialties, isLoading: isLoadingSpecialties } =
    useSpecialties();
  const { mutate: createAppointment, isLoading: isCreating } =
    useCreateAppointment();

  const specialtiesList = specialties ?? [];

  const handleSubmit = async (data: AppointmentFormData) => {
    const startAppointment = toISOAppointment(data.date, data.startTime);
    const endAppointment = toISOAppointment(data.date, data.endTime);
    if (!startAppointment || !endAppointment) {
      toast.error(t("appointments.invalidDateTime") ?? "Fecha u hora inválida");
      return;
    }
    try {
      await createAppointment({
        patientId: data.patientId,
        specialtyId: data.specialtyId,
        startAppointment,
        endAppointment,
        reason: data.reason,
      });
      toast.success(
        t("appointments.createSuccess") ?? "Cita creada correctamente",
      );
      router.push("/appointments");
    } catch (_err) {
      toast.error(t("appointments.createError") ?? "Error al crear la cita");
    }
  };

  const handleCancel = () => {
    router.push("/appointments");
  };

  const isLoading = isLoadingSpecialties;

  return (
    <FormPageTemplate
      title={t("appointments.newAppointment")}
      description={t("appointments.newAppointmentDescription")}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">
            {t("common.loading") ?? "Cargando..."}
          </div>
        </div>
      ) : (
        <AppointmentForm
          specialties={specialtiesList}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating}
        />
      )}
    </FormPageTemplate>
  );
}
