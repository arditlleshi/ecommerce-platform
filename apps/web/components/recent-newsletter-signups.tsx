import { NewsletterSignupsPreview } from "@/components/newsletter-signups-preview";
import { getNewsletterSignups } from "@/lib/server/newsletter/client";

function NewsletterSignupsUnavailable() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-5">
      <h2 className="text-sm font-semibold tracking-wide text-foreground">
        Recent signups
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        The server-side read is wired up, but the homepage could not reach the
        API right now. Start the backend to populate this panel.
      </p>
    </div>
  );
}

export function RecentNewsletterSignupsLoading() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-5">
      <h2 className="text-sm font-semibold tracking-wide text-foreground">
        Recent signups
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Loading the latest newsletter signups from the backend.
      </p>
    </div>
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
