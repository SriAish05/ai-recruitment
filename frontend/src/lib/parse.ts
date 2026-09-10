import type { InterviewDetails, QuestionSet } from '@/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}

function safeParse(raw: string | null | undefined): unknown {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function parseQuestionSet(raw: string | null | undefined): QuestionSet | null {
  const parsed = safeParse(raw)
  if (!isRecord(parsed)) return null
  const technical = toStringArray(parsed.technical)
  const behavioural = toStringArray(parsed.behavioural ?? parsed.behavioral)
  if (technical.length === 0 && behavioural.length === 0) return null
  return { technical, behavioural }
}

export function parseInterviewDetails(raw: string | null | undefined): InterviewDetails | null {
  const parsed = safeParse(raw)
  if (!isRecord(parsed)) return null
  const strengths = toStringArray(parsed.strengths)
  const concerns = toStringArray(parsed.concerns)
  if (strengths.length === 0 && concerns.length === 0) return null
  return { strengths, concerns }
}
