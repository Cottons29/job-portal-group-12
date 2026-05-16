/**
 * DTO for `POST /student-profile`.
 *
 * Requests are sent as `multipart/form-data` so the optional CV file can ride
 * alongside the other fields. Multipart fields are always strings on the wire,
 * which is why complex shapes (`skills`, `availability`) are received as
 * JSON-encoded strings and parsed in the service layer.
 */
export class SaveStudentProfileDto {
  // Step 1 — Academic info
  fullName: string;
  university: string;
  major: string;
  yearLevel?: string;
  bio?: string;

  // Step 2 — Career preferences
  jobType?: string;
  expectedSalary?: string;
  currency?: string;

  // JSON-encoded array (e.g. `["Vue.js","English"]`)
  skills?: string;

  // JSON-encoded object keyed by day -> { morning, afternoon, evening }
  availability?: string;
}
