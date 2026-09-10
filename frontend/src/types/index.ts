export type Stage = 'SCREENING' | 'INTERVIEW'
export type Recommendation = 'HIRE' | 'CONSIDER' | 'REJECT'
export type EvaluationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Job {
  id: number
  title: string
  description: string
  createdAt?: string
}

export interface Candidate {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface Resume {
  resumeId: number
  candidateId: number
  candidateEmail: string
  jobTitle: string
  extractedTextPreview: string
}

export interface Evaluation {
  id: number
  candidateId: number
  jobId: number
  stage: Stage
  matchScore: number | null
  recommendation: Recommendation
  rationale: string
  questions?: string | null
  status: EvaluationStatus
  createdAt: string
}

export interface AuthResponse {
  token: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface CreateJobRequest {
  title: string
  description: string
}

export interface UploadResumeRequest {
  file: File
  candidateName: string
  candidateEmail: string
  jobId: number
}

export interface InterviewEvaluationRequest {
  candidateId: number
  jobId: number
  transcript: string
}

export interface QuestionSet {
  technical: string[]
  behavioural: string[]
}

export interface InterviewDetails {
  strengths: string[]
  concerns: string[]
}

export interface DashboardStats {
  totalJobs: number
  totalCandidates: number
  pendingEvaluations: number
}

export interface RecentEvaluation extends Evaluation {
  candidateName: string
  jobTitle: string
}

export interface InviteResponse {
  evaluationId: number
  sentAt: string
}
