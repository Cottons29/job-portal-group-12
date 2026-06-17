# Week 7 - 09.May.2026

## Progress: Job Applications, Payload Encryption, Social Engagement & Deployment

This week added the job application flow, secured the auth payloads with
encryption, enriched posts with social engagement, and set up the CI/CD
deployment pipeline.

### Job applications & notifications
- Implemented the job application flow end-to-end.
- Completed end-to-end integration of the automated real-time notifications
  engine.

### Security
- Integrated payload encryption for authentication endpoints with a
  `PayloadEncryptionService` (RSA-OAEP + AES-GCM) and an `EncryptedPayloadDto`.
- Added matching frontend `payloadEncryption.ts` so login/register payloads are
  encrypted before transport.
- Added session management using `connect-typeorm` with a `SessionEntity`.

### Social engagement
- Added likes, comments, shares, and bookmarks APIs and UI for posts.
- Added the missing `socket.io-client` dependency.
- Reworked the search section in the placeholder view with role filters and
  dynamic results.

### Deployment pipeline
- Built out the GitHub Actions deploy workflow: Docker Buildx, multi-platform
  builds, GHCR image publishing, and `podman-compose`-based remote deployment,
  with the image repository name derived dynamically from `GITHUB_REPOSITORY`.
- Upgraded backend/frontend Dockerfiles to `node:26-alpine`.

### Challenge
The standout challenge was end-to-end payload encryption: getting RSA-OAEP plus
AES-GCM to interoperate correctly between the browser (`payloadEncryption.ts`) and
the NestJS `PayloadEncryptionService`, so encrypted login/register payloads
decrypt reliably. Standing up the CI/CD pipeline was equally fiddly — Docker
Buildx, multi-platform builds, GHCR publishing, and `podman-compose` deployment
took many iterations to get the image-repository naming and remote steps right.

### Commits this week (selection)
- feat: implement job application flow.
- feat: complete end-to-end integration of automated real-time notifications engine.
- Integrate payload encryption (RSA-AES) for authentication endpoints.
- feat(posts): add likes, comments, shares, bookmarks API and UI.
- Add Docker Buildx setup and multi-platform builds in the deploy workflow.
- Add session management using `connect-typeorm` and `SessionEntity`.
