import { useCallback, useState } from "react";
import { apiCall } from "@/lib/utils";

export interface ApiHookState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApiCall<T>(endpoint: string, initialOptions: RequestInit = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (options: RequestInit = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall<T>(endpoint, { ...initialOptions, ...options });
        setData(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, initialOptions]
  );

  return {
    data,
    error,
    loading,
    execute,
  };
}
