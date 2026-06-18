# 7.3. DevOps & CI/CD Pipeline

The project is fully containerized and continuously deployed.

### Containerization
Every component — backend API, frontend, Rust file service, and supporting
services — is packaged with **Docker** and orchestrated via **Docker Compose**.
This gives reproducible environments locally and in production, and makes the
system easy to stand up from scratch.

### Continuous integration & deployment
A **GitHub Actions** pipeline builds and deploys the whole project automatically:

1. On changes, the pipeline builds each component's image.
2. Images are published to the **GitHub Container Registry (GHCR)**.
3. The deployment target pulls and runs the new images.

### Documentation as part of the pipeline
This **mdBook** progress book is built and deployed through the same automated
pipeline, so the documentation always tracks the project. Getting the book to
build and deploy automatically was one of the final-week milestones.

### Outcome
Because delivery is automated end to end, shipping a change requires no manual
build or copy steps — a merge flows through to a running deployment, which kept
the team's feedback loop short throughout the project.
