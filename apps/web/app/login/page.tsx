import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { getApiBaseUrl } from "@/lib/server/api";
import { getAuthStatus, getCurrentUser } from "@/lib/server/current-user";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in or create an account with Google.",
};

export default async function LoginPage() {
  const [currentUser, authStatus] = await Promise.all([
    getCurrentUser(),
    getAuthStatus(),
  ]);

  if (currentUser) {
    redirect("/account");
  }

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-muted/20 px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/">Back home</Link>
        </Button>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription className="text-sm/6">
              Use Google to continue into your account. The sign-in flow stays
              short and uses the same shared button primitive as the rest of the
              app.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <GoogleSignInButton
              apiBaseUrl={getApiBaseUrl()}
              enabled={authStatus.providers.google.enabled}
            />
          </CardContent>

          <CardFooter>
            <p className="text-sm leading-6 text-muted-foreground">
              One provider handles both sign-in and sign-up, so there is no
              separate onboarding branch to maintain.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
