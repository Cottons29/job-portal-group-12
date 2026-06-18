# 8.2. Project Constraints & Mitigation Strategies

Beyond code, the project operated under real constraints.

| Constraint | Impact | Mitigation |
| :--- | :--- | :--- |
| **Fixed timeline** (one semester) | Limited how much could be built | Weekly sprints with prioritized, demonstrable slices |
| **Uneven contribution** | A few members drove most commits | Clear role specialization (design, QA, docs) so non-coding work added value |
| **Broad scope** (portal + social layer) | Risk of spreading too thin | Modular architecture so domains could be built and tested independently |
| **Learning curve** (NestJS, WebAuthn, Rust service) | Time spent on unfamiliar tech | Front-loading scaffolding, then layering features incrementally |
| **Integration risk** | Merges could destabilize main | The "rescue branch" workflow provided a safe recovery path |
| **Environment differences** | "Works on my machine" issues | Docker / Docker Compose for reproducible environments |

### Overall strategy
The recurring theme was **risk reduction through structure**: a modular codebase,
reproducible environments, automated delivery, and a disciplined branching
strategy meant the team could absorb setbacks without derailing the timeline.
