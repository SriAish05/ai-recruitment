import api from '@/lib/axios'
import type { CreateJobRequest, Job } from '@/types'

export const jobsApi = {
  async getAll(): Promise<Job[]> {
    const { data } = await api.get<Job[]>('/jobs')
    return data
  },

  async getById(id: number): Promise<Job> {
    const { data } = await api.get<Job>(`/jobs/${id}`)
    return data
  },

  async create(body: CreateJobRequest): Promise<Job> {
    const { data } = await api.post<Job>('/jobs', body)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`)
  },
}
