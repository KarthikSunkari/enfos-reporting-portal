# Architecture

## Incremental delivery plan

```mermaid
flowchart LR
    Browser[React client] -->|same-origin /api/**| Proxy[Nginx proxy]
    Proxy --> Controller[ReportController]
    Controller --> Service[ReportService]
    Service --> MockData[Immutable in-memory data]
    Compose[Docker Compose] -. starts .-> Browser
    Compose -. starts .-> Controller
```

The application is deliberately split at boundaries that can evolve independently:

- The controller owns HTTP routes and JSON serialization, not data creation.
- `ReportService` is the application boundary. The in-memory implementation can later be replaced by a repository-backed implementation without changing the API.
- Java records make response models concise and immutable.
- Configuration is externalized through environment variables so the same image can run locally or in a hosted environment.

## Phase 2 decisions

| Decision | Rationale | Tradeoff |
| --- | --- | --- |
| React 19, TypeScript, and Vite | A small, fast client build with strict static checks and no unnecessary framework runtime. | The application owns its data-fetching conventions rather than adopting a larger framework. |
| Feature-oriented frontend folders | API, hooks, page states, and report presentation evolve together without crowding global component folders. | A three-report application has more structure than strictly necessary today. |
| Same-origin API proxy | The browser talks only to the frontend origin in Compose, simplifying deployment and avoiding production CORS dependencies. | Nginx must know the backend service name. |
| Purpose-built `useReports` hook | Keeps request lifecycle, cancellation, retry, and UI rendering responsibilities separate. | A broader application could justify a server-state library once caching and mutations are needed. |
| Runtime response validation | Prevents malformed API payloads from silently corrupting the interface. | Hand-written guards must evolve with the API contract. |
| CSS design system without a UI kit | Creates a distinctive, lightweight interface while keeping full control of responsive and accessible behavior. | Common primitives must be maintained locally. |
| Route placeholder for report details | Report cards have stable, testable destinations while table work remains isolated to Phase 3. | This intermediate commit intentionally does not yet satisfy the final table-view requirement. |

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
- Frontend requests are cancelled during unmount, time out after 10 seconds, validate response shape, and expose a retry action.
- Production browser traffic uses a same-origin proxy with CSP, anti-framing, MIME-sniffing, referrer, and permissions headers.
- Both runtime containers use non-root users and expose health checks to Compose.
- The frontend dependency lockfile currently reports zero known npm audit vulnerabilities.

## Planned phases

1. **Backend foundation** - API, mock data, configuration, container, and tests.
2. **Reporting home** - responsive report discovery, search, routing, and loading/empty/error states.
3. **Report exploration** - responsive data tables for Users, Departments, and Projects with return navigation.
4. **Submission polish** - end-to-end checks, accessibility and responsive QA, screenshots/demo, and final rubric review.
