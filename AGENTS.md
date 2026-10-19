# AI Development Instructions

## Project Context

This repository contains BoFitXP, a fitness and self-improvement gamification application.

- Frontend: Expo Router, React Native, TypeScript.
- Backend: Express.js, TypeScript, Prisma, MongoDB.
- Read `docs/ai-context/PROJECT.md` for product requirements.
- Read `docs/ai-context/ARCHITECTURE.md` for system design.
- Read `docs/ai-context/PROGRESS.md` before continuing existing work.
- Read `docs/ai-context/DECISIONS.md` before proposing architectural changes.

## Source of Truth

- Existing source code and database schema are the source of truth for current implementation.
- Documentation describes intended behavior and must be verified against the code.
- Never assume a feature, endpoint, environment variable, or test exists without checking.
- If documentation conflicts with code, report the discrepancy before making significant changes.

## Development Workflow

1. Inspect relevant files and dependencies before editing.
2. Summarize the current implementation and propose a plan for non-trivial tasks.
3. Implement only the agreed scope.
4. Follow existing folder structure, naming conventions, and patterns.
5. Avoid unrelated refactoring and unnecessary dependencies.
6. Run relevant linting, type checks, and tests where available.
7. Report modified files, verification results, and known limitations.

## Architecture and Security

- Follow existing authentication and authorization middleware.
- Never trust client-provided user IDs for authenticated operations when the authenticated identity is available from middleware.
- Validate input at API boundaries.
- Never expose passwords, secrets, tokens, or sensitive environment variables.
- Do not modify database schema or migrations without explaining the impact.
- Do not introduce breaking API changes without identifying affected clients.

## Context Management

- Update `docs/ai-context/PROGRESS.md` after completing a meaningful task.
- Record important architectural decisions in `DECISIONS.md`.
- Update `API.md` and `DATABASE.md` when their contracts or schemas change.
- Never mark a feature complete unless the implementation and verification support that status.
- When resuming work, inspect Git status and recent commits before editing.
- When context is insufficient, inspect the repository and ask for clarification rather than inventing missing requirements.

## Task Completion Report

At the end of each task, report:

- What changed and why.
- Files modified.
- Tests and checks executed, including failures.
- Remaining risks or limitations.
- Recommended next step.
