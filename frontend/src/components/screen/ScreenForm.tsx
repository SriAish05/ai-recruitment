import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

import { jobsApi } from '@/api/jobs'
import { FileDropzone } from '@/components/FileDropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getErrorMessage } from '@/lib/errors'

const schema = z.object({
  jobId: z.string().min(1, 'Select a job'),
  candidateName: z.string().trim().min(2, 'Enter the candidate name'),
  candidateEmail: z.email('Enter a valid email address'),
  file: z.instanceof(File, { error: 'Upload a PDF resume' }),
})

export type ScreenFormValues = z.infer<typeof schema>

interface ScreenFormProps {
  onSubmit: (values: ScreenFormValues) => void
  busy: boolean
  busyLabel?: string
}

export function ScreenForm({ onSubmit, busy, busyLabel }: ScreenFormProps) {
  const jobsQuery = useQuery({ queryKey: ['jobs'], queryFn: jobsApi.getAll })

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ScreenFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { jobId: '', candidateName: '', candidateEmail: '' },
  })

  const selectedJobId = watch('jobId')
  const selectedJob = jobsQuery.data?.find((job) => String(job.id) === selectedJobId)
  const jobsEmpty = jobsQuery.isSuccess && jobsQuery.data.length === 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="job">Job</Label>
        <Controller
          control={control}
          name="jobId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={busy || jobsQuery.isPending || jobsEmpty}
            >
              <SelectTrigger
                id="job"
                aria-invalid={errors.jobId ? true : undefined}
                aria-describedby={errors.jobId ? 'job-error' : undefined}
              >
                <SelectValue
                  placeholder={
                    jobsQuery.isPending
                      ? 'Loading jobs…'
                      : jobsEmpty
                        ? 'No jobs yet'
                        : 'Select a job'
                  }
                />
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
        {errors.jobId && (
          <p id="job-error" className="text-xs text-destructive">
            {errors.jobId.message}
          </p>
        )}
        {jobsQuery.isError && (
          <p className="text-xs text-destructive">
            {getErrorMessage(jobsQuery.error)}{' '}
            <button
              type="button"
              onClick={() => jobsQuery.refetch()}
              className="font-medium underline underline-offset-4"
            >
              Retry
            </button>
          </p>
        )}
        {jobsEmpty && (
          <p className="text-xs text-muted-foreground">
            <Link to="/jobs" className="font-medium text-foreground underline-offset-4 hover:underline">
              Create a job
            </Link>{' '}
            before screening resumes.
          </p>
        )}
        {selectedJob && (
          <div className="rounded-md border bg-muted/40 px-3 py-2.5">
            <p className="line-clamp-4 text-xs leading-5 text-muted-foreground">
              {selectedJob.description}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="candidate-name">Candidate name</Label>
        <Input
          id="candidate-name"
          placeholder="Jane Doe"
          autoComplete="off"
          disabled={busy}
          aria-invalid={errors.candidateName ? true : undefined}
          aria-describedby={errors.candidateName ? 'candidate-name-error' : undefined}
          {...register('candidateName')}
        />
        {errors.candidateName && (
          <p id="candidate-name-error" className="text-xs text-destructive">
            {errors.candidateName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="candidate-email">Candidate email</Label>
        <Input
          id="candidate-email"
          type="email"
          placeholder="jane@example.com"
          autoComplete="off"
          disabled={busy}
          aria-invalid={errors.candidateEmail ? true : undefined}
          aria-describedby={errors.candidateEmail ? 'candidate-email-error' : undefined}
          {...register('candidateEmail')}
        />
        {errors.candidateEmail && (
          <p id="candidate-email-error" className="text-xs text-destructive">
            {errors.candidateEmail.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume-file">Resume</Label>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <FileDropzone
              id="resume-file"
              file={field.value ?? null}
              onChange={(file) => field.onChange(file ?? undefined)}
              disabled={busy}
              error={errors.file?.message}
            />
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={busy || !isValid}>
        {busy && <Loader2 className="animate-spin" aria-hidden="true" />}
        {busy ? (busyLabel ?? 'Working…') : 'Screen resume'}
      </Button>
    </form>
  )
}
