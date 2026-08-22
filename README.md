# DevFusion

DevFusion is a full-stack developer-growth platform. It helps a learner create a profile, view a skill dashboard, follow a backend-development roadmap, and see progress-based recommendations.

## What it demonstrates

- React + Vite single-page frontend
- Spring Boot REST backend with Spring Data JPA
- H2 database for local development and automated tests
- Profile creation with server-side validation
- Password-safe API responses
- Skill scoring, career-readiness calculation, and recommendations
- Roadmap completion tracking and learning history
- Automated integration tests for the core user journey

## User journey

1. Open the landing page.
2. Select **Get Started**.
3. Create a developer profile.
4. Continue to the dashboard.
5. View skill insights and a recommendation.
6. Mark roadmap steps complete to update progress and learning history.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Backend | Java 25, Spring Boot 4 |
| Data access | Spring Data JPA / Hibernate |
| Development database | H2 |
| Build and test | Maven Wrapper, JUnit 5 |

## Project structure

```text
DevFusion/
├── frontend/                 # React user interface
│   └── src/App.jsx           # Landing, registration, dashboard, roadmap
├── backend/                  # Spring Boot application
│   └── src/main/java/com/devfusion/backend/
│       ├── model/            # JPA entities and safe API response models
│       ├── repository/       # JPA repositories
│       └── *Controller.java  # REST endpoints
└── README.md
```

## Run locally

### Prerequisites

- Java 25
- Node.js and npm
- An internet connection the first time Maven downloads its dependencies

### 1. Start the backend

From the `backend` directory:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend starts on `http://localhost:8080`.

### 2. Start the frontend

From the `frontend` directory:

```powershell
npm install
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:5173`.

### 3. Run the automated tests

From the `backend` directory:

```powershell
.\mvnw.cmd test
```

The suite currently verifies application startup, profile creation, duplicate-email protection, roadmap/history persistence, and progress analysis.

### 4. Build the frontend

From the `frontend` directory:

```powershell
npm run build
```

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/users` | Create a profile. Required fields are name, email, password, and career goal. |
| `GET` | `/api/users/{id}` | Retrieve a profile without its password. |
| `GET` | `/api/skills` | Get the tracked technical skills. |
| `GET` | `/api/recommendation/{goal}` | Get a career-goal recommendation. |
| `GET` | `/api/roadmap/{userId}` | Get a user's roadmap progress. |
| `PUT` | `/api/roadmap/{userId}` | Save roadmap completion and progress percentage. |
| `GET` | `/api/history/{userId}` | Get completed roadmap history. |
| `GET` | `/api/analysis/{userId}` | Get roadmap-based progress analysis. |

### Example profile request

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "example-password",
  "careerGoal": "Backend Developer"
}
```

The user API returns profile information only; it does not return the password.

## Current scope and future work

DevFusion currently uses an in-memory H2 database by default, so local data is reset when the backend stops. For a deployed version, configure MySQL or another persistent database, hash passwords before storage, add authentication, and move the sample skill data to user-specific assessments.

## Verification status

- Frontend production build: passing
- Backend Maven test suite: passing (5 tests, 0 failures)
- Landing → registration → dashboard flow: manually verified
git add README.md
git commit -m "Document project setup and APIs"