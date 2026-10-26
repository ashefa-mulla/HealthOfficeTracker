import Hashids from 'hashids';

/**
 * Normalizes a JWT token, decoding Hashids hex strings (used by Angular HO Tracker)
 * or returning the raw JWT string.
 */
export function normalizeToken(token: string | null | undefined): string {
  if (!token || typeof token !== 'string') return '';
  const trimmed = token.trim();
  if (!trimmed) return '';

  // If already standard JWT format (header.payload.signature)
  if (trimmed.startsWith('ey') && trimmed.includes('.')) {
    return trimmed;
  }

  // Attempt Hashids decoding if saved in Angular's encodehexString format
  try {
    const hashids = new Hashids('', 20);
    const decodedHex = hashids.decodeHex(trimmed);
    if (decodedHex) {
      const match = decodedHex.match(/.{1,2}/g);
      if (match) {
        const decoded = match.reduce(
          (acc, char) => acc + String.fromCharCode(parseInt(char, 16)),
          ''
        );
        if (decoded && decoded.includes('.')) {
          return decoded;
        }
      }
    }
  } catch (err) {
    // Ignore and fallback
  }

  return trimmed;
}

/**
 * Decodes the payload of a JWT token.
 */
export function parseJwtPayload(token: string | null | undefined): Record<string, any> | null {
  const norm = normalizeToken(token);
  if (!norm) return null;
  try {
    const parts = norm.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

/**
 * Extracts full name from JWT token claims (ClaimTypes.Name -> unique_name or name).
 */
export function getJwtFullName(token: string | null | undefined): string | null {
  const payload = parseJwtPayload(token);
  if (!payload) return null;
  return (
    payload.unique_name ||
    payload.name ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
    null
  );
}

/**
 * Extracts email from JWT token claims.
 */
export function getJwtEmail(token: string | null | undefined): string | null {
  const payload = parseJwtPayload(token);
  if (!payload) return null;
  return (
    payload.email ||
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    null
  );
}
