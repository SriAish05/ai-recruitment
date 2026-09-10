# Architecture Decisions Log

## ADR-001: Why two runtimes (Java + Python)?

* Java/Spring Boot owns security, persistence, and orchestration — terrain where Java's ecosystem (Spring Security, JPA, Spring Mail) is mature and production-proven.
* Python owns the AI layer because LangGraph, LangChain, and the Anthropic SDK are Python-first.
* **Decision:** keep them separate and stateless on the Python side. The AI service takes text in, returns JSON out, holds no database.

## ADR-002: Why does Streamlit talk only to Spring Boot?

* **Single auth surface:** only one place manages JWT validation.
* **Single source of truth:** MySQL via Spring Boot is the system of record. The UI never writes directly.
* **Security:** the AI service has no auth — if Streamlit talked to it directly, anyone could call it.

## ADR-003: Why is the HITL gate in Spring Boot, not inside LangGraph?

* LangGraph's `interrupt()` + checkpointer is the "in-graph" pattern — powerful for long-running agentic loops.
* For this system the gate is a business rule (`evaluation.status` must be `APPROVED` before email), not an AI decision. Spring Boot is the right owner of business rules.
* **Benefit:** the gate cannot be bypassed by changing the UI — the backend refuses regardless.

## ADR-004: Why DTOs at every boundary?

* Exposing JPA entities directly would leak lazy-loading exceptions, circular references, and internal fields over the API.
* DTOs give us explicit control over what leaves the service and make API contracts stable.

## ADR-005: Why structured Pydantic output from agents?

* LLMs can return well-formed text but unpredictable structure. Pydantic validation forces the shape we need.
* If parsing fails, we know immediately — we don't silently propagate bad data into MySQL.

---

*Add a new ADR every time you make a non-obvious decision. This file is your interview evidence.*
