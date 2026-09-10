import { Skeleton } from '@/components/ui/skeleton'

export function PageFallback() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      <Skeleton className="mt-8 h-64 w-full rounded-lg" />
    </div>
  )
}
