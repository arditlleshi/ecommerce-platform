import { getCurrentUser } from "@/lib/server/current-user";
import { Fraunces } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Link from "next/link";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecommerce Platform",
  description:
    "A minimal server-first storefront with calm typography, clear navigation, and an auth-aware entry point.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efe7",
};

export const dynamic = "force-dynamic";

const principles = [
  {
    value: "01",
    title: "Calm Surface",
    description:
      "Generous spacing and quiet contrast let the product voice arrive before the interface does.",
  },
  {
    value: "02",
    title: "Clear Entry",
    description:
      "The homepage keeps only the actions that matter now: sign in, continue, or read the story.",
  },
  {
    value: "03",
    title: "Fast Posture",
    description:
      "Server rendering handles the heavy work so the first impression stays light and immediate.",
  },
] as const;

export default async function Home() {
  const currentUser = await getCurrentUser();
  const primaryHref = currentUser ? "/account" : "/login";
  const primaryLabel = currentUser ? "Open Account" : "Sign In";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#f4efe7] text-zinc-950">
      <a
        href="#main-content"
        className="sr-only absolute left-6 top-4 z-20 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white focus:not-sr-only focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe7]"
      >
        Skip to main content
      </a>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(24,24,27,0.07),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-6 top-28 h-px bg-black/8 sm:inset-x-8 lg:inset-x-12"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-black/8 lg:block"
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 sm:px-8 lg:px-12">
        <Link
          href="/"
          translate="no"
          className="text-[0.72rem] uppercase tracking-[0.34em] text-zinc-600 transition-colors duration-300 hover:text-zinc-950"
        >
          Ecommerce Platform
        </Link>
        <nav aria-label="Primary navigation">
          <Link
            href={primaryHref}
            className="text-sm text-zinc-600 transition-colors duration-300 hover:text-zinc-950"
          >
            {currentUser ? "Account" : "Sign In"}
          </Link>
        </nav>
      </header>

      <main
        id="main-content"
        className="relative mx-auto flex w-full max-w-6xl flex-1 px-6 pb-12 sm:px-8 lg:px-12"
      >
        <div className="flex w-full flex-col">
          <section className="grid min-h-[calc(100dvh-7rem)] items-end gap-14 border-y border-black/10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:gap-10">
            <div className="max-w-4xl">
              <p className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 motion-reduce:animate-none text-[0.72rem] uppercase tracking-[0.34em] text-zinc-500">
                Server-first storefront
              </p>
              <h1
                className={`${fraunces.className} animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-150 motion-reduce:animate-none mt-6 text-[clamp(3.5rem,9vw,8rem)] font-light leading-[0.94] tracking-[-0.06em] [text-wrap:balance]`}
              >
                A Quieter Front Page for Modern Commerce.
              </h1>
              <p className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300 motion-reduce:animate-none mt-6 max-w-xl text-base leading-7 text-zinc-600 [text-wrap:pretty] sm:text-lg">
                Minimal by design, not by omission. The interface stays spare,
                the typography does the work, and the path into the product is
                obvious from the first second.
              </p>
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500 motion-reduce:animate-none mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm text-white transition-[transform,background-color] duration-300 hover:-translate-y-px hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe7]"
                >
                  {primaryLabel}
                </Link>
                <Link
                  href="#principles"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 bg-white/60 px-6 text-sm text-zinc-700 backdrop-blur-sm transition-[transform,background-color,border-color,color] duration-300 hover:-translate-y-px hover:border-black/20 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4efe7]"
                >
                  Read the Principles
                </Link>
              </div>
            </div>

            <aside className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700 motion-reduce:animate-none flex flex-col gap-6 lg:pb-4">
              <div className="rounded-[2rem] border border-black/10 bg-white/55 p-6 backdrop-blur-sm">
                <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">
                  Current state
                </p>
                <p className="mt-4 text-sm leading-6 text-zinc-700 [text-wrap:pretty]">
                  {currentUser ? (
                    <>
                      Signed in as{" "}
                      <span className="font-medium text-zinc-950">
                        {currentUser.user.email}
                      </span>
                      . Continue straight to your account.
                    </>
                  ) : (
                    "Authentication is available, but it waits quietly until you need it."
                  )}
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {principles.map((principle) => (
                  <li
                    key={principle.value}
                    className="rounded-[1.5rem] border border-black/10 bg-black/[0.025] p-5"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500">
                      {principle.value}
                    </p>
                    <p className="mt-3 text-sm font-medium text-zinc-950">
                      {principle.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600 [text-wrap:pretty]">
                      {principle.description}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section
            id="principles"
            aria-labelledby="principles-title"
            className="scroll-mt-10 grid gap-8 py-10 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          >
            <div className="max-w-sm">
              <p className="text-[0.72rem] uppercase tracking-[0.34em] text-zinc-500">
                Design note
              </p>
              <h2
                id="principles-title"
                className={`${fraunces.className} mt-4 text-4xl font-light leading-tight tracking-[-0.04em] [text-wrap:balance] sm:text-5xl`}
              >
                Every Element Earns Its Place.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="border-t border-black/10 pt-4"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500">
                    {principle.value}
                  </p>
                  <h3 className="mt-3 text-lg font-medium text-zinc-950">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 [text-wrap:pretty]">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-8 text-[0.68rem] uppercase tracking-[0.28em] text-zinc-500 sm:px-8 lg:px-12">
        <p>Built to feel quiet.</p>
        <p>{currentUser ? "Session active" : "Guest view"}</p>
      </footer>
    </div>
  );
}
