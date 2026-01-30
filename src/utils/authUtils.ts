import { getSession } from 'next-auth/react';

/**
 * Get the access token from next-auth session
 * This is used for making API calls with authentication
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.accessToken || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get the access token synchronously from stored session
 * Useful when you need the token immediately without async
 */
export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // next-auth stores session in a cookie, but we can check localStorage fallback
    const storedSession = sessionStorage.getItem('next-auth.session-token');
    if (storedSession) {
      return storedSession;
    }
    return null;
  } catch (error) {
    console.error('Error getting stored access token:', error);
    return null;
  }
}
