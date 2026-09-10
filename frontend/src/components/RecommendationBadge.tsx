import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Recommendation } from '@/types'

const styles: Record<Recommendation, string> = {
  HIRE: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  CONSIDER: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  REJECT: 'border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

const labels: Record<Recommendation, string> = {
  HIRE: 'Hire',
  CONSIDER: 'Consider',
  REJECT: 'Reject',
}

interface RecommendationBadgeProps {
  value: Recommendation
  size?: 'sm' | 'lg'
  className?: string
}

export function RecommendationBadge({ value, size = 'sm', className }: RecommendationBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(styles[value], size === 'lg' && 'px-3 py-1 text-sm', className)}
    >
      <span aria-hidden="true" className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {labels[value]}
    </Badge>
  )
}
