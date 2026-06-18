# 3.2.1. Performance

- **Responsive UI.** The Vue 3 + Vite single-page application loads quickly and
  responds to interaction without noticeable lag, using client-side routing to
  avoid full page reloads.
- **Efficient queries.** Backend data access through TypeORM uses targeted
  queries and relations to avoid over-fetching; list endpoints support pagination
  where appropriate.
- **Offloaded media.** Image and document handling is delegated to the dedicated
  Rust file service, keeping the API and primary database free of large binary
  payloads.
- **Real-time efficiency.** WebSocket connections push only the events a client
  needs, rather than relying on polling.
