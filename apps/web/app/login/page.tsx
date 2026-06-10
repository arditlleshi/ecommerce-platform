import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { getApiBaseUrl } from "@/lib/server/api";
import { getAuthStatus, getCurrentUser } from "@/lib/server/current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Ecommerce Platform",
  description: "Sign in or create an account with Google.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const [currentUser, authStatus] = await Promise.all([
    getCurrentUser(),
    getAuthStatus(),
  ]);

  if (currentUser) {
    redirect("/account");
  }

  return (
    <main className="relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--muted),transparent_32rem)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-6 h-px bg-border/70"
      />
      <Card className="relative w-full max-w-md overflow-hidden border-border/80 shadow-2xl shadow-foreground/5">
        <CardHeader className="gap-5 border-b border-border/60 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-sm font-semibold tracking-tight text-foreground"
            >
              EP
            </div>
            <p
              className="text-sm font-medium text-muted-foreground"
              translate="no"
            >
              Ecommerce Platform
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CardTitle asChild className="text-3xl text-balance sm:text-4xl">
              <h1>Welcome Back</h1>
            </CardTitle>
            <CardDescription className="text-base leading-7 text-pretty">
              Sign in or create your account with Google. It is the only login
              method for this application.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 p-6 sm:p-8">
          <GoogleSignInButton
            apiBaseUrl={getApiBaseUrl()}
            enabled={authStatus.providers.google.enabled}
          />
        </CardContent>
        <CardFooter className="border-t border-border/60 bg-muted/40 p-6 sm:p-8">
          <p className="text-sm leading-6 text-muted-foreground">
            Your Google account is used to log in and sign up, so there are no
            passwords to manage here.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
