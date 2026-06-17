# Week 5 - 25.April.2026

## Progress: Database Integration, Real-Time Notifications & Student Profiles

This week connected the application to a real database, added real-time
notifications, and persisted student profiles. The first formal status review of
the product requirements was also recorded.

### Database & infrastructure
- Installed TypeORM and configured a global database connection.
- Integrated TypeORM with PostgreSQL, centralized `.env` configuration, and
  replaced `axios` with a custom API utility in the frontend auth store.
- Added a Docker setup with a Postgres service and a persistent data volume.
- Consolidated dependencies into the root `package.json`.

### Real-time notifications
- Added a real-time notification system using WebSockets (Task 29).

### Student profiles
- Added the student profile module with DTOs, controller, service, and API
  integration.
- Enhanced student profile handling with new fields, improved save logic, and
  error handling across the frontend and backend.

### Status review (01.May.2026)
- Recorded the current implementation status against the Student Part-Time Job
  Portal requirements, documenting progress on authentication, student/employer
  features, admin/moderation, and the next-priority recommendations.

### Challenge
Moving from in-memory data to a real PostgreSQL database via TypeORM surfaced the
usual integration pain: connection configuration, centralizing `.env` settings,
and standing up Postgres in Docker with a persistent volume. On top of that,
adding real-time WebSocket notifications meant managing live connections and
events alongside the request/response API, while keeping student-profile
persistence consistent across the frontend and backend.

### Commits this week
- feat: add real-time notification system / websocket notifications (Task 29).
- fix: install typeorm and configure global database connection.
- Add Docker setup with Postgres service and data volume.
- Integrate TypeORM with PostgreSQL, centralize .env, replace axios with API util.
- Add student profile module with DTOs, controller, service, and API integration.
- Document current implementation status and pending features.
