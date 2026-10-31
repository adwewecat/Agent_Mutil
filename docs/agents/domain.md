# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.
- **`GEMINI.md`**: contains the supreme single source of truth, rules, and history.

## File structure

Single-context repo:

```
/
├── GLOSSARY.md
├── GEMINI.md
├── README.md
├── docs/
│   ├── adr/
│   │   └── 0001-bo-ba-dung-architecture.md
│   └── agents/
│       ├── domain.md
│       ├── issue-tracker.md
│       └── triage-labels.md
├── backend/
└── frontend/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.
