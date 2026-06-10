import "server-only";

import {
  authStatusResponseSchema,
  type AuthStatusResponse,
  currentUserResponseSchema,
  type CurrentUserResponse,
} from "@repo/schemas/auth";
import { headers } from "next/headers";
import { getApiUrl } from "./api";

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

export async function getCurrentUser(): Promise<
  CurrentUserResponse["data"] | null
> {
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie");
  const response = await fetch(getApiUrl("/me"), {
    headers: cookieHeader
      ? {
          cookie: cookieHeader,
        }
      : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const body = await parseJson(response);
    throw new Error(
      `Current user request failed with status ${response.status}: ${JSON.stringify(body)}`,
    );
  }

  const body = await parseJson(response);
  return currentUserResponseSchema.parse(body).data;
}

export async function getAuthStatus(): Promise<AuthStatusResponse["data"]> {
  const response = await fetch(getApiUrl("/auth/status"), {
    cache: "no-store",
  });
  const body = await parseJson(response);

  if (!response.ok) {
    throw new Error(
      `Auth status request failed with status ${response.status}: ${JSON.stringify(body)}`,
    );
  }

  return authStatusResponseSchema.parse(body).data;
}
