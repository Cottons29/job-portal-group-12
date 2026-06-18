# 5.3. Collaborative Planning

The recruitment pipeline is the shared workflow that connects students and
employers after an application is submitted.

### The pipeline
Each application advances through explicit, ordered stages:

```text
Submitted → Viewed → Interview → Offer → Result
```

- **Submitted** — the student applies; the application enters the employer's
  pipeline.
- **Viewed** — the employer has seen the application.
- **Interview** — the candidate is being interviewed/coordinated.
- **Offer** — an offer is extended; the student can accept or decline.
- **Result** — the final outcome is recorded.

### Shared, consistent state
The hardest part of the pipeline is keeping a **single source of truth** that both
the student and the employer see consistently. The application's current stage is
stored on the `Application` entity, and both sides read from it, so there is never
a divergence between what the student sees and what the employer sees.

### Implementation notes
- Backend logic handles applying for jobs and transitioning stages.
- Each meaningful transition emits an event that the notification system reacts to
  (see [5.4](./impl_realtime.md)), so the student is informed when their status
  changes.
