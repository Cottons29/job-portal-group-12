# 4.2. Domain Breakdown & Communication

The API is decomposed into modules that map one-to-one with the functional
domains:

| Module | Responsibility |
| :--- | :--- |
| **Auth / Identity** | Registration, login (session + passkey), OTP recovery |
| **Profile** | Unified student/employer profiles |
| **Follows** | Follow/unfollow graph and relationship queries |
| **Posts / Stories** | User-generated content and engagement |
| **Jobs / Discovery** | Job posts, search, filtering, skill-match recommendations |
| **Applications** | Recruitment pipeline and applicant tracking |
| **Messages** | Direct messaging |
| **Notifications** | WebSocket gateway and event listeners |
| **Upload** | Bridge to the Rust file service |

### Communication
- **Frontend ↔ API.** The SPA talks to the API over HTTPS (REST-style endpoints)
  and a **WebSocket** connection for real-time notifications and messaging.
- **Intra-API.** Modules collaborate through injected services and an
  **event-driven** mechanism: domain actions (e.g. an application stage change)
  emit events that notification listeners react to, keeping cross-domain coupling
  loose.
- **API ↔ File service.** Media uploads are proxied/handed to the standalone Rust
  service, which stores files and returns URLs referenced by the API's entities.
