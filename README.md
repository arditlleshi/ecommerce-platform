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
bun run test:e2e
bun run boundaries
bun run check
bun run build
bun run lint
bun run check-types
```

`bun run dev` starts the web app, the API, and the shared schema watcher as one
Turbo-managed development graph. If you only need the storefront, run
`bunx turbo run dev --filter=web` and Turbo will bring up the API dependency
chain for that app as well.

If `5432` is already in use on a machine, change both `POSTGRES_PORT` and
`DATABASE_URL` in `.env` to the same alternate port before starting Docker.

By default:

- the web app runs on `http://localhost:3000`
- the API runs on `http://localhost:4001`
- PostgreSQL runs on `localhost:5432`

## Current status

This repository is now structured to behave as one Turborepo monorepo:

- the nested Git repository under `apps/api` has been removed from the working tree
- the root pipeline caches build outputs per package and tracks the shared environment inputs from the repository root
- package boundaries are enforced so apps can depend on shared packages and config packages without reaching into one another
- the web app uses the shared TypeScript and ESLint packages instead of carrying its own duplicate setup
- the development flow starts the shared schema watcher alongside the application servers
- the API owns the Drizzle and PostgreSQL runtime, while the frontend stays database-agnostic

## CI

GitHub Actions runs Turbo in affected mode with a full git history checkout, so
pull requests only re-run the packages touched by the change plus anything that
depends on them.
