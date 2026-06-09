# Ecommerce Platform Monorepo

This project should use a single Git repository at the root.

`apps/web` contains the Next.js storefront.
`apps/api` contains the NestJS API.
`packages/ui` contains shared UI components.
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
bun run dev
bun run build
bun run lint
bun run check-types
```

By default:

- the web app runs on `http://localhost:3000`
- the API runs on `http://localhost:4001`

## Current status

This repository is now structured to behave as one Turborepo monorepo:

- the nested Git repository under `apps/api` has been removed from the working tree
- the API app now participates in root `dev` and `check-types`
- the build cache configuration includes NestJS `dist` output
