import { AlertCircle, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { useMemo } from 'react'

import { RecommendationBadge } from '@/components/RecommendationBadge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { parseInterviewDetails } from '@/lib/parse'
import type { Evaluation } from '@/types'

interface DetailListProps {
  title: string
  items: string[]
  tone: 'positive' | 'warning'
}

function DetailList({ title, items, tone }: DetailListProps) {
  const Icon = tone === 'positive' ? CheckCircle2 : AlertTriangle
  const iconClass =
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-amber-600 dark:text-amber-400'

  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.length === 0 && <li className="text-sm text-muted-foreground">None noted.</li>}
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-6">
            <Icon className={`mt-1 h-4 w-4 shrink-0 ${iconClass}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface EvaluationResultProps {
  evaluation: Evaluation
}

export function EvaluationResult({ evaluation }: EvaluationResultProps) {
  const details = useMemo(() => parseInterviewDetails(evaluation.questions), [evaluation.questions])

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <RecommendationBadge value={evaluation.recommendation} size="lg" />
          <span className="text-sm text-muted-foreground">
            Interview evaluation{' '}
            <span className="font-medium text-foreground tabular-nums">#{evaluation.id}</span>
          </span>
        </div>

        <div className="rounded-md border bg-muted/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI analysis
          </div>
          <p className="mt-2 text-sm leading-6">{evaluation.rationale}</p>
        </div>

        {details ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <DetailList title="Strengths" items={details.strengths} tone="positive" />
            <DetailList title="Concerns" items={details.concerns} tone="warning" />
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertTitle>Strengths and concerns not returned</AlertTitle>
            <AlertDescription>
              The API response did not include the detailed breakdown. The recommendation and
              rationale above are still valid.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function EvaluationResultSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-24 rounded-md" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="rounded-md border bg-muted/40 p-4">
          <Skeleton className="h-3 w-20" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
