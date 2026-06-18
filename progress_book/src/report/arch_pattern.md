# 4.1. Architectural Pattern: Modular Monolith

The backend is built as a **modular monolith**: a single deployable NestJS
application internally divided into cohesive, loosely-coupled modules — one per
domain (Identity, Content, Discovery, Planning, Real-time).

### Why a modular monolith?
- **Right-sized for the team and timeline.** A full microservice architecture
  would add operational overhead (service discovery, inter-service networking,
  distributed transactions) that a semester project does not need.
- **Clear internal boundaries.** NestJS modules enforce encapsulation: each
  module owns its controllers, services, and entities, and exposes a narrow
  surface to the rest of the app.
- **Simple deployment.** One API image to build, test, and ship, while still
  keeping the codebase organized for future extraction into services if needed.
- **Easy refactoring.** Because boundaries are explicit, a module can later be
  pulled out into its own service with minimal churn.

The one piece deliberately kept *outside* the monolith is the **Rust file
service**, because media upload/serving has very different performance and
scaling characteristics from the transactional API.
