import "server-only";

import {
  newsletterSignupListQuerySchema,
  newsletterSignupListResponseSchema,
  newsletterSignupResponseSchema,
  newsletterSignupSchema,
  type NewsletterSignupInput,
  type NewsletterSignupListQuery,
  type NewsletterSignupListResponse,
  type NewsletterSignupResponse,
} from "@repo/schemas/newsletter";
import { getApiUrl } from "../api";

function toQueryString(query: NewsletterSignupListQuery): string {
  const searchParams = new URLSearchParams({
    limit: String(query.limit),
    offset: String(query.offset),
  });

  return searchParams.toString();
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export class NewsletterApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "NewsletterApiError";
  }
}

export async function createNewsletterSignup(
  input: NewsletterSignupInput,
): Promise<NewsletterSignupResponse> {
  const payload = newsletterSignupSchema.parse(input);
  const response = await fetch(getApiUrl("/newsletter-signups"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await parseJson(response);

  if (!response.ok) {
    throw new NewsletterApiError(
      `Newsletter signup request failed with status ${response.status}`,
      response.status,
      responseBody,
    );
  }

  return newsletterSignupResponseSchema.parse(responseBody);
}

export async function getNewsletterSignups(
  input: Partial<NewsletterSignupListQuery> = {},
): Promise<NewsletterSignupListResponse> {
  const query = newsletterSignupListQuerySchema.parse(input);
  const response = await fetch(
    getApiUrl(`/newsletter-signups?${toQueryString(query)}`),
    {
      cache: "no-store",
    },
  );
  const responseBody = await parseJson(response);

  if (!response.ok) {
    throw new NewsletterApiError(
      `Newsletter fetch failed with status ${response.status}`,
      response.status,
      responseBody,
    );
  }

  return newsletterSignupListResponseSchema.parse(responseBody);
}
