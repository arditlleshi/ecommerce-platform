# API App

This app owns the server-side runtime for:

- the NestJS API
- the Drizzle schema and SQL migrations
- the PostgreSQL connection pool

Frontend apps do not connect to the database directly.

## Local setup

From the repository root:

```sh
copy .env.example .env
docker compose up -d postgres
bun run db:migrate
bun run dev
```

If `5432` is already in use locally, update both `POSTGRES_PORT` and
`DATABASE_URL` in `.env` to the same alternate port.

## Useful commands

Run these from the repository root:

```sh
bun run db:up
bun run db:migrate
bun run db:studio
bun run db:logs
```

Run these from the API app when needed:

```sh
bun run test
bun run test:e2e
```

## Database workflow

- edit the schema under `src/database/schema`
- generate a migration with `bun run db:generate`
- apply it with `bun run db:migrate`
- keep generated migration files checked into Git so both development machines stay aligned
