import json
import re

from langchain_core.messages import SystemMessage, HumanMessage

from app.graph.state import RecruitmentState
from app.agents.prompts import QUESTION_SYSTEM_PROMPT
from app.llm import llm
from app.schemas import QuestionSet


def question_node(state: RecruitmentState) -> dict:
    messages = [
        SystemMessage(content=QUESTION_SYSTEM_PROMPT),
        HumanMessage(content=(
            f"Job Description:\n{state['job_description']}\n\n"
            f"Resume:\n{state['resume_text']}"
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

    result = QuestionSet(**parsed)

    return {
        "technical": result.technical,
        "behavioural": result.behavioural,
    }
