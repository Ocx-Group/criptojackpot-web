/**
 * Get the access token from localStorage
 * This is used for making API calls with authentication
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    if (typeof globalThis.window === 'undefined') return null;
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    const { state } = JSON.parse(authStorage);
    return state?.token || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get the access token synchronously from localStorage
 * Useful when you need the token immediately without async
 */
export function getStoredAccessToken(): string | null {
  if (globalThis.window === undefined) return null;

  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    const { state } = JSON.parse(authStorage);
    return state?.token || null;
  } catch (error) {
    console.error('Error getting stored access token:', error);
    return null;
  }
}
