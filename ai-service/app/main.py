from dotenv import load_dotenv
load_dotenv()

from uuid import uuid4
from fastapi import FastAPI
from app.schemas import ScreenRequest, ScreeningResult, EvaluationRequest, EvaluationResult
from app.graph.pipeline import compiled_graph
from app.agents.evaluation_agent import evaluation_node

app = FastAPI(title="AI Recruitment Service")


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-recruitment"}


@app.post("/screen", response_model=ScreeningResult)
def screen(request: ScreenRequest):
    state = {
        "job_description": request.job_description,
        "resume_text": request.resume_text,
        "match_score": 0.0,
        "recommendation": "",
        "rationale": "",
        "technical": [],
        "behavioural": [],
        "interview_transcript": "",
        "strengths": [],
        "concerns": [],
    }
    result = compiled_graph.invoke(
        state,
        config={"configurable": {"thread_id": str(uuid4())}},
    )
    return ScreeningResult(
        match_score=result["match_score"],
        recommendation=result["recommendation"],
        rationale=result["rationale"],
    )


@app.post("/pipeline/run")
def pipeline_run(request: ScreenRequest):
    state = {
        "job_description": request.job_description,
        "resume_text": request.resume_text,
        "match_score": 0.0,
        "recommendation": "",
        "rationale": "",
        "technical": [],
        "behavioural": [],
        "interview_transcript": "",
        "strengths": [],
        "concerns": [],
    }
    result = compiled_graph.invoke(
        state,
        config={"configurable": {"thread_id": str(uuid4())}},
    )
    return {
        "match_score": result["match_score"],
        "recommendation": result["recommendation"],
        "rationale": result["rationale"],
        "technical": result["technical"],
        "behavioural": result["behavioural"],
    }


@app.post("/evaluate", response_model=EvaluationResult)
def evaluate(request: EvaluationRequest):
    state = {
        "job_description": request.job_description,
        "resume_text": request.resume_text,
        "interview_transcript": request.interview_transcript,
        "match_score": 0.0,
        "recommendation": "",
        "rationale": "",
        "technical": [],
        "behavioural": [],
        "strengths": [],
        "concerns": [],
    }
    result = evaluation_node(state)
    return EvaluationResult(**result)
