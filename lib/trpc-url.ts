const DEFAULT_API_URL = "http://localhost:4000";

/**
 * Safely constructs a tRPC procedure URL from environment variables.
 * Handles comma-separated values, trailing slashes, and missing /trpc path prefixes.
 */
export function getTrpcUrl(procedure: string): URL {
  const rawUrl = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).split(",")[0].trim();
  const apiUrl = rawUrl.replace(/\/$/, "");
  const trpcBase = apiUrl.endsWith("/trpc") ? apiUrl : `${apiUrl}/trpc`;
  return new URL(`${trpcBase}/${procedure}`);
}
