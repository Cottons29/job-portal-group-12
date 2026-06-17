# Introduction

Welcome to the progress book for the **Student Part-Time Job Portal** — a
full-stack web platform that connects students looking for part-time work with
employers who want to hire them.

## About the project

The portal is built as a workspace-based monorepo with two main applications:

- **Backend** — a [NestJS](https://nestjs.com/) API backed by PostgreSQL (via
  TypeORM), providing authentication, user/profile management, job posts and
  applications, real-time notifications, messaging, and a recruitment pipeline.
- **Frontend** — a [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
  single-page application written in TypeScript, styled with a Material Design 3
  token system and fully internationalized across six locales.

Supporting pieces include a standalone file service for media uploads, payload
encryption for sensitive auth traffic, passkey (WebAuthn) login, and a CI/CD
pipeline that builds and deploys everything — including this book — through GitHub
Actions and GHCR.

## Key features

- Session-based and passkey (WebAuthn) authentication with encrypted payloads.
- Role-aware student and employer profiles unified in a single profile module.
- Job posting, search, discovery filtering, applications, and a skill-matching
  recommendation engine.
- A recruitment pipeline: applicant tracking, offer responses, and interview
  stages, with email and real-time notifications.
- A social layer: posts with likes/comments/shares, follows, stories, and direct
  messaging.

## About this book

This book documents the project's development **week by week**, rebuilt from the
git commit history. Each entry is titled `Week N - dd.month.yyyy` and covers what
was built that week, the outcome, and the **main challenge** the team worked
through. Use the [Table of Contents](./table_of_contents.md) for a high-level map,
or jump straight into the weekly entries from the sidebar.
