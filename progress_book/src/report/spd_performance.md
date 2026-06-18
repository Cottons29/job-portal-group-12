# 7.2. Performance Optimization

Several deliberate choices keep the platform responsive.

- **SPA with client-side routing.** The Vue 3 + Vite frontend avoids full page
  reloads, giving a fast, app-like experience.
- **Offloaded media.** Image and document handling runs in a dedicated **Rust**
  file service, so the API and database are never burdened with large binary
  payloads, and media serving can scale on its own.
- **Targeted data access.** TypeORM queries fetch only what is needed and lean on
  relations, avoiding over-fetching; list endpoints paginate where appropriate.
- **Push over poll.** Real-time updates use **WebSockets**, so the client receives
  events as they happen instead of repeatedly polling the server.
- **State caching on the client.** Pinia stores cache fetched data so views can
  render immediately and update in the background.
