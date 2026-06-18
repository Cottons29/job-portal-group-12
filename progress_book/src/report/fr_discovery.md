# 3.1.3. Intelligent Discovery Hub (Discovery Domain)

The Discovery domain helps students find the most relevant opportunities rather
than just the most recent ones.

### Requirements
- **Job posting.** Employers can create, edit, and manage part-time job posts,
  including required skills.
- **Search & filtering.** Students can search jobs and filter by relevant
  criteria (e.g. category, skills).
- **Skill-match recommendations.** A semantic skill-matching algorithm scores how
  well a student's declared skills align with a job's requirements and surfaces
  the best matches.
- **Saved jobs.** Students can save jobs to revisit later.
- **Job detail views.** Each job exposes a dedicated detail view with the full
  description and an apply action.

### Acceptance criteria
- Recommended jobs are ordered by match score, not solely by recency.
- Filters narrow the result set correctly and can be combined.
- Saved jobs persist for the student across sessions.
