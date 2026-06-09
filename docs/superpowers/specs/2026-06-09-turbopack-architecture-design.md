# Turbopack Architecture Design

Date: 2026-06-09
Project: ecommerce-platform
Topic: Turbopack architecture and monorepo structure optimization

## Goal

Make the Next.js app and shared packages follow strong Turbopack and Turborepo practices so the repository is ready for a future second frontend application such as an admin app.

## Scope

This work covers:

- tightening the monorepo boundaries between apps and shared packages
- converting `packages/ui` into the real shared UI package
- reducing unnecessary client-side boundaries in shared components
- making the Next.js app consume shared UI through package entry points
- improving package metadata for tree shaking and monorepo bundling
- adding lightweight Next.js configuration guardrails that are appropriate for Turbopack
- verifying build, lint, type-check, and dev startup behavior after the changes

This work does not cover:

- redesigning the storefront experience
- adding the admin app now
- introducing a new data layer, auth layer, or API client package unless required for the structure cleanup

## Chosen Approach

Adopt `packages/ui` as the shared library now instead of keeping UI local to `apps/web`.

This is the recommended choice because:

- a future admin app is already expected
- Turborepo works best when shared code lives in internal library packages and apps stay as deployment endpoints
- moving to shared UI later would create unnecessary migration churn
- Turbopack benefits from clear package boundaries and predictable client/server entry points

## Target Structure

- `apps/web`: storefront-specific pages, layouts, route composition, copy, and app-local utilities
- `packages/ui`: reusable presentation components and component utilities that can be shared by storefront and admin apps
- `packages/eslint-config`: shared lint config only
- `packages/typescript-config`: shared TypeScript config only

Rules:

- apps are the end of the package graph
- shared packages must not depend on app code
- shared UI must expose explicit public entry points instead of broad wildcard exports
- app-specific composition stays in the app, not in `packages/ui`

## Package Strategy

`packages/ui` will stay a Just-in-Time internal package for now.

That means:

- the package exports source files directly
- the app bundler compiles the package
- the package does not need its own build step yet

This is the best fit at the current size because it keeps configuration small while still matching Turbopack-friendly monorepo patterns.

## UI Package Changes

Planned changes to `packages/ui`:

- replace the wildcard export pattern with explicit entry points such as `./button`, `./card`, and `./code`
- add `sideEffects: false` so unused exports can be removed more aggressively
- remove demo behavior from shared components
- avoid unnecessary `"use client"` markers in shared components
- keep components generic enough to be reused by `apps/web` and a future `apps/admin`

Shared components should only be client components when they truly require browser-only behavior such as event handlers tied to client state, effects, or browser APIs.

## Web App Changes

Planned changes to `apps/web`:

- install and use `@repo/ui` directly
- replace local copies of components that belong in the shared package
- keep app-specific composition and route content in `apps/web`
- keep layout and route files server-first unless interactivity is required

## Next.js and Turbopack Config

Planned changes to `apps/web/next.config.ts`:

- add `transpilePackages: ["@repo/ui"]` so local package consumption is explicit and stable in the monorepo
- enable the built-in experimental bundle analyzer so bundle growth can be inspected when needed
- avoid webpack-specific configuration
- only add Turbopack-specific config if the repo actually needs it

No fallback to webpack is planned.

## Client and Server Boundaries

Rules for this repo after the cleanup:

- keep `app/page.tsx` and `app/layout.tsx` as server components by default
- isolate interactive behavior into the smallest client entry points possible
- do not mark shared packages as client-only unless required
- if a server-only helper is introduced later, mark it explicitly to prevent client imports

## Verification Plan

The implementation is complete only if all of the following pass:

- `bun install`
- `bun run build` from the repo root
- `bun run lint` from the repo root
- `bun run check-types` from the repo root
- API unit and e2e tests still pass
- root `bun run dev` starts both the web app and the API successfully
- the web app loads in the browser

## Risks and Mitigations

- Risk: moving components into `packages/ui` can break imports
  Mitigation: switch imports incrementally and run full workspace checks

- Risk: marking code as shared too early can create awkward APIs
  Mitigation: only move generic building blocks, keep route composition inside the app

- Risk: excessive client boundaries can increase browser bundle size
  Mitigation: keep shared UI server-compatible unless interactivity is actually required

- Risk: tree-shaking metadata can be wrong if a package has side effects
  Mitigation: only declare `sideEffects: false` because the package contains plain component modules with no import-time behavior

## Success Criteria

The repo will be considered aligned with the intended Turbopack architecture when:

- `packages/ui` is a real shared package with explicit exports
- `apps/web` consumes shared UI from `@repo/ui`
- unnecessary client-only boundaries are removed
- the Next app remains on Turbopack with no webpack-era configuration
- the workspace passes build, lint, type-check, and runtime verification
