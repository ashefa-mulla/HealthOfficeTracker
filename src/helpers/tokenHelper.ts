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
