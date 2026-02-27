/**
 * Custom React hook for API calls.
 * Provides typed wrapper around the API client.
 */

'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

interface UseApiState {
  isLoading: boolean;
  error: Error | null;
}

interface UseApiReturn<T> extends UseApiState {
  data: T | null;
  execute: (endpoint: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: unknown) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for making API calls with loading and error state.
 */
export function useApi<T = unknown>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState>({
    isLoading: false,
    error: null,
  });
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      body?: unknown
    ): Promise<T | null> => {
      setState({ isLoading: true, error: null });

      try {
        let result: T;

        switch (method) {
          case 'GET':
            result = await apiClient.get<T>(endpoint);
            break;
          case 'POST':
            result = await apiClient.post<T>(endpoint, body);
            break;
          case 'PUT':
            result = await apiClient.put<T>(endpoint, body);
            break;
          case 'DELETE':
            result = await apiClient.delete<T>(endpoint);
            break;
        }

        setData(result);
        setState({ isLoading: false, error: null });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState({ isLoading: false, error: err });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
    setData(null);
  }, []);

  return {
    data,
    isLoading: state.isLoading,
    error: state.error,
    execute,
    reset,
  };
}

/**
 * Hook for fetching data with automatic error handling.
 */
export function useFetch<T>(
  endpoint: string,
  options?: { enabled?: boolean; refreshInterval?: number }
): { data: T | null; isLoading: boolean; error: Error | null; refetch: () => void } {
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await apiClient.get<ApiResponse<T>>(endpoint);
      
      if ('success' in result && result.success) {
        setState({
          data: result.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to fetch data');
      setState({
        data: null,
        isLoading: false,
        error: err,
      });
    }
  }, [endpoint]);

  // Initial fetch
  if (options?.enabled !== false && !state.isLoading && !state.data) {
    fetchData();
  }

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refetch: fetchData,
  };
}
