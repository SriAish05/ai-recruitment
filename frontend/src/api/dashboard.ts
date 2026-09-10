import api from '@/lib/axios'
import type { DashboardStats, RecentEvaluation } from '@/types'

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return data
  },

  async getRecentEvaluations(limit = 5): Promise<RecentEvaluation[]> {
    const { data } = await api.get<RecentEvaluation[]>('/evaluations/recent', {
      params: { limit },
    })
    return data
  },
}
