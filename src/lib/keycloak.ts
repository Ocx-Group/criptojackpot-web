'use client';

import Keycloak from 'keycloak-js';

// Keycloak configuration for frontend (Public client)
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:30180',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'cryptojackpot',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'cryptojackpot-frontend',
};

// Singleton instance
let keycloakInstance: Keycloak | null = null;

// Helper to generate random string for state/nonce
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
};

// Helper to generate PKCE code verifier and challenge
const generatePKCE = async (): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const codeVerifier = generateRandomString(64);
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCodePoint(...new Uint8Array(digest)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
  return { codeVerifier, codeChallenge };
};

/**
 * Get the Keycloak singleton instance
 * This ensures we only have one Keycloak instance throughout the app
 * Returns null on server side
 */
export const getKeycloakInstance = (): Keycloak | null => {
  if (globalThis.window === undefined) {
    return null;
  }

  keycloakInstance ??= new Keycloak(keycloakConfig);

  return keycloakInstance;
};

/**
 * Initialize Keycloak with check-sso
 * This checks if the user is already authenticated without forcing login
 */
export const initKeycloak = async (): Promise<boolean> => {
  const keycloak = getKeycloakInstance();

  // Return false on server side
  if (!keycloak) {
    return false;
  }

  // Don't reinitialize if already done
  if (keycloak.authenticated !== undefined) {
    return keycloak.authenticated;
  }

  try {
    // Determine silent SSO URI (only available in browser environment)
    let silentSsoUri: string | undefined;
    if (globalThis.window !== undefined) {
      silentSsoUri = `${globalThis.location.origin}/silent-check-sso.html`;
    }

    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: silentSsoUri,
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });

    // Set up token refresh
    if (authenticated) {
      setupTokenRefresh(keycloak);
    }

    return authenticated;
  } catch (error) {
    console.error('Keycloak initialization failed:', error);
    return false;
  }
};

/**
 * Setup automatic token refresh before expiration
 */
const setupTokenRefresh = (keycloak: Keycloak) => {
  // Refresh token when it's about to expire (60 seconds before)
  setInterval(async () => {
    if (keycloak.authenticated) {
      try {
        const refreshed = await keycloak.updateToken(60);
        if (refreshed) {
          console.log('Token refreshed');
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        keycloak.logout();
      }
    }
  }, 30000); // Check every 30 seconds
};

/**
 * Build Keycloak authorization URL
 * This is a fallback method that doesn't require keycloak-js to be initialized
 */
const buildAuthUrl = async (action?: 'register'): Promise<string> => {
  const { codeVerifier, codeChallenge } = await generatePKCE();
  const state = generateRandomString(16);
  const nonce = generateRandomString(16);

  // Store PKCE verifier and state in sessionStorage for the callback
  sessionStorage.setItem('kc_pkce_code_verifier', codeVerifier);
  sessionStorage.setItem('kc_state', state);
  sessionStorage.setItem('kc_nonce', nonce);

  const redirectUri = `${globalThis.location.origin}/user-panel`;
  const baseUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`;

  const params = new URLSearchParams({
    client_id: keycloakConfig.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  if (action === 'register') {
    params.set('kc_action', 'register');
  }

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Login - redirects to Keycloak login page
 * Uses direct URL generation as primary method for reliability
 */
export const keycloakLogin = async (redirectPath?: string): Promise<void> => {
  if (globalThis.window === undefined) {
    console.error('Keycloak login can only be called on the client side');
    return;
  }

  try {
    // First, try using the Keycloak instance if available and initialized
    const keycloak = getKeycloakInstance();

    if (keycloak?.authenticated !== undefined) {
      // Keycloak is initialized, use its login method
      const fullRedirectUri = redirectPath
        ? `${globalThis.location.origin}${redirectPath}`
        : `${globalThis.location.origin}/user-panel`;

      await keycloak.login({ redirectUri: fullRedirectUri });
      return;
    }

    // Fallback: Generate URL manually (more reliable when keycloak-js has issues)
    console.log('Using manual Keycloak URL generation for login');
    const loginUrl = await buildAuthUrl();
    globalThis.location.href = loginUrl;
  } catch (error) {
    console.error('Keycloak login error, falling back to manual URL:', error);
    // Final fallback
    const loginUrl = await buildAuthUrl();
    globalThis.location.href = loginUrl;
  }
};

/**
 * Register - redirects to Keycloak registration page
 * Uses direct URL generation as primary method for reliability
 */
export const keycloakRegister = async (redirectPath?: string): Promise<void> => {
  if (globalThis.window === undefined) {
    console.error('Keycloak register can only be called on the client side');
    return;
  }

  try {
    // First, try using the Keycloak instance if available and initialized
    const keycloak = getKeycloakInstance();

    if (keycloak?.authenticated !== undefined) {
      // Keycloak is initialized, use its register method
      const fullRedirectUri = redirectPath
        ? `${globalThis.location.origin}${redirectPath}`
        : `${globalThis.location.origin}/user-panel`;

      await keycloak.register({ redirectUri: fullRedirectUri });
      return;
    }

    // Fallback: Generate URL manually with register action
    console.log('Using manual Keycloak URL generation for register');
    const registerUrl = await buildAuthUrl('register');
    globalThis.location.href = registerUrl;
  } catch (error) {
    console.error('Keycloak register error, falling back to manual URL:', error);
    // Final fallback
    const registerUrl = await buildAuthUrl('register');
    globalThis.location.href = registerUrl;
  }
};

/**
 * Logout - ends the Keycloak session
 */
export const keycloakLogout = (redirectUri?: string): void => {
  const keycloak = getKeycloakInstance();

  if (!keycloak) {
    console.error('Keycloak is not available (server-side)');
    return;
  }

  keycloak.logout({
    redirectUri: redirectUri || `${globalThis.location.origin}/landing-page`,
  });
};

/**
 * Get the current access token
 */
export const getAccessToken = (): string | undefined => {
  const keycloak = getKeycloakInstance();
  return keycloak?.token;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const keycloak = getKeycloakInstance();
  return keycloak?.authenticated ?? false;
};

/**
 * Get user info from token
 */
export const getUserInfo = (): KeycloakUserInfo | null => {
  const keycloak = getKeycloakInstance();

  if (!keycloak || !keycloak.authenticated || !keycloak.tokenParsed) {
    return null;
  }

  const tokenParsed = keycloak.tokenParsed as KeycloakTokenParsed;

  return {
    id: keycloak.subject || '',
    email: tokenParsed.email || '',
    name: tokenParsed.name || '',
    username: tokenParsed.preferred_username || '',
    roles: tokenParsed.realm_access?.roles || [],
    emailVerified: tokenParsed.email_verified || false,
  };
};

/**
 * Check if user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const keycloak = getKeycloakInstance();

  if (!keycloak || !keycloak.authenticated || !keycloak.tokenParsed) {
    return false;
  }

  const tokenParsed = keycloak.tokenParsed as KeycloakTokenParsed;
  const roles = tokenParsed.realm_access?.roles || [];

  return roles.includes(role);
};

/**
 * Get user's primary role (admin or client)
 */
export const getUserRole = (): 'admin' | 'client' => {
  return hasRole('admin') ? 'admin' : 'client';
};

// Type definitions
export interface KeycloakUserInfo {
  id: string;
  email: string;
  name: string;
  username: string;
  roles: string[];
  emailVerified: boolean;
}

interface KeycloakTokenParsed {
  email?: string;
  name?: string;
  preferred_username?: string;
  email_verified?: boolean;
  realm_access?: {
    roles: string[];
  };
  [key: string]: unknown;
}

export default getKeycloakInstance;
