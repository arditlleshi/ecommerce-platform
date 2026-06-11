import { type NewsletterSignupRecord } from "@repo/schemas/newsletter";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

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
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">Recent signups</CardTitle>
        <CardDescription>
          This panel reads newsletter data on the server through the backend
          helper.
        </CardDescription>
        <CardAction>
          <div className="rounded-lg bg-muted/50 px-2.5 py-1 text-xs font-medium">
            {total} total
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        {records.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {records.map((record) => (
              <li
                key={record.id}
                className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 p-4 ring-1 ring-foreground/10"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">
                    {record.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {record.email}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
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
          <p className="text-sm text-muted-foreground">
            No newsletter signups have been recorded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
