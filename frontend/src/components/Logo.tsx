import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showWordmark?: boolean
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 22V10h6.5a4 4 0 0 1 0 8H13.5" />
          <path d="M16 18l5 4" />
        </svg>
      </div>
      {showWordmark && <span className="text-sm font-semibold tracking-tight">Recruit</span>}
    </div>
  )
}
