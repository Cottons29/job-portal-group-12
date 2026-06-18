# Team Contributions & Responsibilities

This page provides a detailed breakdown of each team member's contributions and responsibilities, derived from the
project's development history and git commits.

## Summary Table

| Member Name           | Role                        | Git Commit Count | Primary Areas of Contribution                                                                                                                                                                                                      |
|:----------------------|:----------------------------|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Sok Lypheng**       | Lead Full-Stack Developer   | 224              | Monorepo setup, Pinia stores, Stories, Messages, Follows modules, Rust File Service integration, TypeScript migration. Slide presentation (Reveal.js HTML structure), progress book content drafting, final project documentation. |
| **SOPHEAP Sothiphak** | Integration & Security      | 47               | CORS & SSL server fixes, real-time WebSocket notifications, recruitment pipeline status tracking, match recommendations.                                                                                                           |
| **Chantha Mengkong**  | Core Feature Developer      | 29               | Authentication validation (DTOs), Forgot password (OTP via email), Employer post management, Job detail views.                                                                                                                     |
| **Luy Lyhor**         | Frontend & Layout Developer | 2                | Core Layout (Navbar & Footer), frontend dependencies.                                                                                                                                                                              |
| **CHHON PHEAKDEY**    | UI/UX & Design              | Design Focus     | High-fidelity Figma layouts, Material 3 design tokens, responsive mobile wireframes, branding elements.                                                                                                                            |
| **KEO SIENGHENG**     | QA & E2E Tester             | N/A              | N/A                                                                                                                                                                                                                                |
| **CHENG SAKDA**       | Presenter & Writer          | N/A              | N/A                                                                                                                                                                                                                                |

---

## Technical Implementations by Member

### Sok Lypheng

* **Core Architecture**: Initialized the full-stack monorepo, Docker & Docker-Compose files, and optimized the GitHub
  Actions CI/CD deployment pipeline.
* **State Management**: Designed and built the global Pinia stores for authentication, stories, posts, and user
  profiles.
* **Stories Module**: Implemented full-stack capabilities for adding, viewing, and deleting temporary stories with
  automated expiry.
* **Follows & Connections**: Developed follow/unfollow logic, follower/following queries, and relationship endpoints.
* **Messaging Infrastructure**: Built the core chat schema, contact lists, and message retrieval controllers.
* **File Handling Integration**: Integrated the remote Rust-based image and document upload service ("Sheep").
* **Localization**: Implemented default locale persistence using localStorage and global i18n configurations.

### SOPHEAP Sothiphak

* **CORS & Server Security**: Configured CORS settings for production domains (`cottonsofficial.com`),
  solved secure HTTPS routing, and resolved SSL certificate mismatch issues.
* **Job Application Pipeline**: Built backend logic for applicants to apply for jobs and track their status (Submitted →
  Viewed → Interview → Offer → Result).
* **Real-time Notifications**: Implemented WebSocket gateways and NestJS event listeners to deliver live, real-time user
  notifications.
* **Skill Matching Algorithm**: Engineered the semantic AI skill-match algorithm that scores student profile skills
  against job requirements.
* **UI Refinement & Responsiveness**: Cleaned up post feed layout cards, sidebars, interactive filtering controls, and
  optimized mobile layouts.

### Chantha Mengkong

* **Security & Recovery**: Developed the forgot password flow utilizing secure email OTP verification codes.
* **Employer Features**: Designed the employer dashboard view, company profile page, and the part-time job posting form.
* **Student Registration**: Programmed the student registration validators (DTOs) and integrated the secure student ID
  card upload feature for admin verifications.
* **Views & Navigation**: Refactored routing tables, built the student job detail views, and saved-jobs tracking
  components.

### Luy Lyhor

* **Base Components**: Created the global `Navbar` and `Footer` components to establish layout consistency across all
  views.
* **Dependencies**: Managed backend configuration packages and package lock synchronizations.

---

## Design, Testing & Documentation Roles

### CHHON PHEAKDEY

* Led the **UI/UX phase** in Figma. Designed the wireframes, defined the light/dark palette, typography standards, and
  responsive grid layouts.