'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, cancelAppointment } from '../api/appointments.api';
import type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentsListParams } from '../types/appointment.types';
import type { PaginatedData } from '@/types/contracts/api-response';

type UseAppointmentListState = {
  data: PaginatedData<Appointment> | null;
  isLoading: boolean;
  error: Error | null;
};

export function useAppointmentList(params?: AppointmentsListParams) {
  const [state, setState] = useState<UseAppointmentListState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchAppointments = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getAppointments(params);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [params]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    ...state,
    refetch: fetchAppointments,
  };
}

type UseAppointmentState = {
  data: Appointment | null;
  isLoading: boolean;
  error: Error | null;
};

export function useAppointment(id: string) {
  const [state, setState] = useState<UseAppointmentState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchAppointment = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getAppointmentById(id);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [id]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  return {
    ...state,
    refetch: fetchAppointment,
  };
}

type MutationState = {
  isLoading: boolean;
  error: Error | null;
};

export function useCreateAppointment() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (data: CreateAppointmentRequest): Promise<Appointment> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await createAppointment(data);
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

export function useUpdateAppointment() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await updateAppointment(id, data);
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

export function useCancelAppointment() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (id: string): Promise<Appointment> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await cancelAppointment(id);
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
