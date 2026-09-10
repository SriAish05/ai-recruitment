import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { EvaluationStatus } from '@/types'

const styles: Record<EvaluationStatus, string> = {
  PENDING: 'border-transparent bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  APPROVED: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  REJECTED: 'border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

const labels: Record<EvaluationStatus, string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

interface StatusBadgeProps {
  value: EvaluationStatus
  className?: string
}

export function StatusBadge({ value, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(styles[value], className)}>
      <span aria-hidden="true" className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {labels[value]}
    </Badge>
  )
}
