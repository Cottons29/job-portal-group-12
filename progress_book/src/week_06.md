# Week 6 - 02.May.2026

## Progress: TypeScript Migration, Material Design, Passkeys, Posts & i18n

This was a large week: the frontend was migrated to TypeScript, restyled with a
Material Design 3 system, and gained passkey authentication, a social posts
feed, a dedicated file service, employer job posting, and multi-language support.

### Frontend platform & design
- Migrated the frontend codebase from JavaScript to TypeScript and replaced
  `jsconfig.json` with a modular TypeScript configuration.
- Refactored navigation to use `RouterLink` and added static pages for Privacy
  Policy, Terms of Service, About Us, and Contact.
- Redesigned the landing page with Material Design 3, introduced a global design
  token system with light/dark themes, and added a `useThemeMode` composable.

### Authentication
- Implemented passkey (WebAuthn) authentication: registration, login, and
  management, backed by a dedicated `PasskeyCredential` entity.
- Extended the `User` entity with the passkey credentials relationship and added
  bearer-token support to the Axios-based API layer alongside session credentials.

### Social posts & file service
- Added the `PostsModule` with CRUD functionality and pagination for posts.
- Integrated the `SheepFileService` and a standalone `file_service` for file
  upload, listing, downloading, and streaming.
- Introduced a friendly TipTap-based post editor with sanitized markdown
  rendering and image upload handling.

### Employer & internationalization
- Implemented a job posting form for employers.
- Implemented full bilingual (EN/KM) support and later added French, Japanese,
  Simplified Chinese, and Traditional Chinese locale files.
- Implemented search & filtering for the job feed and a student-facing job detail
  page.

### Challenge
This was the most demanding week of the project, juggling several hard problems at
once. Migrating the entire frontend from JavaScript to TypeScript without breaking
existing features required disciplined, incremental typing. Implementing passkey
(WebAuthn) authentication brought low-level credential and challenge handling, and
rolling out six locales (EN/KM/FR/JA/zh-Hans/zh-Hant) demanded a scalable i18n
structure — all while introducing a Material Design 3 theme system and a social
posts feed with a markdown editor.

### Commits this week (selection)
- Migrate the frontend codebase to TypeScript; add static info pages.
- Redesign LandingPage with Material Design 3; add theme tokens and `useThemeMode`.
- Implement passkey authentication and `PasskeyCredential` entity.
- Add `PostsModule` (CRUD + pagination) and `SheepFileService` / `file_service`.
- Implement employer job posting form.
- Implement full bilingual support (EN/KM) and additional locales.
