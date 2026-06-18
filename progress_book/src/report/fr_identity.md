# 3.1.1. Identity & Social Graph (Identity Domain)

The Identity domain owns accounts, authentication, profiles, and the relationships
between users.

### Requirements
- **Registration & roles.** Users can register as either a *student* or an
  *employer*. Student registration is validated through DTOs and supports
  uploading a student ID card for administrator verification.
- **Authentication.** The system supports session-based login and **passkey
  (WebAuthn)** login. Sensitive authentication payloads are encrypted in transit.
- **Account recovery.** Users can reset a forgotten password through a secure
  email **OTP** flow.
- **Unified profiles.** A single profile module represents both student and
  employer profiles, exposing role-appropriate fields (e.g. skills and education
  for students, company information for employers).
- **Social graph.** Users can **follow** and **unfollow** one another; the system
  exposes follower/following lists and relationship queries.

### Acceptance criteria
- A student cannot access employer-only routes and vice versa (role
  authorization).
- A passkey-registered user can log in without a password.
- A password reset cannot complete without a valid, unexpired OTP.
