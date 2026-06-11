import { SignOutButton } from "@/components/auth/sign-out-button";
import { getApiBaseUrl } from "@/lib/server/api";
import { getCurrentUser } from "@/lib/server/current-user";
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
  title: "Account",
  description: "Review your current session and manage sign-out.",
};

const sessionDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AccountPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main className="min-h-dvh bg-muted/20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Account</p>
            <p className="text-sm text-muted-foreground">
              Session details are rendered on the server before the page is
              returned.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </header>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">Session overview</CardTitle>
            <CardDescription className="text-sm/6">
              This view calls the NestJS `/me` endpoint with the current request
              cookies and renders the result directly in the App Router.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Name
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {currentUser.user.name}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {currentUser.user.email}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Verified
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {currentUser.user.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Session expires
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {sessionDateFormatter.format(
                    new Date(currentUser.session.expiresAt),
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <SignOutButton apiBaseUrl={getApiBaseUrl()} />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
