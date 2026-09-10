# AI Recruitment Management System — Project Rules

## Architecture Overview
Three-tier system. Every boundary exists for a reason. Never collapse them.
```

Streamlit (:8501) → Spring Boot (:8080) → Python FastAPI + LangGraph (:8000) → LLM API

```

- backend/    : Spring Boot 3.3, Java 17, Maven, MySQL, Spring Data JPA, Spring Security (JWT). SYSTEM OF RECORD. Base package: com.recruit
- ai-service/ : Python 3.11, FastAPI, LangGraph, Pydantic. STATELESS AI BRAIN — no database, takes text in returns JSON out.
- frontend/   : Streamlit. THIN CLIENT — talks ONLY to Spring Boot via JWT. Zero AI logic here.

## Hard Rules — never break these
1. Streamlit never calls ai-service directly. Only Spring Boot calls ai-service.
2. Entities never leave the service layer. DTOs cross every boundary.
3. Use constructor injection everywhere in Java. No @Autowired on fields.
4. Every AI response is a validated Pydantic model with a plain-English rationale field.
5. Emails can only be sent when Evaluation.status == APPROVED. This is the HITL safety gate.
6. Explain every file you generate, line by line, after generating it.
7. Prefer small focused changes. One responsibility per class/function.

## Java Conventions
- Lombok: @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder on entities and DTOs
- Enums for: UserRole (HR, ADMIN), Stage (SCREENING, INTERVIEW), Recommendation (HIRE, CONSIDER, REJECT), EvaluationStatus (PENDING, APPROVED, REJECTED)
- JPA: @Entity, @GeneratedValue(strategy=IDENTITY), @CreationTimestamp, @ManyToOne with @JoinColumn

## Python Conventions
- All agent outputs are Pydantic BaseModels, never raw dicts
- LLM is initialized once in llm.py and imported — never instantiated inside a node
- Prompts live in agents/prompts.py — not inline in node functions
- Use typing_extensions.TypedDict for LangGraph state

## Database: MySQL, db name = recruitdb
Tables: users, jobs, candidates, resumes, evaluations
See decisions.md for full schema.

## Ports
- Spring Boot : 8080
- FastAPI      : 8000
- Streamlit   : 8501

## What to do when asked to generate code
1. Pause and describe what you are about to create (Plan Mode behavior)
2. Generate the code
3. Explain each file line by line
4. Remind me which curl command verifies this works
