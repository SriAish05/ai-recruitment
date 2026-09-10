import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { interviewApi } from '@/api/interview'
import { jobsApi } from '@/api/jobs'
import { EvaluationResult, EvaluationResultSkeleton } from '@/components/interview/EvaluationResult'
import { HitlGate } from '@/components/interview/HitlGate'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/errors'
import type { Evaluation } from '@/types'

const schema = z.object({
  candidateId: z.string().regex(/^\d+$/, 'Enter a numeric candidate ID'),
  jobId: z.string().min(1, 'Select a job'),
  transcript: z.string().trim().min(50, 'Paste at least 50 characters of transcript'),
})

type FormValues = z.infer<typeof schema>

interface EvaluateTabProps {
  prefillCandidateId?: number
  prefillJobId?: number
}

export function EvaluateTab({ prefillCandidateId, prefillJobId }: EvaluateTabProps) {
  const queryClient = useQueryClient()
  const jobsQuery = useQuery({ queryKey: ['jobs'], queryFn: jobsApi.getAll })
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      candidateId: prefillCandidateId ? String(prefillCandidateId) : '',
      jobId: prefillJobId ? String(prefillJobId) : '',
      transcript: '',
    },
  })

  const transcriptLength = watch('transcript').length

  const mutation = useMutation({
    mutationFn: interviewApi.evaluate,
    onSuccess: (data) => {
      setEvaluation(data)
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['evaluations'] })
      toast.success('Interview evaluated')
    },
    onError: (error) => {
      toast.error('Evaluation failed', { description: getErrorMessage(error) })
    },
  })

  const onSubmit = (values: FormValues) => {
    setEvaluation(null)
    mutation.mutate({
      candidateId: Number(values.candidateId),
      jobId: Number(values.jobId),
      transcript: values.transcript,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="candidate-id">Candidate ID</Label>
                <Input
                  id="candidate-id"
                  inputMode="numeric"
                  placeholder="e.g. 4"
                  className="tabular-nums"
                  disabled={mutation.isPending}
                  aria-invalid={errors.candidateId ? true : undefined}
                  aria-describedby={errors.candidateId ? 'candidate-id-error' : undefined}
                  {...register('candidateId')}
                />
                {errors.candidateId && (
                  <p id="candidate-id-error" className="text-xs text-destructive">
                    {errors.candidateId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluate-job">Job</Label>
                <Controller
                  control={control}
                  name="jobId"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={mutation.isPending || jobsQuery.isPending}
                    >
                      <SelectTrigger id="evaluate-job" aria-invalid={errors.jobId ? true : undefined}>
                        <SelectValue placeholder={jobsQuery.isPending ? 'Loading jobs…' : 'Select a job'} />
                      </SelectTrigger>
                      <SelectContent>
                        {jobsQuery.data?.map((job) => (
                          <SelectItem key={job.id} value={String(job.id)}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jobId && <p className="text-xs text-destructive">{errors.jobId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcript">Interview transcript</Label>
              <div className="relative">
                <Textarea
                  id="transcript"
                  rows={12}
                  placeholder="Paste the interview transcript here…"
                  className="min-h-[288px] resize-y pb-8 font-mono text-sm leading-6"
                  disabled={mutation.isPending}
                  aria-invalid={errors.transcript ? true : undefined}
                  aria-describedby={errors.transcript ? 'transcript-error' : 'transcript-count'}
                  {...register('transcript')}
                />
                <span
                  id="transcript-count"
                  className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground tabular-nums"
                >
                  {transcriptLength.toLocaleString()} chars
                </span>
              </div>
              {errors.transcript && (
                <p id="transcript-error" className="text-xs text-destructive">
                  {errors.transcript.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={!isValid || mutation.isPending}>
                {mutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
                Evaluate interview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div aria-live="polite">
        {mutation.isPending && <EvaluationResultSkeleton />}

        <AnimatePresence>
          {evaluation && (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="space-y-6"
            >
              <EvaluationResult evaluation={evaluation} />
              <HitlGate evaluation={evaluation} onEvaluationChange={setEvaluation} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
