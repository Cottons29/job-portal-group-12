# 3.1.4. Collaborative Planning (Planning Domain)

The Planning domain models the recruitment workflow that students and employers
collaborate on after an application is submitted.

### Requirements
- **Applications.** Students can apply to a job; employers receive the
  application in their pipeline.
- **Recruitment pipeline.** Each application moves through explicit stages:
  **Submitted → Viewed → Interview → Offer → Result**.
- **Applicant tracking.** Employers can review applicants, advance their stage,
  and respond to them.
- **Offer responses.** Students can respond to offers (accept/decline), and
  interview stages can be coordinated.
- **Shared state.** Both sides see a consistent, up-to-date view of the
  application's current stage.

### Acceptance criteria
- A student always sees the current stage of every application they submitted.
- Stage transitions are reflected on both the student and employer views without
  inconsistency.
- Notifications are emitted on relevant stage changes (see
  [3.1.5](./fr_realtime.md)).
