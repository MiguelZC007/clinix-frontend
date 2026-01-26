'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPatients, getPatientById, createPatient, updatePatient, deletePatient } from '../api/patients.api';
import type { Patient, CreatePatientRequest, UpdatePatientRequest, PatientsListParams } from '../types/patient.types';
import type { PaginatedData } from '@/types/contracts/api-response';

type UsePatientListState = {
  data: PaginatedData<Patient> | null;
  isLoading: boolean;
  error: Error | null;
};

export function usePatientList(params?: PatientsListParams) {
  const [state, setState] = useState<UsePatientListState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const page = params?.page;
  const pageSize = params?.pageSize;
  const search = params?.search;

  const fetchPatients = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const requestParams: PatientsListParams | undefined =
        page === undefined && pageSize === undefined && search === undefined
          ? undefined
          : { page, pageSize, search };
      const data = await getPatients(requestParams);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    ...state,
    refetch: fetchPatients,
  };
}

type UsePatientState = {
  data: Patient | null;
  isLoading: boolean;
  error: Error | null;
};

export function usePatient(id: string) {
  const [state, setState] = useState<UsePatientState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchPatient = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getPatientById(id);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return {
    ...state,
    refetch: fetchPatient,
  };
}

type MutationState = {
  isLoading: boolean;
  error: Error | null;
};

export function useCreatePatient() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (data: CreatePatientRequest): Promise<Patient> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await createPatient(data);
      setState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      throw error;
    }
  }, []);

  return {
    ...state,
    mutate,
  };
}

export function useUpdatePatient() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (id: string, data: UpdatePatientRequest): Promise<Patient> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await updatePatient(id, data);
      setState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      throw error;
    }
  }, []);

  return {
    ...state,
    mutate,
  };
}

export function useDeletePatient() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (id: string): Promise<void> => {
    setState({ isLoading: true, error: null });
    try {
      await deletePatient(id);
      setState({ isLoading: false, error: null });
    } catch (error) {
      setState({ isLoading: false, error: error as Error });
      throw error;
    }
  }, []);

  return {
    ...state,
    mutate,
  };
}
