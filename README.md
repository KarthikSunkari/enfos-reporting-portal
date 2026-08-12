# ENFOS Reporting Portal

A full-stack reporting portal built for the ENFOS Software Engineer take-home assessment. The implementation is being delivered in small, reviewable phases so each layer has a clear contract and can be verified independently.

> Current status: **Phase 1 complete and verified - backend foundation.** The React client and final one-command full-stack experience are planned next.

## Assessment coverage

The finished application will let a reviewer:

- browse the Users, Departments, and Projects reports;
- search reports by name;
- open each report in a responsive table;
- see intentional loading, empty, and error states;
- navigate back to the reporting home; and
- start the complete stack with one documented command.

The source assessment is summarized into the delivery plan in [Architecture and decisions](docs/architecture.md). That document also records assumptions and tradeoffs for interview discussion.

## Phase 1: Spring Boot API

The backend currently provides the four required read-only endpoints:

| Endpoint | Description |
| --- | --- |
| `GET /api/reports` | Metadata for all available reports |
| `GET /api/reports/users` | Users report rows |
| `GET /api/reports/departments` | Departments report rows |
| `GET /api/reports/projects` | Projects report rows |

Useful operational endpoint: `GET /actuator/health`.

### Run with Docker (recommended)

Prerequisite: Docker Desktop or Docker Engine with Compose v2.

```bash
docker compose up --build
```

The API is available at `http://localhost:8080`. Verify it in another terminal:

```bash
curl --fail http://localhost:8080/actuator/health
curl --fail http://localhost:8080/api/reports
```

Stop the service with `docker compose down`.

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

## Configuration

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `SERVER_PORT` | `8080` | Backend HTTP port inside the container |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Comma-separated browser origins allowed to call `/api/**` |

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
├── docs/
│   └── architecture.md   # Design decisions, tradeoffs, and roadmap
├── docker-compose.yml
└── README.md
```

## Delivery checklist

- [x] Phase 1 - Spring Boot API, deterministic mock data, CORS, health endpoint, tests, and backend container
- [ ] Phase 2 - React landing page and report table experience
- [ ] Phase 3 - Full-stack single-command integration, demo assets, and end-to-end tests
- [ ] Phase 4 - Accessibility, responsive QA, security/dependency review, and submission polish

## Assumptions

- In-memory data is intentionally deterministic; a database is optional per the assessment.
- Dates are transported as ISO-8601 values and formatted for people in the frontend.
- Authentication is expected to live at an enterprise identity/gateway boundary and is not simulated with hard-coded credentials.
- The extra Users `location` field and metadata `rowCount` field add useful reporting context without removing any required columns.

## License

This repository is an assessment submission and is not currently licensed for redistribution.
