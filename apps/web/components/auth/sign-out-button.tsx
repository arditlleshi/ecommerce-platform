"use client";

import { Button } from "@repo/ui/components/button";
import { useState, useTransition } from "react";

type SignOutButtonProps = {
  apiBaseUrl: string;
};

export function SignOutButton({ apiBaseUrl }: SignOutButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const signOut = () => {
    startTransition(async () => {
      setErrorMessage(null);

      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/sign-out`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to sign out.");
        }

        window.location.assign("/");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to sign out.",
        );
      }
    });
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Sign out</p>
        <p className="text-sm text-muted-foreground">
          End the current browser session and return to the homepage.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:items-end">
        <Button
          type="button"
          variant="outline"
          onClick={signOut}
          disabled={isPending}
        >
          {isPending ? "Signing out..." : "Sign out"}
        </Button>
        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
