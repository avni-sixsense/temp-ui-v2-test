import { QueryClient } from 'react-query';

export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 5 * 1000,
      retry: 1
    }
  }
});
