# 4.3. Technology Stack

| Layer | Technology | Notes |
| :--- | :--- | :--- |
| Frontend | **Vue 3** + **Vite**, TypeScript | SPA with client-side routing |
| State | **Pinia** | Global stores for auth, profiles, posts, stories |
| Styling | **Material Design 3** token system | Light/dark themes, consistent tokens |
| i18n | vue-i18n | Six locales, persisted via `localStorage` |
| Backend | **NestJS** (Node.js, TypeScript) | Modular monolith |
| ORM | **TypeORM** | Entities and relations over PostgreSQL |
| Database | **PostgreSQL** | Primary relational store |
| Real-time | **WebSockets** (NestJS gateways) | Notifications and messaging |
| File service | **Rust** ("Sheep") | Standalone image/document upload service |
| Auth | Sessions + **WebAuthn** passkeys | Encrypted payloads (RSA/AES) |
| Containerization | **Docker** + Docker Compose | Reproducible local & prod environments |
| CI/CD | **GitHub Actions** + **GHCR** | Builds/deploys all components, incl. this book |
| Docs | **mdBook** | This progress book |

The whole project lives in a **workspace-based monorepo**, so the backend,
frontend, file service, and documentation share a single repository and a unified
tooling/dependency setup.
