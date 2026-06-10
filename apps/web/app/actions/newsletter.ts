"use server";

import { refresh } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import {
  newsletterSignupSchema,
  type NewsletterSignupInput,
} from "@repo/schemas/newsletter";
import {
  createNewsletterSignup,
  NewsletterApiError,
} from "@/lib/server/newsletter/client";
import { type NewsletterSignupActionState } from "@/app/actions/newsletter-state";

type FieldErrors = Partial<
  Record<keyof NewsletterSignupInput, string[] | undefined>
>;

function formDataToPayload(formData: FormData): Record<string, unknown> {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    interest: formData.get("interest"),
  };
}

function toFieldError(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const messages = value.filter(
    (item): item is string => typeof item === "string",
  );

  return messages.length > 0 ? messages : undefined;
}

function normalizeActionError(body: unknown): {
  fieldErrors: FieldErrors;
  message?: string;
} | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const errors =
    record.errors && typeof record.errors === "object"
      ? (record.errors as Record<string, unknown>)
      : null;

  return {
    message: typeof record.message === "string" ? record.message : undefined,
    fieldErrors: {
      email: errors ? toFieldError(errors.email) : undefined,
      interest: errors ? toFieldError(errors.interest) : undefined,
      name: errors ? toFieldError(errors.name) : undefined,
    },
  };
}

export async function submitNewsletterSignup(
  _previousState: NewsletterSignupActionState,
  formData: FormData,
): Promise<NewsletterSignupActionState> {
  const parsed = newsletterSignupSchema.safeParse(formDataToPayload(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await createNewsletterSignup(parsed.data);
    refresh();

    return {
      status: "success",
      message: response.message,
      fieldErrors: {},
    };
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof NewsletterApiError) {
      const normalizedError = normalizeActionError(error.body);

      if (normalizedError) {
        return {
          status: "error",
          message:
            normalizedError.message ??
            "The newsletter service rejected the submission.",
          fieldErrors: normalizedError.fieldErrors,
        };
      }
    }

    return {
      status: "error",
      message: "Could not reach the backend. Check that the API is running.",
      fieldErrors: {},
    };
  }
}
