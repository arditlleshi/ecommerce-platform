"use client";

import { useState } from "react";
import {
  newsletterSignupResponseSchema,
  newsletterSignupSchema,
  type NewsletterSignupInput,
} from "@repo/schemas/newsletter";
import { Button } from "@repo/ui/button";

type FieldErrors = Partial<
  Record<keyof NewsletterSignupInput, string[] | undefined>
>;

const initialValues: NewsletterSignupInput = {
  name: "",
  email: "",
  interest: "storefront",
};

export function NewsletterSignupForm() {
  const [values, setValues] = useState<NewsletterSignupInput>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue<K extends keyof NewsletterSignupInput>(
    key: K,
    value: NewsletterSignupInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submitSignup() {
    setStatus(null);

    const parsed = newsletterSignupSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ??
        `${window.location.protocol}//${window.location.hostname}:4001`;

      const response = await fetch(`${apiUrl}/newsletter-signups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const body = await response.json();

      if (!response.ok) {
        setErrors((body?.errors as FieldErrors | undefined) ?? {});
        setStatus(body?.message ?? "The signup request failed.");
        return;
      }

      const parsedResponse = newsletterSignupResponseSchema.safeParse(body);
      if (!parsedResponse.success) {
        setStatus("The API responded with an unexpected payload.");
        return;
      }

      setStatus(parsedResponse.data.message);
      setValues(initialValues);
    } catch {
      setStatus("Could not reach the API. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void submitSignup();
      }}
      noValidate
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          placeholder="Ardit"
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name[0]}</p>
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
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          placeholder="ardit@example.com"
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email[0]}</p>
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
          value={values.interest}
          onChange={(event) =>
            updateValue(
              "interest",
              event.target.value as NewsletterSignupInput["interest"],
            )
          }
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <option value="storefront">Storefront updates</option>
          <option value="admin">Admin app updates</option>
          <option value="both">Both</option>
        </select>
        {errors.interest ? (
          <p className="text-sm text-destructive">{errors.interest[0]}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => {
            void submitSignup();
          }}
        >
          {isSubmitting ? "Submitting..." : "Join the list"}
        </Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </form>
  );
}
