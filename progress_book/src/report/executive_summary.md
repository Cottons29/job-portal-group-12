# 1. Executive Summary

The **Student Part-Time Job Portal** is a full-stack web platform that connects
students seeking part-time work with employers who want to hire them. Beyond a
simple job board, it blends a recruitment workflow with a lightweight social
layer — profiles, follows, posts, stories, and direct messaging — so that
discovery, application, and communication all happen in one place.

The system is delivered as a workspace-based monorepo with three runtime pieces:
a **NestJS** API backed by **PostgreSQL** (via TypeORM), a **Vue 3 + Vite**
single-page application written in TypeScript, and a standalone **Rust file
service** ("Sheep") for media uploads. Security is a first-class concern, with
session-based and **passkey (WebAuthn)** authentication, encrypted auth payloads,
and email-OTP account recovery. Everything — including this documentation book —
is built and deployed through a **GitHub Actions** CI/CD pipeline to GHCR.

Over eleven development weeks, the team shipped authentication, unified
student/employer profiles, job posting and discovery, a skill-matching
recommendation engine, a recruitment pipeline with applicant tracking, and a
real-time notification and messaging system, all fully internationalized across
six locales.

This report documents the project end to end: the problem it solves, its
requirements, the architecture and technology choices behind it, how the core
features were implemented, how the team worked, and what remains for the future.
