import Image from "next/image";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <Card className="w-full max-w-3xl">
        <CardHeader className="gap-6 border-b border-border/60">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="space-y-3">
            <CardTitle className="text-3xl sm:text-4xl">
              Shared UI is now packaged for Turbopack.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              The storefront consumes reusable components from <Code>@repo/ui</Code>,
              while the app router stays server-first and ready for a future admin
              frontend.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background p-5">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Monorepo boundary
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Shared primitives live in <Code>packages/ui</Code>. App-specific page
              composition stays in <Code>apps/web</Code>.
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background p-5">
            <h2 className="text-sm font-semibold tracking-wide text-foreground">
              Turbopack posture
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Next.js transpiles the shared package explicitly, and the UI package is
              marked side-effect free for cleaner tree shaking.
            </p>
          </div>
        </CardContent>
        <CardContent className="border-t border-border/60 pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Shared Zod validation
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                The same schema validates this form in the browser and the signup
                payload in the Nest API. That keeps storefront and future admin flows
                aligned without duplicating rules.
              </p>
            </div>
            <NewsletterSignupForm />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <Button asChild className="sm:w-auto">
            <a
              href="https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages"
              target="_blank"
              rel="noopener noreferrer"
            >
              Review transpilePackages
            </a>
          </Button>
          <Button asChild variant="outline" className="sm:w-auto">
            <a
              href="https://nextjs.org/docs/architecture/turbopack"
              target="_blank"
              rel="noopener noreferrer"
            >
              Turbopack docs
            </a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
