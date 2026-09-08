import json
import re

from langchain_core.messages import SystemMessage, HumanMessage

from app.graph.state import RecruitmentState
from app.agents.prompts import SCREENING_SYSTEM_PROMPT
from app.llm import llm
from app.schemas import ScreeningResult


def screening_node(state: RecruitmentState) -> dict:
    messages = [
        SystemMessage(content=SCREENING_SYSTEM_PROMPT),
        HumanMessage(content=(
            f"Job Description:\n{state['job_description']}\n\n"
            f"Resume:\n{state['resume_text']}"
        )),
    ]

    response = llm.invoke(messages)

    # Gemini returns content as a list of parts; flatten to a single string
    raw = response.content
    if isinstance(raw, list):
        content = "".join(
            part["text"] if isinstance(part, dict) and "text" in part else str(part)
            for part in raw
        )
    else:
        content = str(raw)

    # Strip markdown code fences if the model wraps JSON in ```json ... ```
    content = content.strip()
    content = re.sub(r'^```(?:json)?\s*', '', content)
    content = re.sub(r'\s*```$', '', content)
    content = content.strip()

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError(f"LLM returned invalid JSON:\n{content}")

    result = ScreeningResult(**parsed)

    return {
        "match_score": result.match_score,
        "recommendation": result.recommendation,
        "rationale": result.rationale,
    }
