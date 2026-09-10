import { AlertCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retrying?: boolean
  className?: string
}

export function ErrorState({
  title = "Couldn't load this",
  message,
  onRetry,
  retrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-card text-destructive">
        <AlertCircle className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={onRetry}
          disabled={retrying}
        >
          <RefreshCw className={cn(retrying && 'animate-spin')} aria-hidden="true" />
          {retrying ? 'Retrying' : 'Try again'}
        </Button>
      )}
    </div>
  )
}
