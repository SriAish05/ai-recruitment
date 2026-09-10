import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
import { getErrorMessage } from '@/lib/errors'
import type { Job } from '@/types'

interface DeleteJobDialogProps {
  job: Job | null
  onOpenChange: (open: boolean) => void
}

export function DeleteJobDialog({ job, onOpenChange }: DeleteJobDialogProps) {
  const queryClient = useQueryClient()

  // Keep the last job so the copy doesn't blank out during the close animation.
  const [displayed, setDisplayed] = useState<Job | null>(job)
  if (job && job !== displayed) setDisplayed(job)

  const mutation = useMutation({
    mutationFn: (id: number) => jobsApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted')
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error('Could not delete job', { description: getErrorMessage(error) })
    },
  })

  return (
    <Dialog open={job !== null} onOpenChange={(next) => !mutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete job?</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{displayed?.title}</span> will be permanently
            removed. Evaluations linked to it may lose their reference.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => displayed && mutation.mutate(displayed.id)}
            disabled={mutation.isPending || !displayed}
          >
            {mutation.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
