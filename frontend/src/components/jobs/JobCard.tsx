import { MoreHorizontal, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative } from '@/lib/format'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  onDelete: (job: Job) => void
}

export function JobCard({ job, onDelete }: JobCardProps) {
  const created = formatRelative(job.createdAt)

  return (
    <Card className="flex h-full flex-col transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
      <CardContent className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-medium leading-6">{job.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${job.title}`}
                className="-mr-2 -mt-1 shrink-0 text-muted-foreground"
              >
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onDelete(job)}
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{job.description}</p>

        <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
          <span className="tabular-nums">#{job.id}</span>
          {created && (
            <>
              <span aria-hidden="true">·</span>
              <span>Created {created}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function JobCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="mt-5 h-3 w-24" />
      </CardContent>
    </Card>
  )
}
