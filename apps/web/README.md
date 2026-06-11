# Web App

This package contains the Next.js storefront for the monorepo.

## Local development

From the repository root:

```bash
copy .env.example .env
bun run dev
```

If you only want the storefront slice, run:

```bash
bunx turbo run dev --filter=web
```

Turbo will also start the API and shared schema watcher that the storefront
depends on.

The storefront is available at [http://localhost:3000](http://localhost:3000).

## Useful commands

Run these from the repository root:

```bash
bun run build
bun run lint
bun run check-types
```

## Shared packages

- `@repo/ui` provides the shared UI components consumed by the storefront
- `@repo/schemas` provides the shared request and response validation used by both apps

The web app intentionally consumes those packages through the workspace instead
of duplicating that code locally.
