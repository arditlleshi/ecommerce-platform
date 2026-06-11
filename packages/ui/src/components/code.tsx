import { type JSX } from "react";

import { cn } from "#lib/utils";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <code
      className={cn(
        "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className,
      )}
    >
      {children}
    </code>
  );
}
