/**
 * Centralized Safe External URL sanitizer.
 * 
 * Enforces http/https protocol validation and blocks javascript:, data:,
 * or malformed URL vectors to prevent client-side XSS and malicious redirects.
 */
export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
