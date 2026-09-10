import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { jobsApi } from '@/api/jobs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/errors'

const schema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters'),
})

type FormValues = z.infer<typeof schema>

interface NewJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewJobDialog({ open, onOpenChange }: NewJobDialogProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const mutation = useMutation({
    mutationFn: jobsApi.create,
    onSuccess: async (job) => {
      await queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job created', { description: job.title })
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Could not create job', { description: getErrorMessage(error) })
    },
  })

  const descriptionLength = watch('description').length

  return (
    <Dialog open={open} onOpenChange={(next) => !mutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New job</DialogTitle>
          <DialogDescription>
            Add a job description. Resumes will be screened against it.
          </DialogDescription>
        </DialogHeader>

        <form
          id="new-job-form"
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="job-title">Title</Label>
            <Input
              id="job-title"
              placeholder="Senior Backend Engineer"
              autoFocus
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? 'job-title-error' : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p id="job-title-error" className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="job-description">Description</Label>
              <span className="text-xs text-muted-foreground tabular-nums">{descriptionLength} chars</span>
            </div>
            <Textarea
              id="job-description"
              rows={8}
              placeholder="Responsibilities, required skills, experience level…"
              className="min-h-[12rem] resize-y leading-6"
              aria-invalid={errors.description ? true : undefined}
              aria-describedby={errors.description ? 'job-description-error' : undefined}
              {...register('description')}
            />
            {errors.description && (
              <p id="job-description-error" className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="new-job-form" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Create job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
