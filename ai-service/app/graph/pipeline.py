from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

from app.graph.state import RecruitmentState
from app.agents.screening_agent import screening_node
from app.agents.question_agent import question_node


def route_after_screen(state: RecruitmentState) -> str:
    if state["recommendation"] == "REJECT":
        return END
    return "question"


graph = StateGraph(RecruitmentState)

graph.add_node("screen", screening_node)
graph.add_node("question", question_node)

graph.add_edge(START, "screen")
graph.add_conditional_edges("screen", route_after_screen)
graph.add_edge("question", END)

compiled_graph = graph.compile(checkpointer=InMemorySaver())
