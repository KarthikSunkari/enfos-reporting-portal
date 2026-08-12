# ENFOS Reporting Portal

A full-stack reporting portal built for the ENFOS Software Engineer take-home assessment. The implementation is being delivered in small, reviewable phases so each layer has a clear contract and can be verified independently.

> Current status: **Phase 4 - single-command container deployment implemented.** Final evidence and submission polish are the next delivery.

## Assessment coverage

The finished application will let a reviewer:

- browse the Users, Departments, and Projects reports;
- search reports by name;
- open each report in a responsive table;
- see intentional loading, empty, and error states;
- navigate back to the reporting home; and
- start the complete stack with one documented command.

The source assessment is summarized into the delivery plan in [Architecture and decisions](docs/architecture.md). That document also records assumptions and tradeoffs for interview discussion.

## Run the full stack

Prerequisites:

- Docker Desktop or Docker Engine with Compose v2;
- ports `3000` and `8080` available on localhost; and
- enough free disk space for the pinned Java, Node, and Nginx base images (approximately 3 GB for a first uncached build).

```bash
docker compose up --build
```

Open the reporting portal at `http://localhost:3000`. The frontend proxies `/api/**` to the backend inside the Compose network, while the backend remains directly available at `http://localhost:8080` for API inspection.

Verify both services in another terminal:

```bash
curl --fail http://localhost:3000/healthz
curl --fail http://localhost:3000/api/reports
curl --fail http://localhost:8080/actuator/health
```

Stop the application with `docker compose down`.

The image builds run linting and all automated tests. This makes `docker compose up --build` the intended clean-checkout build, verification, and startup path.

No host Java, Maven, Node.js, npm, or Nginx installation is required for this path. Both services build from their lockfiles/manifests, run as non-root users, expose health checks, and start in dependency order—the frontend waits until the backend is healthy.

For an automated live verification after startup:

```bash
./scripts/verify-deployment.sh
```

The script waits for both services and verifies backend health, all report endpoints through the frontend proxy, SPA detail routes, and the production browser security headers.

## Phase 1: Spring Boot API

The backend currently provides the four required read-only endpoints:

| Endpoint | Description |
| --- | --- |
| `GET /api/reports` | Metadata for all available reports |
| `GET /api/reports/users` | Users report rows |
| `GET /api/reports/departments` | Departments report rows |
| `GET /api/reports/projects` | Projects report rows |

Useful operational endpoint: `GET /actuator/health`.

### Run directly

Prerequisites: JDK 21 and Maven 3.6.3 or newer.

```bash
cd backend
mvn spring-boot:run
```

### Test

```bash
cd backend
mvn verify
```

The Docker image also runs the complete test suite during every build, so `docker compose build backend` is a clean-checkout verification path without a local Java or Maven installation.

## Phase 2: React reporting home

The React and TypeScript frontend now includes:

- report metadata fetched from the backend rather than duplicated in the client;
- fast, case-insensitive report-name filtering;
- responsive report cards with record counts and refresh dates;
- loading skeletons plus empty, no-results, and recoverable error states;
- route-safe links for each report, ready for the table-view phase;
- runtime validation for API responses and a 10-second request timeout;
- keyboard-visible focus, semantic landmarks, live result counts, and reduced-motion support; and
- a non-root Nginx image with same-origin API proxying and restrictive browser security headers.

### Run directly

Prerequisites: Node.js 22.12 or newer and the Phase 1 backend running on port 8080.

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the local backend.

## Phase 3: Dynamic report tables

Each report card now routes to a dedicated URL backed by its required endpoint:

| Route | API request | Columns |
| --- | --- | --- |
| `/reports/users` | `GET /api/reports/users` | ID, name, email, role, status, location, created date |
| `/reports/departments` | `GET /api/reports/departments` | ID, department, manager, employees, location |
| `/reports/projects` | `GET /api/reports/projects` | ID, project, department, owner, status, start/end dates |

The detail experience includes:

- a shared typed report registry instead of duplicated pages;
- runtime validation tailored to every report row schema;
- responsive, semantic HTML tables with a keyboard-focusable horizontal scroll region;
- client-side search across every visible field;
- accessible ascending and descending sorting for every column;
- readable dates, employee counts, email links, and status indicators;
- loading skeletons plus empty, error/retry, no-results, and unknown-report states; and
- prominent navigation back to the report library.

### Verify

```bash
cd frontend
npm run lint
npm test
npm run build
npm audit
```

## Configuration

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `SERVER_PORT` | `8080` | Backend HTTP port inside the container |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Comma-separated browser origins allowed to call `/api/**` |
| `VITE_API_BASE_URL` | `/api` | Optional API base URL embedded into a direct frontend build |

Do not use a wildcard CORS origin for deployment. Set `CORS_ALLOWED_ORIGINS` to the exact frontend origin instead.

## Project structure

```text
.
├── backend/
│   ├── src/main/java/com/enfos/reporting/
│   │   ├── config/       # Externalized web/CORS configuration
│   │   ├── controller/   # REST boundary
│   │   ├── model/        # Immutable API response records
│   │   └── service/      # Service contract and mock implementation
│   ├── src/test/         # Controller contract and service tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/          # Application routing
│   │   ├── components/   # Shared brand and icon primitives
│   │   └── features/     # Report API, hooks, states, cards, and pages
│   ├── Dockerfile
│   ├── nginx.conf        # SPA hosting, security headers, and API proxy
│   └── package.json
├── docs/
│   └── architecture.md   # Design decisions, tradeoffs, and roadmap
├── docker-compose.yml
└── README.md
```

## Delivery checklist

- [x] Phase 1 - Spring Boot API, deterministic mock data, CORS, health endpoint, tests, and backend container
- [x] Phase 2 - React landing page, report discovery, search, resilient UI states, routing, and frontend container
- [x] Phase 3 - Typed dynamic report table views, record search/sorting, navigation, and resilient states
- [x] Phase 4 - Pinned multi-stage images, health-gated Compose startup, secure proxying, and deployment verification script
- [ ] Phase 5 - Browser evidence, automated accessibility review, screenshots/demo, and submission polish

## Assumptions

- In-memory data is intentionally deterministic; a database is optional per the assessment.
- Dates are transported as ISO-8601 values and formatted for people in the frontend.
- Authentication is expected to live at an enterprise identity/gateway boundary and is not simulated with hard-coded credentials.
- The extra Users `location` field and metadata `rowCount` field add useful reporting context without removing any required columns.

## Deployment reliability and security

- Base images are pinned by immutable digest while retaining readable version tags.
- The build stages run all backend tests plus frontend lint, tests, and production compilation before producing runtime images.
- Published ports bind to `127.0.0.1`, so the assessment stack is not unintentionally exposed to the local network.
- Compose uses health-gated dependency startup, restart policies, lightweight init processes, graceful stop windows, and bounded log rotation.
- Nginx allows only read methods, proxies the API over the private Compose network, suppresses upstream server disclosure, and serves SPA routes safely.
- Security headers remain present on HTML, assets, API responses, and error responses; cache rules no longer override inherited headers.
- This local assessment deployment terminates plain HTTP. A hosted production deployment should add TLS and enterprise authentication at a trusted ingress or gateway.

### Troubleshooting

- If a port is already in use, stop the conflicting local service before starting Compose.
- If Docker reports `no space left on device`, free Docker/host disk space and restart Docker Desktop before rebuilding. Avoid deleting named volumes unless their data is known to be disposable.
- Inspect service state with `docker compose ps` and logs with `docker compose logs --no-color backend frontend`.
- Rebuild from the pinned definitions with `docker compose build --pull` when intentionally refreshing image content; changing a digest should be reviewed as a dependency update.

## License

This repository is an assessment submission and is not currently licensed for redistribution.
