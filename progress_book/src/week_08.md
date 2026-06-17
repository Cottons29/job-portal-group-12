# Week 8 - 16.May.2026

## Progress: Profile Consolidation, Follows, Stories & Messaging

This week unified profile handling into the user module and expanded the social
side of the platform with follows, stories, and direct messaging.

### Profile consolidation
- Migrated student and employer profile functionality into a unified `Profile`
  module with shared DTOs, services, and controllers, removing redundant modules
  and entities.
- Added reusable `BaseModal` and `ProfileModal` components for viewing user
  details.
- Added Pinia stores for posts and profiles to centralize state management.

### Social graph & content
- Added the follows module (follow/unfollow, follower/following queries, REST
  endpoints).
- Added the stories module with creation, retrieval, deletion, and media upload,
  plus `AddStoryModal`, `StoryViewerModal`, a dynamic `StoryStrip`, and a story
  Pinia store.
- Added the messages module with a messaging entity, contact retrieval, and chat
  history, surfaced through a `MessagesSection`.

### Other improvements
- Stored the user role in the session and included it in the authenticated guard
  for role-based access.
- Added semantic AI match-score breakdowns, interactive feed filters, a PDF
  resume generator, and backend throttler/rate-limiter security.
- Persisted the user-selected locale in `localStorage`.
- Added drag-and-drop logo upload to the employer setup; began identity
  verification with student ID-card upload to admin.

### Challenge
Consolidating the previously separate student and employer profile code into one
unified `Profile` module — while deleting redundant modules and entities — risked
breaking existing flows, so the refactor had to be done carefully. At the same
time, building out the social graph (follows), ephemeral stories with media
upload, and real-time direct messaging meant designing several new, interrelated
features and Pinia stores without destabilizing the rest of the app.

### Commits this week (selection)
- Migrate student/employer profile functionality into a unified Profile module.
- Add follows module / stories module / messages module.
- Add Pinia stores for posts and profiles; add BaseModal and ProfileModal.
- Implement semantic AI match-score breakdowns and backend rate limiter.
- update student registration including upload id card to admin.
