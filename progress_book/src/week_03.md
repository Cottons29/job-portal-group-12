# Week 3 - 04.April.2026

## Progress: Backend Authentication & File Uploads

This week delivered the first working backend authentication implementation and
the file-upload foundation needed for resumes/CVs.

### Authentication (NestJS)
- Added the `AuthModule`, `AuthController`, and `AuthService` with endpoints for
  registration, login, logout, and the current-session profile.
- Implemented stateful, session-based authentication using `express-session`.
- Added an `AuthenticatedGuard` to protect routes via session validation.
- Added `bcrypt` and `express-session` dependencies with their TypeScript typings.

### File uploads
- Added the `UploadModule` and `UploadController` with single- and multiple-file
  upload endpoints, configured with Multer.
- Added `@nestjs/platform-express` and `@types/multer` dependencies.

### Outcome
The backend now supports a complete session-based auth cycle and can accept file
uploads, laying the groundwork for CV handling.

### Challenge
The hard part this week was making session-based authentication actually secure
and reliable: hashing passwords with `bcrypt`, persisting sessions with
`express-session`, and guarding routes so only authenticated requests pass. In
parallel, configuring Multer for single- and multiple-file uploads required
careful handling of file types and limits to prepare for CV/resume storage.

### Commits this week
- Add AuthModule / AuthController / AuthService / AuthenticatedGuard.
- Add session management with express-session in main bootstrap function.
- Implement authentication with stateful server + session id.
- Add UploadModule / UploadController with Multer configuration.
- Setting up the file upload for Project.
