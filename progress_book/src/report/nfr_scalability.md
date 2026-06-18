# 3.2.2. Scalability & Reliability

- **Containerized deployment.** Each component is packaged with Docker and
  orchestrated via Docker Compose, making it straightforward to run and scale
  consistently across environments.
- **Separable file service.** Media handling lives in an independent Rust service
  that can be scaled or replaced without touching the core API.
- **Stateless API where possible.** Business logic is kept in stateless services
  backed by PostgreSQL, so additional API instances can be added behind a load
  balancer.
- **Reliable delivery.** The CI/CD pipeline produces reproducible images, and the
  modular design isolates failures to individual domains rather than the whole
  system.
