# Architecture

## Incremental delivery plan

```mermaid
flowchart LR
    Browser[React client<br/>Phase 2] -->|GET /api/reports/**| Controller[ReportController]
    Controller --> Service[ReportService]
    Service --> MockData[Immutable in-memory data]
    Compose[Docker Compose<br/>Phase 3] -. starts .-> Browser
    Compose -. starts .-> Controller
```

The application is deliberately split at boundaries that can evolve independently:

- The controller owns HTTP routes and JSON serialization, not data creation.
- `ReportService` is the application boundary. The in-memory implementation can later be replaced by a repository-backed implementation without changing the API.
- Java records make response models concise and immutable.
- Configuration is externalized through environment variables so the same image can run locally or in a hosted environment.

## Phase 1 decisions

| Decision | Rationale | Tradeoff |
| --- | --- | --- |
| Spring Boot 3.5.x on Java 21 | A mature Spring generation plus an LTS JDK keeps reviewer setup predictable. | This intentionally favors compatibility over adopting Spring Boot 4 immediately. |
| Explicit report endpoints | Matches the assessment contract and keeps each response strongly typed. | Adding many report types would eventually benefit from a registry or generic query layer. |
| Immutable in-memory fixtures | Deterministic, thread-safe, and sufficient for the requested scope. | Changes disappear on restart and there is no persistence. |
| ISO-8601 dates and timestamps | Browser clients can parse them reliably without locale ambiguity. | Presentation formatting belongs to the frontend. |
| Allowlisted CORS origins | Supports local UI development without opening the API to every origin. | Deployment must provide its actual frontend origin. |
| No authentication in this slice | Authentication is outside the assessment requirements; inventing fake auth would not improve security. | A production internal portal should integrate with the organization's identity provider or gateway. |

## API contract

All endpoints return JSON and are read-only.

| Method | Path | Response |
| --- | --- | --- |
| `GET` | `/api/reports` | Report metadata with stable ID, description, update time, and row count |
| `GET` | `/api/reports/users` | User report rows |
| `GET` | `/api/reports/departments` | Department report rows |
| `GET` | `/api/reports/projects` | Project report rows |
| `GET` | `/actuator/health` | Container health status |

## Security and reliability posture

- Only configured browser origins can make cross-origin requests; only `GET` and preflight `OPTIONS` are allowed.
- Actuator exposure is limited to `health` and `info`, with health details suppressed.
- Default error responses do not disclose exception messages or stack traces.
- The container runs as a non-root user and uses graceful shutdown.
- Static data is immutable and safe for concurrent reads.
- Controller contract tests cover every endpoint and both accepted and rejected CORS preflights.

## Planned phases

1. **Backend foundation** - API, mock data, configuration, container, and tests.
2. **Frontend experience** - responsive report discovery, search, routing, data tables, and loading/empty/error states.
3. **Full-stack delivery** - compose integration, end-to-end checks, screenshots, and final runbook polish.
4. **Hardening pass** - accessibility, responsive/browser QA, dependency audit, and submission review against the rubric.
