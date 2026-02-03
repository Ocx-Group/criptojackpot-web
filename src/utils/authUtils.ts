import { getAccessToken as getKeycloakToken } from '@/lib/keycloak';

/**
 * Get the access token from Keycloak
 * This is used for making API calls with authentication
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return getKeycloakToken() || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Get the access token synchronously from Keycloak
 * Useful when you need the token immediately without async
 */
export function getStoredAccessToken(): string | null {
  if (globalThis.window === undefined) return null;

  try {
    return getKeycloakToken() || null;
  } catch (error) {
    console.error('Error getting stored access token:', error);
    return null;
  }
}
