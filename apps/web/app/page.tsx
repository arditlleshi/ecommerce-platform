import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import {
  RecentNewsletterSignups,
  RecentNewsletterSignupsLoading,
} from "@/components/recent-newsletter-signups";
import { getApiBaseUrl } from "@/lib/server/api";
import { getAuthStatus, getCurrentUser } from "@/lib/server/current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Storefront Newsletter Boundary",
  description:
    "A Next.js server-first storefront flow that reads and writes newsletter data through the Nest backend.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [currentUser, authStatus] = await Promise.all([
    getCurrentUser(),
    getAuthStatus(),
  ]);
  const apiBaseUrl = getApiBaseUrl();
  const isGoogleAuthEnabled = authStatus.providers.google.enabled;

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <Card className="w-full max-w-3xl">
        <CardHeader className="gap-6 border-b border-border/60">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="space-y-3">
            <CardTitle className="text-3xl sm:text-4xl">
              The storefront now talks to the backend through a server-first
              boundary.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              The storefront consumes reusable components from{" "}
              <Code>@repo/ui</Code>, while the app router keeps reads on the
              server and mutations inside typed server actions.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background p-5">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Frontend ownership
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Shared primitives live in <Code>packages/ui</Code>. App-specific
              page composition and backend orchestration stay in{" "}
              <Code>apps/web</Code>.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background p-5">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Request boundary
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Client components no longer construct backend URLs. Next.js owns
              the transport layer and calls Nest from the server.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background p-5">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Auth boundary
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Better Auth now lives on the Nest backend. The frontend starts
              sign-in and sign-out, and the account page reads the signed-in
              user through <Code>/me</Code>.
            </p>
          </div>
        </CardContent>
        <CardContent className="border-t border-border/60 pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Google sign-in
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Login starts from this page, the backend owns the OAuth
                callback, and the browser returns to <Code>/account</Code> after
                Better Auth creates the session.
              </p>
              {currentUser ? (
                <p className="text-sm leading-6 text-foreground">
                  Signed in as{" "}
                  <span className="font-medium">{currentUser.user.email}</span>.
                </p>
              ) : null}
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-5">
              {currentUser ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Your session is already active. Visit <Code>/account</Code> to
                  see the protected server-rendered page.
                </p>
              ) : (
                <GoogleSignInButton
                  apiBaseUrl={apiBaseUrl}
                  enabled={isGoogleAuthEnabled}
                />
              )}
            </div>
          </div>
        </CardContent>
        <CardContent className="border-t border-border/60 pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Typed signup flow
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                The same schema validates this form in the browser, in the Next
                server action, and in the Nest API. The UI keeps instant
                feedback without owning the backend request.
              </p>
            </div>
            <NewsletterSignupForm />
          </div>
        </CardContent>
        <CardContent className="border-t border-border/60 pt-6">
          <Suspense fallback={<RecentNewsletterSignupsLoading />}>
            <RecentNewsletterSignups />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
