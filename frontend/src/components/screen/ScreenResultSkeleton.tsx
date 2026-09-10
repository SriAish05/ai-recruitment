import { Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ScreenResultSkeletonProps {
  statusLabel: string
}

export function ScreenResultSkeleton({ statusLabel }: ScreenResultSkeletonProps) {
  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div
            role="status"
            aria-live="polite"
            className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            {statusLabel}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row">
          <Skeleton className="h-[168px] w-[168px] shrink-0 rounded-full" />
          <div className="flex w-full flex-col items-center gap-3 sm:items-start">
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-4 w-64 max-w-full" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        <div className="mt-8 rounded-md border bg-muted/40 p-4">
          <Skeleton className="h-3 w-20" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        <Skeleton className="mt-4 h-3 w-72 max-w-full" />

        <div className="mt-6 flex justify-end gap-2">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-56 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
