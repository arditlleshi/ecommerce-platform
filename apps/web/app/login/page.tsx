import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { getApiBaseUrl } from "@/lib/server/api";
import { getAuthStatus, getCurrentUser } from "@/lib/server/current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Fraunces } from "next/font/google";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Login | Ecommerce Platform",
  description: "Sign in or create an account with Google.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const [currentUser, authStatus] = await Promise.all([
    getCurrentUser(),
    getAuthStatus(),
  ]);

  if (currentUser) {
    redirect("/account");
  }

  return (
    <main className="relative isolate flex min-h-[100dvh] flex-1 items-center justify-center overflow-hidden bg-[#f4efe7] px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(24,24,27,0.07),transparent_28%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-8 h-px bg-black/8"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-black/8 lg:block"
      />

      <Card className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-black/10 bg-white/72 shadow-[0_1px_0_rgba(24,24,27,0.05),0_28px_80px_rgba(24,24,27,0.08)] backdrop-blur-sm">
        <CardHeader className="gap-6 border-b border-black/8 p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-2xl border border-black/8 bg-white/80 text-sm font-semibold tracking-tight text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
            >
              EP
            </div>
            <div className="space-y-1">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500">
                Secure Entry
              </p>
              <p className="text-sm text-zinc-600" translate="no">
                Ecommerce Platform
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <CardTitle
              asChild
              className={`${fraunces.className} text-[2.7rem] leading-none font-light tracking-[-0.05em] [text-wrap:balance] sm:text-[3.35rem]`}
            >
              <h1>Welcome Back</h1>
            </CardTitle>
            <CardDescription className="max-w-sm text-base leading-7 text-zinc-600 [text-wrap:pretty]">
              Sign in or create your account with Google. One clean login
              method, no passwords to remember.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-7 sm:p-9">
          <GoogleSignInButton
            apiBaseUrl={getApiBaseUrl()}
            enabled={authStatus.providers.google.enabled}
          />
          <p className="text-sm leading-6 text-zinc-500">
            You will finish authentication with Google, then return here with
            your session ready.
          </p>
        </CardContent>

        <CardFooter className="border-t border-black/8 bg-black/[0.02] p-7 sm:p-9">
          <p className="text-sm leading-6 text-zinc-600">
            Your Google account handles both sign-in and sign-up, so account
            access stays simple.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
