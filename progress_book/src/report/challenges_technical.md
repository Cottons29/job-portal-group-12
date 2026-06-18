# 8.1. Technical Hurdles

Several engineering problems stood out as genuinely difficult:

- **Monorepo cohesion.** Standing up a clean workspace-based monorepo where a
  NestJS backend and a Vue + Vite frontend share one dependency tree, without the
  two stacks stepping on each other, set the tone for the whole project.
- **Encryption interoperability.** Implementing **RSA/AES** payload encryption so
  that the frontend's encryption and the backend's decryption interoperated
  correctly was subtle and error-prone.
- **TypeScript migration + WebAuthn + i18n at once.** A single sprint took on a
  large multi-front migration to TypeScript, the addition of passkey (WebAuthn)
  login, and six locales — a lot of moving parts landing together.
- **Consistent pipeline state.** Keeping the recruitment pipeline's shared state
  consistent end to end — so students and employers never saw conflicting
  stages — required careful modeling.
- **Profiles + social layer together.** Consolidating student and employer
  profiles into one module while simultaneously adding a whole social layer
  (follows, stories, messaging) was a delicate refactor.
- **Tuning the matching algorithm.** Balancing the skill-match algorithm so it
  was both relevant and useful (not too narrow, not too noisy) took iteration.
- **SSL / CORS in production.** Resolving SSL certificate mismatches, secure HTTPS
  routing, and correct CORS for production domains was necessary to ship.

### How they were solved
The team addressed these through incremental delivery, isolating risky work on
dedicated branches (see the [Rescue Branch workflow](./dev_version_control.md)),
and revisiting features in later sprints to refine rather than rush them.
