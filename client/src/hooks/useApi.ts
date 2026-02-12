import { useState, useEffect } from "react";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (
    apiFunction: () => Promise<T>,
    options?: UseApiOptions,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const error =
        err?.response?.data?.message || err.message || "An error occurred";
      setError(new Error(error));
      options?.onError?.(error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

// Hook for fetching data on mount
export function useFetch<T>(apiFunction: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err: any) {
      const error =
        err?.response?.data?.message || err.message || "An error occurred";
      setError(new Error(error));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}
