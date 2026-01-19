export type VitalSigns = {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
};

export type ClinicalHistory = {
  id: string;
  patientId: string;
  patientName?: string;
  reason: string;
  symptoms: string;
  physicalExam: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  vitalSigns: VitalSigns;
  createdAt: string;
  updatedAt: string;
};

export type CreateClinicalHistoryRequest = Omit<ClinicalHistory, 'id' | 'patientName' | 'createdAt' | 'updatedAt'>;

export type ClinicalHistoriesListParams = {
  page?: number;
  pageSize?: number;
  patientId?: string;
};
