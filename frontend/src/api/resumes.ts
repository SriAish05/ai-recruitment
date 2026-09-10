import api from '@/lib/axios'
import type { Evaluation, Resume, UploadResumeRequest } from '@/types'

export const resumesApi = {
  async upload(body: UploadResumeRequest): Promise<Resume> {
    const form = new FormData()
    form.append('file', body.file)
    form.append('candidateName', body.candidateName)
    form.append('candidateEmail', body.candidateEmail)
    form.append('jobId', String(body.jobId))
    const { data } = await api.post<Resume>('/resumes/upload', form)
    return data
  },

  async runScreening(resumeId: number): Promise<Evaluation> {
    const { data } = await api.post<Evaluation>('/screening/run', null, {
      params: { resumeId },
    })
    return data
  },
}
