'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PaginatedData } from '@/types/contracts/api-response';
import { getClinicalHistories, getClinicalHistoryById, createClinicalHistory } from '../api/clinical-histories.api';
import type { ClinicalHistory, CreateClinicalHistoryRequest, ClinicalHistoriesListParams } from '../types/clinical-history.types';

type UseClinicalHistoryListState = {
  data: PaginatedData<ClinicalHistory> | null;
  isLoading: boolean;
  error: Error | null;
};

export function useClinicalHistoryList(params?: ClinicalHistoriesListParams) {
  const [state, setState] = useState<UseClinicalHistoryListState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const page = params?.page;
  const pageSize = params?.pageSize;
  const patientId = params?.patientId;

  const fetchHistories = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const requestParams: ClinicalHistoriesListParams | undefined =
        page === undefined && pageSize === undefined && patientId === undefined
          ? undefined
          : { page, pageSize, patientId };
      const data = await getClinicalHistories(requestParams);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [page, pageSize, patientId]);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  return {
    ...state,
    refetch: fetchHistories,
  };
}

type UseClinicalHistoryState = {
  data: ClinicalHistory | null;
  isLoading: boolean;
  error: Error | null;
};

export function useClinicalHistory(id: string) {
  const [state, setState] = useState<UseClinicalHistoryState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchHistory = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await getClinicalHistoryById(id);
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    ...state,
    refetch: fetchHistory,
  };
}

type MutationState = {
  isLoading: boolean;
  error: Error | null;
};

export function useCreateClinicalHistory() {
  const [state, setState] = useState<MutationState>({
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (data: CreateClinicalHistoryRequest): Promise<ClinicalHistory> => {
    setState({ isLoading: true, error: null });
    try {
      const result = await createClinicalHistory(data);
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
