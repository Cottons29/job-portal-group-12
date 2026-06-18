# 4. Technical Architecture & Design

This section describes how the system is built. It covers the overarching
architectural pattern, how the system is divided into domains and how those
domains communicate, the technology stack chosen for each layer, and the database
design that underpins it all.

At a high level, the platform is a **modular monolith** API plus a **single-page
frontend**, with media handling delegated to a **separate file service**:

```text
┌───────────────────────┐     HTTPS / WS     ┌────────────────────────────┐
│  Vue 3 + Vite SPA     │ ◀────────────────▶ │  NestJS API (modular)      │
│  (TypeScript, MD3)    │                    │  Identity · Content ·      │
└───────────────────────┘                    │  Discovery · Planning ·    │
            │                                │  Real-time                 │
            │ media upload                   └────────────┬───────────────┘
            ▼                                             │ TypeORM
┌───────────────────────┐                    ┌────────────▼──────────────┐
│  Rust File Service    │                    │  PostgreSQL               │ 
│  ("Sheep")            │                    └───────────────────────────┘
└───────────────────────┘
```

The subsections expand on each part of this picture.
