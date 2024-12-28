import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // Data is considered fresh for 1 minute
      retry: 2, // Number of retries on failure
      refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    },
  },
});