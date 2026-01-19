'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormSection } from '@/ui/molecules';
import { LoadingSpinner } from '@/ui/atoms';
import { clinicalHistoryFormSchema, type ClinicalHistoryFormData } from '../schemas/clinical-history.schema';
import type { Patient } from '@/features/patients/types/patient.types';

type ClinicalHistoryFormProps = {
  patients: Patient[];
  onSubmit: (data: ClinicalHistoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ClinicalHistoryForm({
  patients,
  onSubmit,
  onCancel,
  isLoading,
}: ClinicalHistoryFormProps) {
  const t = useTranslations();

  const form = useForm<ClinicalHistoryFormData>({
    resolver: zodResolver(clinicalHistoryFormSchema),
    defaultValues: {
      patientId: '',
      reason: '',
      symptoms: '',
      physicalExam: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      vitalSigns: {
        bloodPressure: '',
        heartRate: 0,
        temperature: 0,
        weight: 0,
        height: 0,
      },
    },
  });

  const handleSubmit = async (data: ClinicalHistoryFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormSection
          title={t('clinicalHistories.selectPatient')}
        >
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('appointments.patient')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('clinicalHistories.searchPatient')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.document}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection
          title={t('clinicalHistories.vitalSigns')}
          description={t('clinicalHistories.vitalSignsDescription')}
        >
          <div className="grid gap-4 md:grid-cols-5">
            <FormField
              control={form.control}
              name="vitalSigns.bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.bloodPressure')}</FormLabel>
                  <FormControl>
                    <Input placeholder="120/80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitalSigns.heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.heartRate')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="72"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitalSigns.temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.temperature')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitalSigns.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.weight')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="70"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitalSigns.height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.height')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="170"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection
          title={t('clinicalHistories.consultationInfo')}
          description={t('clinicalHistories.consultationInfoDescription')}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.reason')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.symptoms')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalExam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.physicalExam')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.diagnosis')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.treatment')}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('clinicalHistories.notes')}</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
