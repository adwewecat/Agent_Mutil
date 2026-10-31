# AGENTS.md - Agent Collaboration Guide for Agent Multi

This document guides AI coding agents (Antigravity, Claude Code, Cursor, Copilot, Codex) working on the **Agent Multi** project.

---

## 1. Project Overview & 5 Technical Pillars
1. **Backend**: Python 3.14+ (compatible with Python 3.10+) + FastAPI.
2. **Frontend**: React 19 + TypeScript + Vite (2.5D Isometric Canvas Pixel Office Engine).
3. **Database**: Microsoft SQL Server (`SQLAlchemy 2.0` + `pyodbc` + `Microsoft ODBC Driver 18`), with flexible SQLite fallback (`sqlite:///./agent_multi.db`) for local dev.
4. **Communication**: REST API (OpenAPI standard at `/docs`, `/redoc`) and WebSocket `/ws/office`.
5. **Deployment**: Independent & decoupled. Static output in `frontend/dist/`.

---

## 2. Essential Commands

### Backend
```bash
cd backend
# Run server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run test suite
$env:PYTHONPATH="backend"; python -m pytest backend/tests
```

### Frontend
```bash
cd frontend
# Development mode
npm.cmd run dev

# Strict TypeScript check & Production build
npm.cmd run build
```

---

## 3. Core Project Rules
- **Supreme Rulebook & Project History**: Always consult and update [GEMINI.md](file:///d:/LAPTRINH/Agent_multi/GEMINI.md).
- **Domain Language**: Always consult [GLOSSARY.md](file:///d:/LAPTRINH/Agent_multi/GLOSSARY.md).
- **Architecture Decisions**: Located in `docs/adr/`.
- **Clean Code**: No dead code or unused imports. All components, models, and endpoints must have clear Vietnamese comments.
- **Git Push**: Whenever adding or modifying code, immediately commit and push to `https://github.com/adwewecat/Agent_Mutil.git` (`main` branch).

---

## 4. Agent Skills (`mattpocock/skills`)
This repository integrates Matt Pocock's engineering and productivity skills installed in `.agents/skills/`:
- **Idea to Ship**: `/ask-matt`, `/grill-with-docs`, `/domain-modeling`, `/to-spec`, `/to-tickets`, `/implement`, `/implement-spec`
- **Quality & Testing**: `/tdd`, `/diagnosing-bugs`, `/code-review`, `/improve-codebase-architecture`, `/retro`, `/pr`
- **Productivity & Communication**: `/grill-me`, `/grilling`, `/handoff`, `/teach`, `/to-questionnaire`, `/wait-what`, `/wizard`

---

## 5. Knowledge Work Plugins (`anthropics/knowledge-work-plugins`)
This repository integrates Anthropic's official domain plugins installed in `.agents/plugins/` to empower specialized, objective office workflows:
- **Operations & Business (`operations`, `small-business`)**: Process optimization, operational risk assessment, standard operating procedures (SOP/runbooks), capacity planning, vendor review. (Empowers Dũng 1).
- **Sales & Customer Support (`sales`, `customer-support`)**: Account research, pipeline review, call prep, objection handling, ticket triage, knowledge base generation.
- **Product Management & Data (`product-management`, `data`)**: Spec writing, roadmap planning, user research synthesis, SQL query generation, statistical analysis, dashboard specs. (Empowers Dũng 2).
- **Governance & Finance (`legal`, `finance`)**: Contract review, compliance tracking, risk assessment, financial statement prep, reconciliation, audit support.
- **Marketing & Productivity (`marketing`, `productivity`, `enterprise-search`, `design`)**: Campaign planning, brand voice enforcement, cross-tool search, daily briefing, design critique.

