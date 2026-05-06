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

---

# Current State Update (2, May, 2026)

## Progress: Authentication Hardening, Social Posting, and Admin Employer Moderation

This update records the current repository state after the latest implementation pass. The project has moved beyond the previous scaffold/status note in several areas, especially persistent authentication, passkey support, social-style posts, and employer verification moderation.

### 1. Authentication & Account Management Status
Current progress:
- User records are persisted through the `users` table using the backend `User` entity.
- Passwords are hashed with `bcrypt` during registration and checked during login.
- JWTs are issued for register/login/passkey login responses and the authenticated guard accepts bearer tokens.
- The authenticated guard still supports session fallback through `req.session.userId`, so the project currently uses a hybrid JWT/session authentication approach.
- Passkey/WebAuthn support has been added with endpoints for login options, login verification, registration options, registration verification, and passkey listing.
- Passkey credentials are stored through a dedicated backend entity.
- Authenticated password change is implemented through the `POST /auth/password` endpoint and the frontend security settings modal.
- OTP-based email linking/recovery remains available through the secure-account flow.

Still pending or incomplete:
- Google social login is not implemented yet.
- Telegram login is not implemented yet.
- Password reset for forgotten passwords is still not implemented as a separate unauthenticated recovery flow.
- Authentication should be standardized by removing or intentionally documenting the remaining session fallback.
- Role-based guards are still needed for admin/employer/student-only routes.
- JWT secret and WebAuthn environment values need production-safe configuration before deployment.

### 2. Student Profile and Frontend Account Experience Status
Current progress:
- Student onboarding remains wired at `/onboarding/student`.
- Student profile data can be saved and read through the backend student profile module.
- The authenticated placeholder shell now includes richer authenticated pages for home, create post, profile, settings, and related placeholder sections.
- Settings include editable personal information rows and a security section for passkey registration and password updates.
- Profile data is surfaced in the profile view, including avatar/initials fallback, profile statistics, bio/education/category information, and a gallery based on created posts.
- Theme mode support is available in the placeholder shell through the sidebar toggle.

Still pending or incomplete:
- Built-in downloadable CV/profile generator is not implemented yet.
- Dedicated student application tracking dashboard is not implemented yet.
- Application statuses such as `Submitted`, `Viewed by Employer`, `Interview Scheduled`, and `Rejected` are not implemented yet.
- The `/search`, `/messages`, and `/notifications` routes still use placeholder content rather than complete product flows.

### 3. Social Posting / Feed Status
Current progress:
- A backend posts module is wired into the application module.
- Authenticated users can create posts through `POST /posts` with title, markdown content, and optional image URL.
- Posts are persisted through the backend post entity and associated with the author user.
- The posts API validates required title/content and applies length limits.
- Authenticated users can fetch the latest posts through `GET /posts`, currently limited to the latest 50 records ordered by creation date.
- The frontend home page loads posts from the backend, displays loading/error/empty states, and renders post cards.
- The frontend create page supports markdown content, a live preview, optional local image preview, and publishing posts to the backend.

Still pending or incomplete:
- Feed pagination is not implemented yet.
- Job discovery is still separate from the social post feed and has not been implemented as a searchable job board.
- Post image upload is not fully integrated end-to-end with backend storage from the create-post form.
- Likes, comments, sharing, and moderation for posts are not implemented yet.

### 4. Employer Feature Status
Current progress:
- Employer profile database support still exists through the employer/company profile entity.
- Employer profiles include company details, patent/proof URL, verification status, and related company metadata.
- Admin verification logic can query unverified employer profiles.
- Admin approval can mark an employer profile as verified.
- Admin rejection deletes the associated employer user, which removes/rejects the submitted employer account path.

Still pending or incomplete:
- Employer profile API/controller for employer self-service onboarding is still not wired as a complete employer-facing flow.
- Employer onboarding UI is not implemented yet.
- Public company profile page is not implemented yet.
- Job posting management is not implemented yet.
- Job fields such as salary range, working hours, requirements, location, and skills are not implemented as a job entity/workflow yet.
- Applicant tracking or Kanban-style hiring board is not implemented yet.
- Secure contact reveal after moving a candidate to interview stage is not implemented yet.

### 5. Admin and Moderation Status
Current progress:
- Backend admin module, controller, and service are now present.
- Admin endpoints exist for:
    - Listing pending employers: `GET /admin/employers/pending`.
    - Approving an employer: `PATCH /admin/employers/:id/approve`.
    - Rejecting an employer: `DELETE /admin/employers/:id/reject`.
- A frontend admin moderation dashboard exists at `/admin/moderation`.
- The admin dashboard displays pending employer cards/table data, simple review metrics, a proof-review modal, and approve/reject actions.

Still pending or incomplete:
- The admin moderation frontend route is currently marked with `requiresAuth: false`, so it still needs authentication and role-based authorization protection.
- Admin moderation is currently focused on employer verification only.
- Job moderation, post moderation, dispute management, and broader admin analytics are not implemented yet.
- Admin endpoints should be protected with an admin-only guard before production use.

### 6. Non-Functional and Infrastructure Status
Current progress:
- PostgreSQL/TypeORM remains configured with auto-loaded entities.
- The file upload module exists and student CV/profile fields can reference uploaded file URLs.
- Notification gateway/service scaffolding remains present.
- Public-facing informational pages now exist for About Us, Contact, Privacy Policy, and Terms of Service.
- Docker-related project files are present at the repository root.

Still pending or incomplete:
- Full bilingual English/Khmer localization is not implemented yet.
- Mobile responsiveness should still be reviewed across the expanded authenticated shell, admin dashboard, and public pages.
- Production-safe file storage for resumes, company proofs, profile images, and post images still needs to be finalized.
- Validation, error handling, and authorization should be hardened across backend modules.
- Automated test coverage has not been updated to cover the new auth, passkey, posts, admin, and profile flows.

### 7. Updated Recommended Next Priorities
Based on the current state, the next development work should focus on securing and completing the MVP flows:
1. Lock down authentication and authorization:
    - Decide whether JWT or session auth is the single source of truth.
    - Add role-based guards for student, employer, and admin routes.
    - Protect `/admin/moderation` and backend admin endpoints with admin-only access.
2. Complete employer onboarding:
    - Add employer-facing profile controller/service endpoints.
    - Build employer onboarding UI.
    - Upload and serve company proof/logo files consistently.
3. Implement job posting and discovery:
    - Add job entity, service, and controller.
    - Support salary range, working hours, requirements, location, skills, and job type.
    - Add searchable and paginated frontend job discovery.
4. Implement application workflow:
    - Add application entity and statuses.
    - Add student application tracking dashboard.
    - Add employer applicant tracking board.
5. Finish upload integration:
    - Connect post image selection to backend upload/storage.
    - Confirm CV, company proof, logo, profile image, and post image serving paths.
6. Add tests and hardening:
    - Cover auth, passkeys, posts, student profiles, and admin employer verification.
    - Add validation and consistent API error responses.
