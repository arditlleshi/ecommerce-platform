# Better Auth Backend Google Flow Design

Date: 2026-06-10
Project: ecommerce-platform
Topic: Add Better Auth with Google OAuth on the NestJS backend

## Goal

Add a production-shaped authentication foundation where:

- the Next.js app starts login and logout from the UI
- the NestJS API owns the Better Auth routes
- Google OAuth is the only social provider for now
- Better Auth persists users, sessions, accounts, and verification records in PostgreSQL
- NestJS can protect backend routes and expose the signed-in user through `/me`
- the web app can discover provider availability without receiving OAuth secrets

## Chosen Approach

Keep Better Auth inside `apps/api` and keep the browser-facing auth endpoints on the NestJS server.

This matches the requested flow:

- login begins from a Next.js button
- the browser calls a Better Auth route on the backend
- Google redirects back to the backend callback
- Better Auth creates the session and user records
- the browser returns to the frontend `/account` page

The web app does not run a second Better Auth server. It only triggers backend auth endpoints and reads authenticated user data from the backend.

## Structure

- `apps/api/src/auth/*`: Better Auth configuration, route middleware, guard, `/me` controller, request types
- `apps/api/src/database/schema/*`: Better Auth tables added to the Drizzle schema set
- `apps/web/components/auth/*`: login/logout client controls
- `apps/web/lib/server/*`: authenticated server-side user fetch helpers
- `apps/web/app/account/page.tsx`: protected account page that reads the signed-in user from NestJS

## Security Notes

- Never commit real Google OAuth client secrets. `.env.example` must only contain placeholders.
- Rotate any OAuth secret that was accidentally committed or shared.
- Better Auth is configured with `account.encryptOAuthTokens: true` so stored OAuth access and refresh tokens are encrypted before persistence.
- For production deployments with separate hosts such as `app.example.com` and `api.example.com`, set `AUTH_COOKIE_DOMAIN=.example.com` and keep both origins in `WEB_ORIGIN`/`FRONTEND_APP_URL`. For unrelated domains, place auth behind a same-site proxy instead of relying on third-party cookies.

## Request Flows

### Login

1. The user clicks the Google sign-in button in Next.js.
2. The frontend reads `/auth/status` from the backend to decide whether Google sign-in is enabled.
3. The frontend posts to the backend Better Auth social sign-in endpoint.
4. Better Auth returns the Google redirect URL.
5. The browser navigates to Google.
6. Google redirects back to the backend Better Auth callback.
7. Better Auth creates or updates the auth records and session.
8. Better Auth redirects the browser to the frontend `/account` page.

### Read user

1. The browser requests the frontend `/account` page.
2. The Next.js Server Component reads the incoming cookie header.
3. The server component forwards those cookies to the NestJS `/me` endpoint.
4. NestJS validates the Better Auth session and returns the current user payload.
5. The page renders the signed-in user data.

### Protected API route

1. A NestJS guard reads the Better Auth session from request headers.
2. If the session is valid, the guard attaches the user and session to the request.
3. Controllers can safely use `req.user`.
4. If the session is missing or invalid, NestJS returns `401`.

### Logout

1. The frontend posts to the backend Better Auth sign-out endpoint.
2. Better Auth clears the session cookie.
3. The frontend returns the user to `/`.

## Architecture Rules

- Keep auth in its own feature module.
- Use a guard for protected routes instead of manual controller checks.
- Keep Better Auth route mounting isolated from business controllers.
- Reuse the existing validated environment pattern instead of introducing a second config system.
- Keep the frontend unaware of database details and session validation logic.

## Data Model

The initial auth persistence layer includes:

- `user`
- `session`
- `account`
- `verification`

The `verification` table is included because Better Auth relies on it for auth flows beyond the user, session, and account records.

## Testing And Verification

Implementation is only complete if all of the following pass:

- API type-check, lint, unit tests, and e2e tests
- web type-check, lint, and build
- Better Auth tables are generated and migrated into PostgreSQL
- backend Better Auth health endpoint responds locally
- backend `/me` returns `401` without a session
- backend `/auth/status` reports provider availability without exposing secrets
- the frontend homepage renders the login control
- the frontend `/account` page reads from `/me` and handles unauthenticated users safely

## Out Of Scope

This phase does not add:

- role-based authorization
- admin flows
- extra application profile tables
- password or email-based authentication
