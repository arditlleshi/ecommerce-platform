"use client";

import {
  initialNewsletterSignupActionState,
  type NewsletterSignupActionState,
} from "@/app/actions/newsletter-state";
import { submitNewsletterSignup } from "@/app/actions/newsletter";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { Button } from "@repo/ui/components/button";
import { useActionState, useEffect, useRef, useState } from "react";

type Interest = "storefront" | "admin" | "both";

export function NewsletterSignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [interest, setInterest] = useState<Interest>("storefront");
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
    <form ref={formRef} className="flex flex-col gap-5" action={formAction}>
      <FieldGroup>
        <Field data-invalid={Boolean(currentActionState.fieldErrors.name?.[0])}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ardit"
            minLength={2}
            maxLength={80}
            required
            aria-invalid={Boolean(currentActionState.fieldErrors.name?.[0])}
          />
          <FieldError>{currentActionState.fieldErrors.name?.[0]}</FieldError>
        </Field>

        <Field
          data-invalid={Boolean(currentActionState.fieldErrors.email?.[0])}
        >
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ardit@example.com"
            required
            aria-invalid={Boolean(currentActionState.fieldErrors.email?.[0])}
          />
          <FieldDescription>
            We will only use this address for release and product updates.
          </FieldDescription>
          <FieldError>{currentActionState.fieldErrors.email?.[0]}</FieldError>
        </Field>

        <Field
          data-invalid={Boolean(currentActionState.fieldErrors.interest?.[0])}
        >
          <FieldLabel htmlFor="interest-storefront">Interest</FieldLabel>
          <input type="hidden" name="interest" value={interest} />
          <ToggleGroup
            type="single"
            variant="outline"
            value={interest}
            onValueChange={(value) => {
              if (value) {
                setInterest(value as Interest);
              }
            }}
            className="w-full flex-wrap"
          >
            <ToggleGroupItem
              id="interest-storefront"
              value="storefront"
              className="flex-1"
            >
              Storefront
            </ToggleGroupItem>
            <ToggleGroupItem value="admin" className="flex-1">
              Admin
            </ToggleGroupItem>
            <ToggleGroupItem value="both" className="flex-1">
              Both
            </ToggleGroupItem>
          </ToggleGroup>
          <FieldDescription>
            Choose the product updates you want to receive.
          </FieldDescription>
          <FieldError>
            {currentActionState.fieldErrors.interest?.[0]}
          </FieldError>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isPending} className="h-10 px-4">
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
