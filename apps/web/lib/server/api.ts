import 'server-only';

export function getApiBaseUrl(): string {
  const baseUrl = process.env.API_URL?.trim() || 'http://localhost:4001';

  try {
    return new URL(baseUrl).origin;
  } catch {
    throw new Error(`Invalid API_URL value: ${baseUrl}`);
  }
}

export function getApiUrl(path: string): URL {
  return new URL(path, `${getApiBaseUrl()}/`);
}
