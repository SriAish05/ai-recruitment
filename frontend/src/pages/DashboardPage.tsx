import { useQuery } from '@tanstack/react-query'
import { Briefcase, ClipboardList, Users } from 'lucide-react'

import { dashboardApi } from '@/api/dashboard'
import { ErrorState } from '@/components/ErrorState'
import { PageHeader } from '@/components/PageHeader'
import { RecentActivity, RecentActivitySkeleton } from '@/components/dashboard/RecentActivity'
import { StatCard, StatCardSkeleton } from '@/components/dashboard/StatCard'
import { getErrorMessage } from '@/lib/errors'

export function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  })

  const recentQuery = useQuery({
    queryKey: ['evaluations', 'recent'],
    queryFn: () => dashboardApi.getRecentEvaluations(5),
  })

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your hiring pipeline." />

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statsQuery.isPending ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : statsQuery.isError ? (
            <ErrorState
              className="sm:col-span-2 lg:col-span-3"
              title="Stats unavailable"
              message={getErrorMessage(statsQuery.error)}
              onRetry={() => statsQuery.refetch()}
              retrying={statsQuery.isFetching}
            />
          ) : (
            <>
              <StatCard
                label="Total jobs"
                value={statsQuery.data.totalJobs}
                helper="Open job descriptions"
                icon={Briefcase}
              />
              <StatCard
                label="Total candidates"
                value={statsQuery.data.totalCandidates}
                helper="Unique applicants screened"
                icon={Users}
              />
              <StatCard
                label="Pending evaluations"
                value={statsQuery.data.pendingEvaluations}
                helper="Awaiting HR review"
                icon={ClipboardList}
              />
            </>
          )}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="sr-only">
          Recent activity
        </h2>
        {recentQuery.isPending ? (
          <RecentActivitySkeleton />
        ) : recentQuery.isError ? (
          <ErrorState
            title="Activity unavailable"
            message={getErrorMessage(recentQuery.error)}
            onRetry={() => recentQuery.refetch()}
            retrying={recentQuery.isFetching}
          />
        ) : (
          <RecentActivity items={recentQuery.data} />
        )}
      </section>
    </div>
  )
}
