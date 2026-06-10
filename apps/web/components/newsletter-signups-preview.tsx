import { type NewsletterSignupRecord } from "@repo/schemas/newsletter";

type NewsletterSignupsPreviewProps = {
  records: NewsletterSignupRecord[];
  total: number;
};

const createdAtFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatInterestLabel(interest: NewsletterSignupRecord["interest"]) {
  switch (interest) {
    case "admin":
      return "Admin";
    case "both":
      return "Both";
    case "storefront":
      return "Storefront";
  }
}

export function NewsletterSignupsPreview({
  records,
  total,
}: NewsletterSignupsPreviewProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-foreground">
            Recent signups
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            The homepage reads this data on the server through a small
            server-only backend helper.
          </p>
        </div>
        <div className="rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-medium text-foreground">
          {total} total
        </div>
      </div>

      {records.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {records.map((record) => (
            <li
              key={record.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card px-4 py-3"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {record.name}
                </p>
                <p className="text-sm text-muted-foreground">{record.email}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {formatInterestLabel(record.interest)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {createdAtFormatter.format(new Date(record.createdAt))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          No newsletter signups have been recorded yet.
        </p>
      )}
    </div>
  );
}
