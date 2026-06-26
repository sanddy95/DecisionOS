import { useQuery } from '@tanstack/react-query'

export function useMockQuery<T>(key: string[], data: T, delayMs = 400) {
  return useQuery({
    queryKey: key,
    queryFn: () => new Promise<T>(resolve => setTimeout(() => resolve(data), delayMs)),
    staleTime: Infinity,
  })
}
