import { motion } from 'framer-motion'
import { ArrowRight, Info, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { RecommendationBadge } from '@/components/RecommendationBadge'
import { ScoreRing } from '@/components/ScoreRing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime, normaliseScore } from '@/lib/format'
import type { Evaluation, Recommendation, Resume } from '@/types'

const summaries: Record<Recommendation, string> = {
  HIRE: 'Strong match. Recommended to move forward to interview.',
  CONSIDER: 'Partial match. Worth a closer look before deciding.',
  REJECT: 'Weak match against this job description.',
}

export interface InterviewLocationState {
  resumeId: number
  candidateId: number
  jobId: number
  candidateEmail?: string
}

interface ScreenResultProps {
  resume: Resume
  evaluation: Evaluation
  onReset: () => void
}

export function ScreenResult({ resume, evaluation, onReset }: ScreenResultProps) {
  const navigate = useNavigate()
  const score = normaliseScore(evaluation.matchScore)
  const evaluatedAt = formatDateTime(evaluation.createdAt)

  const goToQuestions = () => {
    const state: InterviewLocationState = {
      resumeId: resume.resumeId,
      candidateId: resume.candidateId,
      jobId: evaluation.jobId,
      candidateEmail: resume.candidateEmail,
    }
    navigate('/interview', { state })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">Screening result</h2>
            <p className="truncate text-sm text-muted-foreground">
              {resume.candidateEmail} · {resume.jobTitle}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
            <ScoreRing value={score} />
            <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <RecommendationBadge value={evaluation.recommendation} size="lg" />
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                {summaries[evaluation.recommendation]}
              </p>
              {evaluatedAt && (
                <p className="text-xs text-muted-foreground tabular-nums">Evaluated {evaluatedAt}</p>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-md border bg-muted/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              AI analysis
            </div>
            <p className="mt-2 text-sm leading-6">{evaluation.rationale}</p>
          </div>

          <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            AI recommendations require HR review before any action is taken.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={onReset}>
              Screen another
            </Button>
            <Button type="button" onClick={goToQuestions}>
              Generate interview questions
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
