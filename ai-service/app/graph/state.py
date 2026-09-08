from typing_extensions import TypedDict


class RecruitmentState(TypedDict):
    job_description: str
    resume_text: str
    match_score: float
    recommendation: str
    rationale: str
    technical: list
    behavioural: list
    interview_transcript: str
    strengths: list
    concerns: list
