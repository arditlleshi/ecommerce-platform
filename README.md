# Ecommerce Platform Monorepo

This project should use a single Git repository at the root.

`apps/web` contains the Next.js storefront.
`apps/api` contains the NestJS API.
`packages/ui` contains shared UI components.
`packages/schemas` contains shared request and response validation.
`packages/eslint-config` and `packages/typescript-config` contain shared tooling config.

## How the repo is meant to work

This is a Turborepo monorepo, so the normal setup is:

- one root Git repository
- one root lockfile
- one shared workspace install
- multiple apps and packages inside that single repository

If any app inside `apps/` or `packages/` has its own `.git` directory, it stops behaving like part of the monorepo and starts behaving like a separate repository. That breaks normal root-level tracking and makes collaboration harder.

## Common commands

Run these from the repository root:

```sh
copy .env.example .env
docker compose up -d postgres
bun run db:migrate
bun run dev
bun run build
bun run lint
bun run check-types
```

If `5432` is already in use on a machine, change both `POSTGRES_PORT` and
`DATABASE_URL` in `.env` to the same alternate port before starting Docker.

By default:

- the web app runs on `http://localhost:3000`
- the API runs on `http://localhost:4001`
- PostgreSQL runs on `localhost:5432`

## Current status

This repository is now structured to behave as one Turborepo monorepo:

- the nested Git repository under `apps/api` has been removed from the working tree
- the API app now participates in root `dev` and `check-types`
- the build cache configuration includes NestJS `dist` output
- the API owns the Drizzle and PostgreSQL runtime, while the frontend stays database-agnostic
