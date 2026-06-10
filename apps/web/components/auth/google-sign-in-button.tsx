"use client";

import { useState, useTransition } from "react";
import { Button } from "@repo/ui/button";

type GoogleSignInButtonProps = {
  apiBaseUrl: string;
  enabled: boolean;
};

type SignInResponse = {
  redirect?: boolean;
  url?: string;
};

export function GoogleSignInButton({
  apiBaseUrl,
  enabled,
}: GoogleSignInButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const signIn = () => {
    startTransition(async () => {
      setErrorMessage(null);

      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/sign-in/social`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "google",
            callbackURL: `${window.location.origin}/account`,
            newUserCallbackURL: `${window.location.origin}/account`,
            errorCallbackURL: `${window.location.origin}/`,
          }),
        });

        const body = (await response.json()) as SignInResponse;

        if (!response.ok || !body.url) {
          throw new Error("Unable to start Google sign-in.");
        }

        window.location.assign(body.url);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to start Google sign-in.",
        );
      }
    });
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        className="w-full"
        onClick={signIn}
        disabled={!enabled || isPending}
      >
        {isPending ? "Redirecting…" : "Continue with Google"}
      </Button>
      {!enabled ? (
        <p className="text-sm text-muted-foreground">
          Google sign-in is not enabled on the authentication backend yet.
        </p>
      ) : null}
      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
