import { SignOutButton } from '@/components/auth/sign-out-button';
import { getCurrentUser } from '@/lib/server/current-user';
import { getApiBaseUrl } from '@/lib/server/api';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-3 border-b border-border/60">
          <CardTitle className="text-3xl">Account</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            This page is rendered on the server by calling the NestJS `/me`
            endpoint with the current request cookies.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </dt>
              <dd className="mt-2 text-sm font-medium text-foreground">
                {currentUser.user.name}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-2 text-sm font-medium text-foreground">
                {currentUser.user.email}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Verified
              </dt>
              <dd className="mt-2 text-sm font-medium text-foreground">
                {currentUser.user.emailVerified ? 'Yes' : 'No'}
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Session expires
              </dt>
              <dd className="mt-2 text-sm font-medium text-foreground">
                {new Date(currentUser.session.expiresAt).toLocaleString()}
              </dd>
            </div>
          </dl>
          <SignOutButton apiBaseUrl={getApiBaseUrl()} />
        </CardContent>
      </Card>
    </main>
  );
}
