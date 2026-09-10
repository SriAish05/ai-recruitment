import { useQuery } from '@tanstack/react-query'
import { Briefcase, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { jobsApi } from '@/api/jobs'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { PageHeader } from '@/components/PageHeader'
import { DeleteJobDialog } from '@/components/jobs/DeleteJobDialog'
import { JobCard, JobCardSkeleton } from '@/components/jobs/JobCard'
import { NewJobDialog } from '@/components/jobs/NewJobDialog'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/errors'
import type { Job } from '@/types'

export function JobsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)

  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
  })

  const jobs = useMemo(
    () => (jobsQuery.data ? [...jobsQuery.data].sort((a, b) => b.id - a.id) : []),
    [jobsQuery.data]
  )

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Job descriptions the AI screens candidates against."
        action={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden="true" />
            New job
          </Button>
        }
      />

      {jobsQuery.isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobsQuery.isError ? (
        <ErrorState
          title="Jobs unavailable"
          message={getErrorMessage(jobsQuery.error)}
          onRetry={() => jobsQuery.refetch()}
          retrying={jobsQuery.isFetching}
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Create your first job description to start screening resumes against it."
          action={
            <Button type="button" onClick={() => setCreateOpen(true)}>
              <Plus aria-hidden="true" />
              Create your first job
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={setJobToDelete} />
          ))}
        </div>
      )}

      <NewJobDialog open={createOpen} onOpenChange={setCreateOpen} />
      <DeleteJobDialog job={jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)} />
    </div>
  )
}
