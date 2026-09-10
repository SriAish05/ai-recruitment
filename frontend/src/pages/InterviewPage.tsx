import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { PageHeader } from '@/components/PageHeader'
import { EvaluateTab } from '@/components/interview/EvaluateTab'
import { QuestionsTab } from '@/components/interview/QuestionsTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface InterviewPrefill {
  resumeId?: number
  candidateId?: number
  jobId?: number
}

function readPrefill(state: unknown): InterviewPrefill {
  if (typeof state !== 'object' || state === null) return {}
  const record = state as Record<string, unknown>
  const pick = (key: string) => {
    const value = record[key]
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined
  }
  return { resumeId: pick('resumeId'), candidateId: pick('candidateId'), jobId: pick('jobId') }
}

type InterviewTab = 'questions' | 'evaluate'

export function InterviewPage() {
  const location = useLocation()
  const [prefill] = useState<InterviewPrefill>(() => readPrefill(location.state))
  const [tab, setTab] = useState<InterviewTab>('questions')

  return (
    <div>
      <PageHeader
        title="Interview"
        description="Generate tailored questions, then evaluate the interview transcript."
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value === 'evaluate' ? 'evaluate' : 'questions')}>
        <TabsList>
          <TabsTrigger value="questions">Generate questions</TabsTrigger>
          <TabsTrigger value="evaluate">Evaluate interview</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" forceMount className="mt-6 data-[state=inactive]:hidden">
          <QuestionsTab prefillResumeId={prefill.resumeId} />
        </TabsContent>

        <TabsContent value="evaluate" forceMount className="mt-6 data-[state=inactive]:hidden">
          <EvaluateTab prefillCandidateId={prefill.candidateId} prefillJobId={prefill.jobId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
