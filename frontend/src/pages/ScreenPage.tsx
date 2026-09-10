import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { resumesApi } from '@/api/resumes'
import { ErrorState } from '@/components/ErrorState'
import { PageHeader } from '@/components/PageHeader'
import { ScreenEmpty } from '@/components/screen/ScreenEmpty'
import { ScreenForm, type ScreenFormValues } from '@/components/screen/ScreenForm'
import { ScreenResult } from '@/components/screen/ScreenResult'
import { ScreenResultSkeleton } from '@/components/screen/ScreenResultSkeleton'
import { Card, CardContent } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/errors'
import type { Evaluation, Resume } from '@/types'

type ScreenState =
  | { status: 'idle' }
  | { status: 'uploading' }
  | { status: 'screening'; resume: Resume }
  | { status: 'error'; message: string; resume: Resume | null }
  | { status: 'done'; resume: Resume; evaluation: Evaluation }

export function ScreenPage() {
  const queryClient = useQueryClient()
  const [state, setState] = useState<ScreenState>({ status: 'idle' })
  const [formKey, setFormKey] = useState(0)

  const upload = useMutation({ mutationFn: resumesApi.upload })
  const screen = useMutation({ mutationFn: resumesApi.runScreening })

  const runScreening = async (resume: Resume) => {
    setState({ status: 'screening', resume })
    try {
      const evaluation = await screen.mutateAsync(resume.resumeId)
      setState({ status: 'done', resume, evaluation })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['evaluations'] })
    } catch (error) {
      const message = getErrorMessage(error)
      setState({ status: 'error', message, resume })
      toast.error('Screening failed', { description: message })
    }
  }

  const handleSubmit = async (values: ScreenFormValues) => {
    setState({ status: 'uploading' })
    let resume: Resume
    try {
      resume = await upload.mutateAsync({
        file: values.file,
        candidateName: values.candidateName,
        candidateEmail: values.candidateEmail,
        jobId: Number(values.jobId),
      })
    } catch (error) {
      const message = getErrorMessage(error)
      setState({ status: 'error', message, resume: null })
      toast.error('Upload failed', { description: message })
      return
    }
    await runScreening(resume)
  }

  const reset = () => {
    setState({ status: 'idle' })
    setFormKey((k) => k + 1)
  }

  const retryResume = state.status === 'error' ? state.resume : null
  const busy = state.status === 'uploading' || state.status === 'screening'
  const busyLabel =
    state.status === 'uploading'
      ? 'Uploading resume…'
      : state.status === 'screening'
        ? 'Screening…'
        : undefined

  return (
    <div>
      <PageHeader
        title="Screen"
        description="Upload a candidate resume and let the AI screen it against a job description."
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
        <Card className="h-fit">
          <CardContent className="p-6">
            <ScreenForm key={formKey} onSubmit={handleSubmit} busy={busy} busyLabel={busyLabel} />
          </CardContent>
        </Card>

        <div aria-live="polite">
          {state.status === 'idle' && <ScreenEmpty />}

          {state.status === 'uploading' && <ScreenResultSkeleton statusLabel="Uploading resume" />}

          {state.status === 'screening' && (
            <ScreenResultSkeleton statusLabel="Analysing against job description" />
          )}

          {state.status === 'error' && (
            <ErrorState
              className="min-h-[420px]"
              title={state.resume ? 'Screening failed' : 'Upload failed'}
              message={
                state.resume
                  ? `The resume was uploaded (#${state.resume.resumeId}) but the AI screening did not complete. ${state.message}`
                  : state.message
              }
              onRetry={retryResume ? () => void runScreening(retryResume) : undefined}
              retrying={screen.isPending}
            />
          )}

          {state.status === 'done' && (
            <ScreenResult resume={state.resume} evaluation={state.evaluation} onReset={reset} />
          )}
        </div>
      </div>
    </div>
  )
}
