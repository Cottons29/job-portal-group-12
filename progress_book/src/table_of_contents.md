# Table of Contents

A map of the book. The **Overall Report** documents the project end to end, and the
**Weekly Reports** track the project's development week by week.

## Overall Report

A comprehensive, end-to-end write-up of the Student Part-Time Job Portal.

| Section | Title                                                                     |
|---------|---------------------------------------------------------------------------|
| 1       | [Executive Summary](./report/executive_summary.md)                        |
| 2       | [Introduction](./report/introduction.md)                                  |
| 2.1     | [Problem Statement](./report/problem_statement.md)                        |
| 2.2     | [Project Objectives](./report/project_objectives.md)                      |
| 2.3     | [Target Audience](./report/target_audience.md)                            |
| 2.4     | [Success Metrics](./report/intro_success_metrics.md)                      |
| 3       | [System Analysis & Requirements](./report/system_analysis.md)             |
| 3.1     | [Functional Requirements](./report/functional_requirements.md)            |
| 3.2     | [Non-Functional Requirements](./report/non_functional_requirements.md)    |
| 3.3     | [Success Metrics](./report/system_success_metrics.md)                     |
| 4       | [Technical Architecture & Design](./report/technical_architecture.md)     |
| 5       | [Implementation & Core Features](./report/implementation.md)              |
| 6       | [Development Process & Team Dynamics](./report/development_process.md)    |
| 7       | [Security, Performance & DevOps](./report/security_performance_devops.md) |
| 8       | [Challenges & Solutions](./report/challenges.md)                          |
| 9       | [Conclusion & Future Work](./report/conclusion.md)                        |
| 10      | [References & Appendices](./report/references_appendices.md)              |

## Weekly Reports

A week-by-week map of the project's development. Each week links to its full entry
and summarizes the focus and the main challenge.

| Week               | Date          | Focus                                        | Challenge                                                           |
|--------------------|---------------|----------------------------------------------|---------------------------------------------------------------------|
| [1](./week_01.md)  | 21.March.2026 | Monorepo & scaffolding                       | Standing up a clean backend + frontend monorepo with shared tooling |
| [2](./week_02.md)  | 28.March.2026 | Auth UI & student onboarding                 | Designing onboarding UI/state ahead of the backend API              |
| [3](./week_03.md)  | 04.April.2026 | Backend auth & file uploads                  | Secure session auth and Multer-based file handling                  |
| [4](./week_04.md)  | 18.April.2026 | User profiles & navigation                   | Modeling distinct student vs. employer profiles cleanly             |
| [5](./week_05.md)  | 25.April.2026 | Database, notifications & profiles           | Wiring TypeORM/Postgres plus real-time WebSocket notifications      |
| [6](./week_06.md)  | 02.May.2026   | TypeScript, Material, passkeys, posts & i18n | A large multi-front migration, WebAuthn, and six locales at once    |
| [7](./week_07.md)  | 09.May.2026   | Applications, encryption & deployment        | RSA/AES payload encryption interop and the CI/CD pipeline           |
| [8](./week_08.md)  | 16.May.2026   | Profiles, follows, stories & messaging       | Consolidating profiles while adding a whole social layer            |
| [9](./week_09.md)  | 23.May.2026   | Password recovery & identity                 | Secure email-OTP recovery and a reworked registration flow          |
| [10](./week_10.md) | 06.June.2026  | Email, mobile & recruitment pipeline         | Keeping the shared-state recruitment pipeline consistent end to end |
| [11](./week_11.md) | 13.June.2026  | Matching, discovery & docs deployment        | Tuning the matching algorithm and deploying the book itself         |
