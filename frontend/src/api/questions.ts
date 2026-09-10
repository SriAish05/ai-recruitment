import api from '@/lib/axios'
import type { Evaluation } from '@/types'

export const questionsApi = {
  async generate(resumeId: number): Promise<Evaluation> {
    const { data } = await api.post<Evaluation>('/questions/generate', null, {
      params: { resumeId },
    })
    return data
  },
}
