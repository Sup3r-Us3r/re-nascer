import { useState, useCallback } from 'react';
import { ApiError } from '@/services/api';
import { toast } from 'sonner';

interface UseApiOptions {
  onSuccess?: (data?: unknown) => void;
  onError?: (error: ApiError) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>, options: UseApiOptions = {}) => {
      const {
        onSuccess,
        onError,
        showSuccessToast = false,
        showErrorToast = true,
        successMessage,
        errorMessage,
      } = options;

      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError =
          err instanceof ApiError ? err : new ApiError(0, 'Erro desconhecido');
        setError(apiError);

        if (showErrorToast) {
          const message = errorMessage || apiError.message;
          toast.error(message);
        }

        onError?.(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
}
