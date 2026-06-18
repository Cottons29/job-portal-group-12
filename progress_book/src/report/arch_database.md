# 4.4. Database Design

The system uses **PostgreSQL** as its primary relational store, accessed through
**TypeORM** entities. The schema is organized around the same domains as the
application modules.

### Core entities (conceptual)
- **User** — base account with role (student / employer) and credentials,
  including passkey registration data.
- **Profile** — unified profile linked to a user, with role-specific fields
  (skills, education for students; company info for employers).
- **Follow** — a relationship row linking a follower to a followee.
- **Post / Story** — user-generated content, with related **Comment**, **Like**,
  and **Share** records; stories carry an expiry timestamp.
- **Job** — an employer's part-time listing with required skills.
- **Application** — links a student to a job and carries the current pipeline
  **stage** (Submitted → Viewed → Interview → Offer → Result).
- **Message** — a direct message between two users, grouped into conversations.
- **Notification** — a record of an event delivered to a user.

### Design principles
- **Relations over duplication.** Foreign keys connect entities (e.g. a Job to
  its Employer, an Application to its Job and Student) to keep data normalized.
- **Media by reference.** Binary media is not stored in PostgreSQL; entities
  reference URLs produced by the Rust file service.
- **Schema via TypeORM.** Entity definitions are the source of truth for the
  schema, keeping the database aligned with the application model.
