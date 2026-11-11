# BoFitXP — GitHub Copilot Instructions

## Project Context

BoFitXP is a multi-application repository containing separate frontend, backend, and CMS applications.

Before making significant changes, inspect the relevant source code and consult the corresponding documentation in `docs/ai-context/`.

Documentation is a reference, not an unquestionable source of truth. When documentation conflicts with actual implementation, verify the source code and report the discrepancy.

## Context Management

Load documentation progressively based on the task:

- `PROJECT.md`: Project overview and technology stack.
- `ARCHITECTURE.md`: Application architecture and component interactions.
- `DATABASE.md`: Database schema, relationships, and data constraints.
- `API.md`: API endpoints, contracts, and response structures.
- `DECISIONS.md`: Verified architectural and technical decisions.
- `PROGRESS.md`: Current implementation status.
- `TODO.md`: Known outstanding work.

Do not load every document unnecessarily.

Inspect the affected application before modifying its implementation. Do not modify unrelated applications.

## Engineering Principles

- Follow existing project conventions and established architectural patterns.
- Prefer simple, maintainable solutions over unnecessary abstractions.
- Apply Separation of Concerns and Single Responsibility Principle.
- Maintain clear layered responsibilities:
  - Controllers: HTTP request and response handling.
  - Services: Business logic.
  - Validation: Input validation and request schemas.
  - Data access: Database operations and persistence.
- Reuse existing components, utilities, hooks, and services when appropriate.
- Avoid unnecessary dependencies and unrelated refactoring.
- Preserve existing behavior unless the task explicitly requires changing it.

## Cross-Application Compatibility

- Maintain compatibility between frontend, backend, CMS, and database contracts.
- Verify API request and response structures before changing integration points.
- Consider nullable, missing, empty, and unexpected API response values.
- Never assume API responses always contain valid data.
- Ensure asynchronous operations have safe error handling before rendering dependent UI or updating state.
- Handle loading, success, empty, and error states where applicable.

## Database and API Safety

- Inspect the actual Prisma schema and implementation before changing database-related behavior.
- Preserve referential integrity and existing business constraints.
- Consider backward compatibility when modifying API contracts.
- Do not assume a database migration is safe without examining affected models and relationships.

## Testing and Verification

- Every functional domain must have a separate test file.
- Keep authentication, quest, user, and other domain tests isolated.
- Examples:
  - `auth.test.ts`
  - `quest.test.ts`
  - `user.test.ts`
- Use integration or E2E tests only when cross-domain workflows require them.
- Follow the existing test framework and conventions.
- Run relevant tests, type checks, linting, and build verification when available.
- Never claim a test passed without actually executing it.

## CI/CD

- Maintain a single source of truth for CI/CD workflows at the repository root.
- Avoid duplicated workflows inside individual application directories unless explicitly required by the architecture.
- Inspect existing deployment configuration before making changes.

## Security and Sensitive Data

- Never expose secrets, credentials, access tokens, or private environment values.
- Do not read or reproduce `.env` values.
- Only document environment variable names and their purposes when necessary.
- Never weaken authentication, authorization, validation, or security controls to simplify implementation.

## Documentation Maintenance

Update relevant files in `docs/ai-context/` when verified implementation changes affect:

- Project structure or technology stack.
- Architecture and application responsibilities.
- Database schema or relationships.
- API contracts.
- Architectural decisions.
- Feature implementation status.
- Outstanding tasks.

Distinguish verified implementation from planned or proposed functionality.

Do not introduce duplicate or contradictory documentation.

## Change Management

- Inspect `git status` before modifying files.
- Preserve existing uncommitted user changes.
- Never overwrite or discard unrelated work.
- Do not install dependencies, modify database schemas, perform unrelated refactoring, or create commits unless explicitly requested.

## Final Response

After completing a task, report:

1. Summary of changes.
2. Files created or modified.
3. Verification performed and actual results.
4. Known limitations and risks.
5. Documentation updates.
6. Remaining work or unresolved questions.
