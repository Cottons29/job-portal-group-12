# 5.2. Intelligent Discovery

Discovery turns a flat list of jobs into a relevance-ranked experience.

### Search & filtering
Students can search the job catalogue and apply filters (such as category and
skills). Filtering is composable, so multiple criteria narrow the result set
together. Job detail views present the full description and an apply action, and
students can save jobs for later.

### Skill-matching algorithm
The centerpiece of discovery is a **semantic skill-matching algorithm**. It
compares a student's declared skills against the skills required by each job and
produces a **match score**. Jobs are then surfaced ordered by this score, so the
most relevant opportunities rise to the top rather than the most recent ones.

Conceptually, the algorithm:
1. Reads the student's profile skills.
2. Reads each job's required skills.
3. Computes the overlap/similarity between the two skill sets.
4. Ranks candidate jobs by the resulting score.

### Implementation notes
- The matching logic lives in the Discovery/Jobs domain on the backend.
- Tuning the algorithm to balance precision and useful coverage was one of the
  later-week refinements of the project.
