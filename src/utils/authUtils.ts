/**
 * Authentication is handled via HttpOnly cookies.
 * These functions are kept for backward compatibility but tokens
 * are no longer stored in localStorage.
 */

/**
 * @deprecated Tokens are now managed via HttpOnly cookies and are not accessible from JavaScript.
 */
export async function getAccessToken(): Promise<string | null> {
  return null;
}

/**
 * @deprecated Tokens are now managed via HttpOnly cookies and are not accessible from JavaScript.
 */
export function getStoredAccessToken(): string | null {
  return null;
}
