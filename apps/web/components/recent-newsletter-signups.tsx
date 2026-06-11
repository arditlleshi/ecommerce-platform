import { NewsletterSignupsPreview } from "@/components/newsletter-signups-preview";
import { getNewsletterSignups } from "@/lib/server/newsletter/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

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
        <p className="text-sm leading-6 text-muted-foreground">
          Start the backend to populate this panel with live newsletter
          subscriptions.
        </p>
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
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          The panel is waiting for the server read to complete.
        </p>
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

  return (
    <NewsletterSignupsPreview
      records={recentSignups.data}
      total={recentSignups.pagination.total}
    />
  );
}
