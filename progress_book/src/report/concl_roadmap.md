# 9.3. Future Roadmap

Natural next steps for the platform include:

### Short term
- **Strengthen testing**: add automated unit, integration, and end-to-end tests to
  reduce reliance on manual QA.
- **Admin console**: build proper tooling for student verification and content
  moderation.
- **Observability**: introduce structured logging, metrics, and error monitoring.

### Medium term
- **Smarter matching**: evolve the skill-match algorithm toward semantic
  embeddings and feedback-driven ranking.
- **Richer notifications**: add notification preferences and digesting.
- **Mobile apps**: wrap or rebuild the experience for native mobile.

### Long term
- **Service extraction**: peel high-load domains (e.g. discovery, real-time) out
  of the modular monolith into dedicated services if scale demands it.
- **Analytics & insights**: give employers hiring analytics and give students
  application insights.
- **Payments / contracts**: support agreements and payments for completed work.

The modular-monolith foundation was chosen precisely so that this kind of growth
can happen incrementally rather than requiring a rewrite.
