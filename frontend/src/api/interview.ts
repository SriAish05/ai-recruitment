import api from '@/lib/axios'
import type { Evaluation, InterviewEvaluationRequest, InviteResponse } from '@/types'

export const interviewApi = {
  async evaluate(body: InterviewEvaluationRequest): Promise<Evaluation> {
    const { data } = await api.post<Evaluation>('/interview/evaluate', body)
    return data
  },

  async approve(evaluationId: number): Promise<Evaluation> {
    const { data } = await api.post<Evaluation>(`/interview/${evaluationId}/approve`)
    return data
  },

  async reject(evaluationId: number): Promise<Evaluation> {
    const { data } = await api.post<Evaluation>(`/interview/${evaluationId}/reject`)
    return data
  },

  async sendInvite(evaluationId: number): Promise<InviteResponse> {
    const { data } = await api.post<InviteResponse>(`/interview/${evaluationId}/send-invite`)
    return data
  },
}
