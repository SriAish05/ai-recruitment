import { CopyButton } from '@/components/CopyButton'
import { Skeleton } from '@/components/ui/skeleton'
import type { QuestionSet } from '@/types'

interface QuestionSectionProps {
  title: string
  items: string[]
}

function QuestionSection({ title, items }: QuestionSectionProps) {
  if (items.length === 0) return null

  return (
    <section aria-label={title}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground tabular-nums">
            {items.length} {items.length === 1 ? 'question' : 'questions'}
          </span>
          <CopyButton
            text={items.map((q, i) => `${i + 1}. ${q}`).join('\n')}
            label={`Copy all ${title.toLowerCase()}`}
          />
        </div>
      </div>
      <ol className="mt-3 divide-y rounded-lg border bg-card">
        {items.map((question, index) => (
          <li key={index} className="group flex items-start gap-4 px-4 py-3.5">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-[11px] font-medium text-muted-foreground tabular-nums"
            >
              {index + 1}
            </span>
            <p className="flex-1 text-sm leading-6">{question}</p>
            <CopyButton
              text={question}
              label="Copy question"
              className="-my-1 shrink-0 lg:opacity-0 lg:transition-opacity lg:focus-visible:opacity-100 lg:group-hover:opacity-100"
            />
          </li>
        ))}
      </ol>
    </section>
  )
}

interface QuestionListProps {
  questions: QuestionSet
}

export function QuestionList({ questions }: QuestionListProps) {
  return (
    <div className="space-y-8">
      <QuestionSection title="Technical questions" items={questions.technical} />
      <QuestionSection title="Behavioural questions" items={questions.behavioural} />
    </div>
  )
}

function QuestionSectionSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="mt-3 divide-y rounded-lg border bg-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 px-4 py-3.5">
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuestionListSkeleton() {
  return (
    <div className="space-y-8">
      <QuestionSectionSkeleton />
      <QuestionSectionSkeleton />
    </div>
  )
}
