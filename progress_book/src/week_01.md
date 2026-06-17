# Week 1 - 21.March.2026

## Progress: Project Kickoff — Monorepo & Scaffolding

The first week established the foundation of the Student Part-Time Job Portal by
setting up a workspace-based monorepo and scaffolding the backend and frontend
applications, plus the documentation book itself.

### What was done
- Initialized a workspace-based monorepo using npm, configuring the root
  `package.json` to manage `backend` and `frontend` as separate workspaces.
- Scaffolded the backend as a NestJS application under `backend/` (controllers,
  modules, services, `nest-cli.json`, `tsconfig.json`, `eslint.config.mjs`).
- Scaffolded the frontend as a Vue.js + Vite application under `frontend/`.
- Added convenience scripts in the root `package.json` to start both services.
- Added the `progress_book` mdBook documentation with its initial chapter and
  `book.toml` configuration.

### Project structure at the end of the week
```text
.
├── backend/            # NestJS API
├── frontend/           # Vue.js + Vite frontend
├── progress_book/      # Documentation (mdBook)
├── package.json        # Root workspace configuration
└── node_modules/       # Shared dependencies
```

### Challenge
The main challenge was establishing a clean monorepo structure that lets the
NestJS backend and the Vue + Vite frontend live side by side while sharing a
single dependency tree. Getting the workspace configuration, scripts, and tooling
to cooperate — without the two stacks stepping on each other — set the tone for
the rest of the project.

### Commits this week
- Init project with backend and frontend as Monorepo.
- Add progress book documentation with initial chapter and configuration.
