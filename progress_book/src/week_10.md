# Week 10 - 06.June.2026

## Progress: Email Notifications, Mobile Responsiveness & Recruitment Pipeline

After a short break, this week delivered global email notifications, mobile
layout improvements, and the core of the recruitment pipeline: recommendations,
applicant tracking, and the offer-response flow.

### Notifications & responsiveness
- Implemented global email notifications and responsive mobile layouts.
- Fixed profile and story media upload network errors and optimized mobile
  responsiveness.
- Refactored file upload to use only the remote Sheep service and updated API
  routes.

### Recruitment pipeline
- Implemented matching recommendations, applicant tracking, an offer-response
  flow, messaging automation, and admin moderation.
- Enabled employers to view the profiles of applicants and render profiles based
  on post type.
- Added student-side saved-jobs viewing in the profile.

### Hardening
- Validated the user role on login and added register-validation DTOs.
- Improved error handling with a shared `getError` helper and fixed an admin
  dashboard logout bug.

### Challenge
Returning after a break, the week's biggest challenge was the recruitment
pipeline itself — matching recommendations, applicant tracking, the offer-response
flow, messaging automation, and admin moderation all share state and had to stay
consistent end to end. Alongside that, making the whole UI responsive on mobile
and chasing down profile/story media-upload network errors (resolved by moving
uploads fully onto the remote Sheep service) demanded broad, cross-cutting fixes.

### Commits this week (selection)
- Implement global email notifications and responsive mobile layouts.
- feat: implement matching recommendations, applicant tracking, offer response flow, messaging automation, and admin moderation.
- employer can view profile of applicants.
- add register validation dto; Validate user role on login.
- Refactor file upload to use only remote Sheep service.
