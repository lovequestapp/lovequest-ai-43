
import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to handle async API queries with loading, error, and data states.
 * This solves the common issue of attempting to use Promise results directly in state
 * or render cycles.
 */
export const useAsyncQuery = <T>(
  queryFn: () => Promise<T>,
  initialData: T,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return initialData;
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, initialData]);

  // Execute the query when dependencies change
  useEffect(() => {
    execute();
  }, [...dependencies, execute]);

  // Function to manually refetch
  const refetch = () => {
    return execute();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    setData, // Expose setter for manual updates
  };
};

/**
 * A wrapper around useAsyncQuery specifically for paginated data
 */
export const usePaginatedQuery = <T>(
  queryFn: (page: number, limit: number) => Promise<T[]>,
  initialData: T[] = [],
  initialLimit: number = 10
) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchData = useCallback(async () => {
    const result = await queryFn(page, limit);
    setHasMore(result.length === limit);
    return result;
  }, [queryFn, page, limit]);
  
  const { data, isLoading, error, refetch } = useAsyncQuery<T[]>(
    fetchData,
    initialData,
    [page, limit]
  );
  
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);
  
  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);
  
  return {
    data,
    isLoading,
    error,
    page,
    limit,
    hasMore,
    loadMore,
    refetch,
    resetPagination,
    setLimit
  };
};
