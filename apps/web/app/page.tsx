import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import {
  RecentNewsletterSignups,
  RecentNewsletterSignupsLoading,
} from "@/components/recent-newsletter-signups";
import { siteConfig } from "@/lib/site";
import { getCurrentUser } from "@/lib/server/current-user";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

const highlights = [
  {
    title: "Auth-aware entry",
    description:
      "The primary action changes with the current session so the next step is always obvious.",
  },
  {
    title: "Server-first state",
    description:
      "The homepage and account page read live backend state before anything reaches the browser.",
  },
  {
    title: "Shared UI primitives",
    description:
      "Buttons and cards now follow the `radix-nova` shadcn preset instead of bespoke styling.",
  },
] as const;

export default async function Home() {
  const currentUser = await getCurrentUser();
  const primaryHref = currentUser ? "/account" : "/login";
  const primaryLabel = currentUser ? "Open account" : "Sign in";

  return (
    <main className="min-h-dvh bg-muted/20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Link href="/" translate="no" className="text-sm font-medium">
              Ecommerce Platform
            </Link>
            <p className="text-sm text-muted-foreground">
              Radix Nova preset applied with server-rendered auth and capture
              flows.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="max-w-3xl text-4xl text-balance sm:text-5xl">
                A shadcn-first storefront shell for sign in, capture, and
                account flow.
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm/6">
                The application now uses the `b0` preset language: neutral
                tokens, compact controls, shared primitives, and layout built
                around cards instead of custom hero styling.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href={primaryHref}>{primaryLabel}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#newsletter">Newsletter</Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10"
                  >
                    <p className="text-sm font-medium">{highlight.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">Current session</CardTitle>
                <CardDescription>
                  {currentUser
                    ? "The server already knows who is signed in and exposes the account route directly."
                    : "No session is present, so the entry path stays focused on sign-in."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Next route
                  </p>
                  <p className="mt-1 text-sm font-medium">{primaryHref}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {currentUser ? currentUser.user.email : "Guest"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">What is wired</CardTitle>
                <CardDescription>
                  The homepage uses server data, the form submits through Server
                  Actions, and the account page stays auth-aware.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                  <p className="text-sm font-medium">Newsletter capture</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Field-based inputs and toggle groups post directly to the
                    backend integration.
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                  <p className="text-sm font-medium">Account session</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Signed-in users can jump to the account page without a
                    separate client fetch.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="newsletter"
          className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        >
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Newsletter signup</CardTitle>
              <CardDescription>
                The form uses shadcn field composition and submits through a
                Server Action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterSignupForm />
            </CardContent>
          </Card>

          <Suspense fallback={<RecentNewsletterSignupsLoading />}>
            <RecentNewsletterSignups />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
