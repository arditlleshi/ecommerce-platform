import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/alert";
import { NewsletterSignupsPreview } from "@/components/newsletter-signups-preview";
import { getNewsletterSignups } from "@/lib/server/newsletter/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { InfoIcon, ServerCrashIcon } from "lucide-react";

function NewsletterSignupsUnavailable() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Recent signups</CardTitle>
        <CardDescription>
          The server-side read is wired up, but the homepage could not reach the
          API right now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <ServerCrashIcon />
          <AlertTitle>Backend unavailable</AlertTitle>
          <AlertDescription>
            Start the backend to populate this panel with live newsletter
            subscriptions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export function RecentNewsletterSignupsLoading() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Recent signups</CardTitle>
        <CardDescription>
          Loading the latest newsletter signups from the backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsletterSignupsEmpty() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Recent signups</CardTitle>
        <CardDescription>
          The connection is working, but there are no newsletter records yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <InfoIcon />
          <AlertTitle>No signups yet</AlertTitle>
          <AlertDescription>
            Submit the newsletter form to create the first record and verify the
            read path.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export async function RecentNewsletterSignups() {
  let recentSignups: Awaited<ReturnType<typeof getNewsletterSignups>> | null =
    null;

  try {
    recentSignups = await getNewsletterSignups({
      limit: 4,
      offset: 0,
    });
  } catch {
    recentSignups = null;
  }

  if (!recentSignups) {
    return <NewsletterSignupsUnavailable />;
  }

  if (recentSignups.data.length === 0) {
    return <NewsletterSignupsEmpty />;
  }

  return (
    <NewsletterSignupsPreview
      records={recentSignups.data}
      total={recentSignups.pagination.total}
    />
  );
}
