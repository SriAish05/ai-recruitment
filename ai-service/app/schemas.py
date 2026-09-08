from typing import Literal
from pydantic import BaseModel, Field


class ScreenRequest(BaseModel):
    job_description: str
    resume_text: str


class ScreeningResult(BaseModel):
    match_score: float = Field(ge=0, le=100)
    recommendation: Literal["HIRE", "CONSIDER", "REJECT"]
    rationale: str


class QuestionSet(BaseModel):
    technical: list[str]
    behavioural: list[str]


class EvaluationRequest(BaseModel):
    job_description: str
    resume_text: str
    interview_transcript: str


class EvaluationResult(BaseModel):
    recommendation: Literal["HIRE", "CONSIDER", "REJECT"]
    rationale: str
    strengths: list[str]
    concerns: list[str]
