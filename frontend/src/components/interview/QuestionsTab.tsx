import { useMutation } from '@tanstack/react-query'
import { AlertCircle, Loader2, MessageSquare } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { questionsApi } from '@/api/questions'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { RecommendationBadge } from '@/components/RecommendationBadge'
import { QuestionList, QuestionListSkeleton } from '@/components/interview/QuestionList'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/errors'
import { parseQuestionSet } from '@/lib/parse'

interface QuestionsTabProps {
  prefillResumeId?: number
}

export function QuestionsTab({ prefillResumeId }: QuestionsTabProps) {
  const [resumeId, setResumeId] = useState(prefillResumeId ? String(prefillResumeId) : '')
  const parsedId = /^\d+$/.test(resumeId) ? Number(resumeId) : null

  const mutation = useMutation({
    mutationFn: questionsApi.generate,
    onSuccess: () => toast.success('Interview questions generated'),
    onError: (error) => {
      toast.error('Could not generate questions', { description: getErrorMessage(error) })
    },
  })

  const questions = useMemo(
    () => (mutation.data ? parseQuestionSet(mutation.data.questions) : null),
    [mutation.data]
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (parsedId === null || mutation.isPending) return
    mutation.mutate(parsedId)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end" noValidate>
            <div className="flex-1 space-y-2 sm:max-w-xs">
              <Label htmlFor="resume-id">Resume ID</Label>
              <Input
                id="resume-id"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 12"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value.replace(/[^\d]/g, ''))}
                disabled={mutation.isPending}
                className="tabular-nums"
                aria-describedby="resume-id-hint"
              />
              <p id="resume-id-hint" className="text-xs text-muted-foreground">
                Returned by the Screen step, or pre-filled when you arrive from a screening result.
              </p>
            </div>
            <Button type="submit" disabled={parsedId === null || mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
              Generate questions
            </Button>
          </form>
        </CardContent>
      </Card>

      <div aria-live="polite">
        {mutation.isPending ? (
          <QuestionListSkeleton />
        ) : mutation.isError ? (
          <ErrorState
            title="Generation failed"
            message={getErrorMessage(mutation.error)}
            onRetry={parsedId === null ? undefined : () => mutation.mutate(parsedId)}
          />
        ) : mutation.isSuccess ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span>
                Based on screening evaluation{' '}
                <span className="font-medium text-foreground tabular-nums">#{mutation.data.id}</span>
              </span>
              <span aria-hidden="true">·</span>
              <RecommendationBadge value={mutation.data.recommendation} />
            </div>
            {questions ? (
              <QuestionList questions={questions} />
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertTitle>Questions generated, but not returned</AlertTitle>
                <AlertDescription>
                  The evaluation was updated, but the API response did not include the question
                  text. Once the backend returns the <code className="text-xs">questions</code> field
                  they will appear here.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No questions yet"
            description="Enter a resume ID to generate interview questions tailored to the candidate and role."
          />
        )}
      </div>
    </div>
  )
}
