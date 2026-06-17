# Week 2 - 28.March.2026

## Progress: Authentication UI & Student Onboarding

With the scaffolding in place, work focused on the frontend authentication
experience and the student onboarding flow.

### What was done
- Built the authentication UI and wired up client-side state with Pinia,
  supporting login/register mode switching and role selection.
- Redesigned the student setup (onboarding) screen with a multi-card layout and
  an interactive weekly-availability grid.
- Merged the profile-setup work into `main`.

### Outcome
The frontend can now collect credentials and capture a student's basic profile
and availability during onboarding, backed by a Pinia auth store.

### Challenge
Building a polished authentication and onboarding experience before the backend
auth API existed meant designing the UI and Pinia state around contracts that
were still being defined. The trickiest part was the multi-card student setup with
its interactive weekly-availability grid, which had to stay intuitive while
capturing structured, schedule-style data.

### Commits this week
- Task 12 — Frontend: Build Auth UI & Pinia State.
- feat(onboarding): redesign StudentSetup with multi-card layout and availability grid.
- Merge pull request #2 (feat/task14-profile-setup).
