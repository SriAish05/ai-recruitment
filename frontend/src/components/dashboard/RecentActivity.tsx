import { Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative, initials } from '@/lib/format'
import type { RecentEvaluation, Stage } from '@/types'

const stageLabels: Record<Stage, string> = {
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
}

function ActivityShell({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Recent activity</CardTitle>
        <CardDescription>Latest evaluations across all jobs.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}

interface RecentActivityProps {
  items: RecentEvaluation[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <ActivityShell>
        <div className="px-6 pb-6">
          <EmptyState
            icon={Inbox}
            title="No activity yet"
            description="Screen a resume and evaluations will show up here."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/screen">Screen a resume</Link>
              </Button>
            }
          />
        </div>
      </ActivityShell>
    )
  }

  return (
    <ActivityShell>
      <ul className="divide-y border-t">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 px-6 py-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-muted text-xs font-medium">
                {initials(item.candidateName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.candidateName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.jobTitle} · {stageLabels[item.stage]}
              </p>
            </div>
            <StatusBadge value={item.status} />
            <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground tabular-nums sm:block">
              {formatRelative(item.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </ActivityShell>
  )
}

export function RecentActivitySkeleton() {
  return (
    <ActivityShell>
      <ul className="divide-y border-t">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 px-6 py-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="hidden h-3 w-16 sm:block" />
          </li>
        ))}
      </ul>
    </ActivityShell>
  )
}
