import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'

interface StatCardProps {
  label: string
  value: number
  helper?: string
  icon?: LucideIcon
}

export function StatCard({ label, value, helper, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />}
        </div>
        <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{formatNumber(value)}</p>
        {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
      </CardContent>
    </Card>
  )
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-4 rounded-sm" />
        </div>
        <Skeleton className="mt-3 h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-36" />
      </CardContent>
    </Card>
  )
}
