"use client";

import {
  useActionState,
  useEffect,
  useRef,
} from "react";
import { Button } from "@repo/ui/button";
import {
  submitNewsletterSignup,
} from "@/app/actions/newsletter";
import {
  initialNewsletterSignupActionState,
  type NewsletterSignupActionState,
} from "@/app/actions/newsletter-state";

export function NewsletterSignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [actionState, formAction, isPending] = useActionState(
    submitNewsletterSignup,
    initialNewsletterSignupActionState,
  );
  const currentActionState: NewsletterSignupActionState = {
    ...initialNewsletterSignupActionState,
    ...actionState,
    fieldErrors: actionState?.fieldErrors ?? {},
  };

  useEffect(() => {
    if (currentActionState.status === "success") {
      formRef.current?.reset();
    }
  }, [currentActionState.status]);

  return (
    <form ref={formRef} className="grid gap-4" action={formAction}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          placeholder="Ardit"
          minLength={2}
          maxLength={80}
          required
        />
        {currentActionState.fieldErrors.name?.[0] ? (
          <p className="text-sm text-destructive">
            {currentActionState.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          placeholder="ardit@example.com"
          required
        />
        {currentActionState.fieldErrors.email?.[0] ? (
          <p className="text-sm text-destructive">
            {currentActionState.fieldErrors.email[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="interest"
        >
          Interest
        </label>
        <select
          id="interest"
          name="interest"
          defaultValue="storefront"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <option value="storefront">Storefront updates</option>
          <option value="admin">Admin app updates</option>
          <option value="both">Both</option>
        </select>
        {currentActionState.fieldErrors.interest?.[0] ? (
          <p className="text-sm text-destructive">
            {currentActionState.fieldErrors.interest[0]}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Join the list"}
        </Button>
        {currentActionState.message ? (
          <p
            aria-live="polite"
            className={
              currentActionState.status === "success"
                ? "text-sm text-foreground"
                : "text-sm text-muted-foreground"
            }
          >
            {currentActionState.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
