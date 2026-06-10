# Next.js Server-First API Architecture Design

Date: 2026-06-10
App: `apps/web`
Related backend: `apps/api`

## Goal

Introduce a modern, scalable, and professional frontend architecture for calling backend endpoints from the Next.js App Router application.

The architecture should:

- keep backend connectivity on the server by default
- use Server Components for reads
- use Server Actions for UI-triggered mutations
- remove backend URL construction from client components
- centralize response parsing and error normalization
- scale cleanly as more backend-backed features are added

## Current State

The storefront currently uses a client component, `components/newsletter-signup-form.tsx`, that:

- manages local form state
- validates input in the browser with shared Zod schemas
- builds the backend URL in the browser using `NEXT_PUBLIC_API_URL` or a localhost fallback
- calls the Nest API directly with `fetch`
- parses the backend response inside the component

This works for a single form, but it creates weak long-term boundaries:

- client components know backend location details
- transport logic and UI logic are mixed together
- future read endpoints would likely repeat ad hoc fetch logic
- backend failure handling is not centralized
- the app is not taking full advantage of App Router server-first patterns

## Recommended Approach

Adopt a server-first frontend boundary inside `apps/web`.

### Principles

- Reads from backend endpoints should happen in Server Components through server-only helpers.
- Writes triggered by the web UI should go through Server Actions.
- Client components should own interaction and display state, not backend networking.
- Shared contracts from `@repo/schemas` should continue to validate requests and responses.
- Backend URL resolution should be server-only and centralized.

## Target Architecture

### 1. Server-only configuration

Create a server-only environment module for the web app.

Suggested file:

- `apps/web/lib/server/env.ts`

Responsibilities:

- read the backend base URL from a server-only variable such as `API_URL`
- provide a single explicit local-development fallback of `http://localhost:4001`
- fail clearly when configuration is missing or invalid

This removes the need for `NEXT_PUBLIC_API_URL` in UI components.

### 2. Shared server API client

Create a small server-only API client layer.

Suggested file:

- `apps/web/lib/server/api-client.ts`

Responsibilities:

- build full backend URLs
- perform `fetch` requests
- set standard headers
- decode JSON safely
- normalize HTTP failures
- keep transport details out of feature code

This should stay intentionally small and explicit, not become a generic abstraction framework.

### 3. Feature-level backend clients

Create feature-specific server helpers on top of the shared API client.

Suggested files:

- `apps/web/lib/server/newsletter/client.ts`

Responsibilities:

- submit newsletter signup payloads
- fetch newsletter signup lists
- parse responses with the shared schema package
- return plain UI-safe values

This creates a stable place for newsletter-specific backend interaction and scales well when additional backend-backed features are added later.

### 4. Server Actions for mutations

Use a Server Action for newsletter signup submission.

Suggested file:

- `apps/web/app/actions/newsletter.ts`

Responsibilities:

- validate incoming form data on the server
- call the newsletter feature client
- normalize success and error results into a simple UI contract

The Server Action should return a small serializable result such as:

- `success`
- `message`
- `fieldErrors`

This keeps the client component decoupled from backend transport and backend error shapes.

### 5. Server Components for reads

Any future page that needs to read backend data, including newsletter signups, should fetch in a Server Component by calling the feature client directly.

This avoids client waterfalls and aligns with App Router best practices.

## Request Flows

### Newsletter signup flow

1. User submits the form in a client component.
2. The client component invokes a Server Action.
3. The Server Action validates the payload on the server.
4. The Server Action calls the newsletter feature client.
5. The feature client calls the Nest endpoint through the shared API client.
6. The response is parsed and normalized.
7. The Server Action returns a small UI result to the client component.
8. The client component updates visual state only.

### Newsletter reads flow

1. A Server Component requests newsletter data.
2. It calls the newsletter feature client directly.
3. The feature client uses the shared API client.
4. Parsed plain data is returned to the Server Component.
5. The Server Component renders the result directly or passes only serialized plain data to client children.

## Validation Strategy

Validation should happen at two levels:

- client-side validation for immediate user feedback
- server-side validation in the Server Action as the real trust boundary

The backend should continue validating independently as well.

This gives:

- fast UX
- secure server-side enforcement
- consistent contracts across frontend and backend

## Error Handling Strategy

Normalize backend and transport failures before they reach UI components.

The UI should not deal directly with:

- raw backend response shapes
- backend URL details
- low-level transport exceptions

Instead, the frontend should operate on a normalized result contract such as:

- success state
- field-level validation messages
- general fallback error message

This keeps UI code focused and makes backend response changes easier to absorb later.

## File Structure

Suggested initial structure:

```text
apps/web/
  app/
    actions/
      newsletter.ts
  components/
    newsletter-signup-form.tsx
  lib/
    server/
      env.ts
      api-client.ts
      newsletter/
        client.ts
```

Optional expansion later:

```text
apps/web/lib/server/newsletter/
  client.ts
  mappers.ts
  errors.ts
```

Only add those extra files if newsletter behavior grows enough to justify them.

## Implementation Scope

Initial implementation should include:

- server-only backend URL configuration for the web app
- shared server API client
- newsletter feature client
- newsletter signup Server Action
- refactor of the existing signup form to use the Server Action instead of direct browser fetch
- one server-side read integration for the new newsletter read endpoint on the current homepage
- type-safe response parsing and normalized UI results

## Out of Scope

The first implementation should not add:

- a client-side data fetching library
- frontend route handlers unless an external frontend API is needed
- authentication or authorization layers
- speculative abstractions for unbuilt features

## Testing And Verification

Implementation should be verified with:

- TypeScript checks for `apps/web`
- lint for `apps/web`
- a real local run of the Next app and API together
- manual submission of the newsletter form through the browser
- confirmation that the form still shows validation and success/error messages correctly
- confirmation that server-side reads work without exposing backend URL logic to the client

## Why This Approach

This design matches modern Next.js App Router guidance:

- Server Components are preferred for reads.
- Server Actions are preferred for UI-triggered mutations.
- Client components should stay focused on interaction.

It also gives the project a professional growth path:

- one clear pattern for future backend features
- fewer duplicated fetch utilities
- better control over caching and rendering boundaries
- less fragile client-side networking code
