# Week 1 (22, Mar, 2026)

## Progress: Initialize Monorepo with Scaffolding Project

In the first week, the foundation of the project was established by setting up a monorepo structure and scaffolding both the backend and frontend applications.

### 1. Monorepo Setup
- Initialized a workspace-based monorepo using npm.
- Configured `package.json` at the root to manage `backend` and `frontend` as separate workspaces.
- Added convenience scripts in the root `package.json` to start both the backend and frontend services.

### 2. Backend Scaffolding (NestJS)
- Scaffolder a new NestJS application within the `backend/` directory.
- Standard project structure was created including:
    - `src/`: Main application logic (Controllers, Modules, Services).
    - `test/`: End-to-end and unit test configurations.
    - Configuration files: `nest-cli.json`, `tsconfig.json`, `eslint.config.mjs`.

### 3. Frontend Scaffolding (Vue.js + Vite)
- Scaffolder a new Vue.js application using Vite in the `frontend/` directory.
- Basic setup includes:
    - `src/`: Vue components, assets, and main entry point.
    - `public/`: Static assets.
    - Configuration files: `vite.config.js`, `jsconfig.json`.

### 4. Project Structure
The current project structure is organized as follows:
```text
.
├── backend/            # NestJS API
├── frontend/           # Vue.js Frontend
├── progress_book/      # Documentation (MdBook)
├── package.json        # Root workspace configuration
└── node_modules/       # Shared dependencies
```

### 5. Scripts
- `frontend` : starting the frontend application using Vite.
- `backend` : starting the backend application using NestJS.

---

# Current State Update (1, May, 2026)

## Progress: Align Implementation Status with Student Part-Time Job Portal Requirements

This update records the current project state against the latest product goal from the Student Part-Time Job Portal requirements document.

### 1. Requirement Baseline
The project target is a student part-time job portal with three main roles:
- `Student`: Builds a profile, uploads a resume/CV, discovers jobs, and tracks applications.
- `Employer`: Creates a company profile, posts jobs, verifies company legitimacy, and manages applicants.
- `Admin`: Moderates content, verifies employers, and manages platform disputes.

The required stack is also aligned with the current repository direction:
- Frontend: Vue.js/Vite.
- Backend: NestJS with TypeScript.
- Database: PostgreSQL through TypeORM.
- File storage: Local upload handling is currently started for files such as CVs.

### 2. Authentication & Account Management Status
Current progress:
- Backend authentication endpoints exist for registration, login, logout, current session profile, OTP sending, and OTP verification.
- Frontend authentication state is managed with Pinia and supports login/register mode switching.
- Student and employer role selection exists in the frontend auth store.
- The application includes a secure-account flow for linking/recovering email through OTP after phone-based registration/login.
- Protected frontend routes are guarded based on authenticated state, email recovery state, and onboarding completion state.

Still pending or incomplete:
- Google social login is not implemented yet.
- Telegram login is not implemented yet.
- Password reset by email OTP/link is not fully implemented as a dedicated password-management flow.
- Security still needs to be upgraded from the current temporary token/session approach to proper JWT-based protected endpoints.
- User persistence needs to be finalized because parts of the current auth flow still rely on in-memory/session user data.

### 3. Student Feature Status
Current progress:
- Student onboarding route exists at `/onboarding/student`.
- Student profile frontend state includes:
    - Full name.
    - University.
    - Major.
    - Year level.
    - Skills.
    - Bio.
    - Preferred job type.
    - Weekly availability.
    - Expected salary and currency.
    - Optional CV file.
- Backend student profile API exists for saving and reading the authenticated student's profile.
- Student profile persistence includes fields for university, major, year of study, skills, job type, availability, expected salary, currency, profile image URL, and CV URL.
- Multipart profile saving is implemented so an optional CV file can be submitted with profile data.

Still pending or incomplete:
- Built-in downloadable CV/profile generator is not implemented yet.
- Searchable and paginated job discovery feed is not implemented yet.
- Advanced filtering by job type, location, and skills is not implemented yet.
- Student application tracking dashboard is not implemented yet.
- Application statuses such as `Submitted`, `Viewed by Employer`, `Interview Scheduled`, and `Rejected` are not implemented yet.

### 4. Employer Feature Status
Current progress:
- Employer profile database entity exists with company name, patent/proof URL, verification flag, description, industry, phone, address, website, and logo URL.
- The data model already considers company verification through an `isVerified` field.

Still pending or incomplete:
- Employer profile API/controller is not wired yet.
- Employer onboarding UI is not implemented yet.
- Public company profile page is not implemented yet.
- Admin review workflow for submitted company proof is not implemented yet.
- Job posting management is not implemented yet.
- Job fields such as salary range, working hours, and requirements are not implemented yet.
- Applicant tracking or Kanban-style hiring board is not implemented yet.
- Secure contact reveal after moving a candidate to interview stage is not implemented yet.

### 5. Admin and Moderation Status
Current progress:
- User role and account status enums exist in the backend, which gives a base for role-based behavior.

Still pending or incomplete:
- Admin module, routes, dashboard, and moderation screens are not implemented yet.
- Employer verification approval/rejection is not implemented yet.
- Dispute management is not implemented yet.
- Role-based authorization beyond basic authentication guarding still needs to be added.

### 6. Advanced / Phase 2 Feature Status
These features are not started yet and should remain lower priority until the core portal flow is complete:
- Skill matching engine.
- Smart job recommendations and notifications based on major, skills, and availability.
- Anonymous student rating system for internship/job experiences.

### 7. Non-Functional Requirement Status
Current progress:
- Vue.js/Vite frontend foundation is in place.
- NestJS backend modular structure is in place.
- PostgreSQL/TypeORM configuration is in place.
- Notifications module scaffolding exists.

Still pending or incomplete:
- Full bilingual English/Khmer localization is not implemented yet.
- Mobile-first responsiveness needs to be reviewed across completed screens.
- Job feed performance target cannot be validated until the job feed and pagination are implemented.
- Password hashing and JWT-based endpoint protection must be verified and hardened before production readiness.
- Secure storage strategy for resumes and company logos needs to be finalized.

### 8. Recommended Next Priorities
Based on the requirements and current implementation, the next work should focus on finishing the core MVP before Phase 2 features:
1. Finalize persistent authentication:
    - Store users in the database.
    - Hash passwords with bcrypt.
    - Replace temporary tokens with JWT.
    - Add role-based guards.
2. Complete student onboarding end-to-end:
    - Ensure saved student profiles update onboarding completion.
    - Add profile retrieval/editing from the frontend.
    - Validate CV upload storage and URL serving.
3. Build employer onboarding:
    - Add employer profile controller/service.
    - Add employer onboarding UI.
    - Save company proof, logo, and verification status.
4. Implement job posting and discovery:
    - Add job entity, service, and controller.
    - Support salary range, working hours, requirements, location, skills, and job type.
    - Add searchable, paginated frontend job feed.
5. Implement application workflow:
    - Add application entity/statuses.
    - Add student application dashboard.
    - Add employer applicant tracking board.
6. Add admin verification and moderation:
    - Build admin routes/screens.
    - Review employer proofs.
    - Moderate jobs and handle disputes.
