'use client';

import { useState, useTransition } from 'react';
import { Button } from '@repo/ui/button';

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
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Unable to sign out.');
        }

        window.location.assign('/');
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to sign out.',
        );
      }
    });
  };

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" onClick={signOut} disabled={isPending}>
        {isPending ? 'Signing out…' : 'Sign out'}
      </Button>
      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
