# Week 1 (22, Mar, 2026)

## Progress: Initialize Monorepo with Scaffolding Project

In the first week, the foundation of the project was established by setting up a monorepo structure and scaffolding both the backend and frontend applications.

### 1. Monorepo Setup
- Initialized a workspace-based monorepo using npm.
- Configured `package.json` at the root to manage `backend` and `frontend` as separate workspaces.
- Added convenience scripts in the root `package.json` to start both the backend and frontend services.

### 2. Backend Scaffolding (NestJS)
- Scaffolder a new NestJS application within the `backend/` directory.
- Standard project structure was created including:
    - `src/`: Main application logic (Controllers, Modules, Services).
    - `test/`: End-to-end and unit test configurations.
    - Configuration files: `nest-cli.json`, `tsconfig.json`, `eslint.config.mjs`.

### 3. Frontend Scaffolding (Vue.js + Vite)
- Scaffolder a new Vue.js application using Vite in the `frontend/` directory.
- Basic setup includes:
    - `src/`: Vue components, assets, and main entry point.
    - `public/`: Static assets.
    - Configuration files: `vite.config.js`, `jsconfig.json`.

### 4. Project Structure
The current project structure is organized as follows:
```text
.
├── backend/            # NestJS API
├── frontend/           # Vue.js Frontend
├── progress_book/      # Documentation (MdBook)
├── package.json        # Root workspace configuration
└── node_modules/       # Shared dependencies
```

### 5. Scripts
- `frontend` : starting the frontend application using Vite.
- `backend` : starting the backend application using NestJS.
