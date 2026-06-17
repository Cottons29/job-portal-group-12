# Week 4 - 18.April.2026

## Progress: User Profiles & Site Navigation

This week introduced shared site navigation and the first role-aware user/profile
domain models on the backend.

### What was done
- Added `Navbar` and `Footer` components to establish a consistent site layout.
- Implemented the user module with separate profile handling for the `employer`
  and `student` roles.
- Refactored shared backend code into a common folder for reuse across modules.
- Added supporting backend dependencies and updated the lockfile.

### Outcome
The backend now distinguishes student and employer profiles at the data level,
and the frontend has reusable navigation chrome.

### Challenge
The challenge was modeling two fundamentally different user types — students and
employers — within one coherent user domain. Deciding how much profile logic to
share versus separate, and refactoring common code into a reusable folder without
creating a tangled dependency graph, took careful design so the model could grow
cleanly later.

### Commits this week
- Add Navbar and Footer components to enhance site layout.
- implement user module and profile for employer and student module separated.
- refactor common folder location.
- Add backend dependencies and update package-lock.json.
