import json
import re

from langchain_core.messages import SystemMessage, HumanMessage

from app.graph.state import RecruitmentState
from app.agents.prompts import EVALUATION_SYSTEM_PROMPT
from app.llm import llm
from app.schemas import EvaluationResult


def evaluation_node(state: RecruitmentState) -> dict:
    messages = [
        SystemMessage(content=EVALUATION_SYSTEM_PROMPT),
        HumanMessage(content=(
            f"Job Description:\n{state['job_description']}\n\n"
            f"Resume:\n{state['resume_text']}\n\n"
            f"Interview Transcript:\n{state['interview_transcript']}"
        )),
    ]

    response = llm.invoke(messages)

    raw = response.content
    if isinstance(raw, list):
        content = "".join(
            part["text"] if isinstance(part, dict) and "text" in part else str(part)
            for part in raw
        )
    else:
        content = str(raw)

    content = content.strip()
    content = re.sub(r'^```(?:json)?\s*', '', content)
    content = re.sub(r'\s*```$', '', content)
    content = content.strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError(f"LLM returned invalid JSON:\n{content}")

    result = EvaluationResult(**parsed)

    return {
        "recommendation": result.recommendation,
        "rationale": result.rationale,
        "strengths": result.strengths,
        "concerns": result.concerns,
    }
