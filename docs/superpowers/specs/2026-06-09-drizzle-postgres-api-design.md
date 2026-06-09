# Drizzle and PostgreSQL API Design

Date: 2026-06-09
Project: ecommerce-platform
Topic: Add Drizzle ORM and PostgreSQL with API-owned runtime boundaries

## Goal

Add a durable PostgreSQL-backed persistence layer to the Nest API using Drizzle ORM, while keeping the database runtime private to `apps/api` and preserving a clean Turborepo and Turbopack architecture.

## Chosen Approach

Keep all database runtime code inside `apps/api` and expose no direct database access to frontend apps.

This is the recommended shape because:

- the user explicitly wants the database layer designed primarily for `apps/api`
- the web app should keep talking to the API instead of coupling itself to database concerns
- a future admin frontend can reuse the API instead of creating a second source of truth
- Turbopack and the monorepo both benefit when server-only infrastructure stays in the server app

## Structure

- root `docker-compose.yml`: local PostgreSQL for both development machines
- root `.env.example`: shared local defaults and connection string template
- `apps/api/src/config/env.ts`: environment loading and validation
- `apps/api/src/database/*`: connection module, service, and schema definitions
- `apps/api/drizzle/*`: checked-in SQL migrations generated from the schema
- `apps/api/src/newsletter/*`: repository logic for newsletter persistence

## Database Rules

- PostgreSQL is started locally with Docker
- the API connects through `DATABASE_URL`
- the API uses a pooled PostgreSQL connection
- Drizzle migrations are checked into the repository
- schema changes are generated and applied through scripts, not silently at app startup

## First Persisted Feature

Replace the in-memory newsletter signup flow with PostgreSQL persistence.

The newsletter table will:

- store one row per email address
- update the existing row on repeated signups for the same email
- keep created and updated timestamps
- enforce the allowed interest values at the database level

## Testing and Verification

The implementation is complete only if all of the following pass:

- root build, lint, and type-check
- API unit and e2e tests
- Docker PostgreSQL starts successfully
- Drizzle migration generation and migration application succeed
- root dev mode starts successfully
- the newsletter form still validates on the client and now persists successfully through the API into PostgreSQL

## Risks and Mitigations

- Risk: tests become fragile if they require a live database
  Mitigation: keep automated tests isolated with mocked database providers and verify the real database flow separately

- Risk: environment loading differs between root and app execution
  Mitigation: load `.env` from both the API directory and the workspace root

- Risk: future hosted PostgreSQL needs different SSL behavior
  Mitigation: add an explicit `DATABASE_SSL` toggle instead of assuming only local non-SSL connections

- Risk: schema drift across two development machines
  Mitigation: check in Drizzle migrations and keep Docker Postgres consistent on both machines
