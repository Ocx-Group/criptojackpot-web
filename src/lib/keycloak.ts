'use client';

import Keycloak from 'keycloak-js';

// ============================================================================
// crypto.subtle polyfill for non-secure contexts (HTTP with custom domains)
// ============================================================================

/* eslint-disable no-bitwise */
const sha256Bytes = (bytes: Uint8Array): ArrayBuffer => {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
    0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
    0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
    0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
    0xc67178f2,
  ];

  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));
  const ch = (x: number, y: number, z: number) => (x & y) ^ (~x & z);
  const maj = (x: number, y: number, z: number) => (x & y) ^ (x & z) ^ (y & z);
  const sigma0 = (x: number) => rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
  const sigma1 = (x: number) => rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
  const gamma0 = (x: number) => rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
  const gamma1 = (x: number) => rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);

  const bitLen = bytes.length * 8;
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLen, false);

  let h0 = 0x6a09e667,
    h1 = 0xbb67ae85,
    h2 = 0x3c6ef372,
    h3 = 0xa54ff53a;
  let h4 = 0x510e527f,
    h5 = 0x9b05688c,
    h6 = 0x1f83d9ab,
    h7 = 0x5be0cd19;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const w = new Array<number>(64);
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i++) w[i] = (gamma1(w[i - 2]) + w[i - 7] + gamma0(w[i - 15]) + w[i - 16]) | 0;

    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      h = h7;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + sigma1(e) + ch(e, f, g) + K[i] + w[i]) | 0;
      const t2 = (sigma0(a) + maj(a, b, c)) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const result = new ArrayBuffer(32);
  const rv = new DataView(result);
  [h0, h1, h2, h3, h4, h5, h6, h7].forEach((v, i) => rv.setUint32(i * 4, v, false));
  return result;
};
/* eslint-enable no-bitwise */

const installCryptoPolyfill = () => {
  if (typeof globalThis.crypto === 'undefined') {
    (globalThis as Record<string, unknown>).crypto = {};
  }

  if (typeof globalThis.crypto.randomUUID === 'undefined') {
    console.warn('[Keycloak] crypto.randomUUID not available. Installing polyfill.');
    (globalThis.crypto as Record<string, unknown>).randomUUID =
      (): `${string}-${string}-${string}-${string}-${string}` => {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}` as `${string}-${string}-${string}-${string}-${string}`;
      };
  }

  if (globalThis.crypto.subtle == null) {
    console.warn('[Keycloak] crypto.subtle not available (non-secure context). Installing JS polyfill for SHA-256.');
    const subtlePolyfill = {
      digest: async (algorithm: string | AlgorithmIdentifier, data: BufferSource): Promise<ArrayBuffer> => {
        const algoName = typeof algorithm === 'string' ? algorithm : algorithm.name;
        if (algoName !== 'SHA-256') {
          throw new Error(`Polyfill only supports SHA-256, got: ${algoName}`);
        }
        let input: Uint8Array;
        if (data instanceof ArrayBuffer) {
          input = new Uint8Array(data);
        } else if (data instanceof DataView) {
          input = new Uint8Array(data.buffer);
        } else {
          input = new Uint8Array((data as Uint8Array).buffer ?? data);
        }
        return sha256Bytes(input);
      },
    };
    Object.defineProperty(globalThis.crypto, 'subtle', {
      value: subtlePolyfill,
      writable: false,
      configurable: true,
    });
  }
};

if (typeof globalThis.window !== 'undefined') {
  installCryptoPolyfill();
}

// ============================================================================
// Keycloak configuration and instance management
// ============================================================================

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:30180',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'cryptojackpot',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'cryptojackpot-frontend',
};

let keycloakInstance: Keycloak | null = null;
let initAttempted = false;
let adapterReady = false;

export const getKeycloakInstance = (): Keycloak | null => {
  if (globalThis.window === undefined) return null;
  keycloakInstance ??= new Keycloak(keycloakConfig);
  return keycloakInstance;
};

/** Whether the Keycloak adapter initialized successfully */
export const isAdapterReady = (): boolean => adapterReady;

// ============================================================================
// Initialization with pre-flight connectivity check
// ============================================================================

export const initKeycloak = async (): Promise<boolean> => {
  const keycloak = getKeycloakInstance();
  if (!keycloak) return false;

  // Already initialized successfully
  if (adapterReady && keycloak.authenticated !== undefined) {
    return keycloak.authenticated;
  }

  // Already attempted and failed — don't retry (avoids infinite loops)
  if (initAttempted && !adapterReady) {
    console.warn('[Keycloak] init already failed. Fallback redirects will be used.');
    return false;
  }

  initAttempted = true;

  try {
    console.log('[Keycloak] Initializing...', {
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
      origin: globalThis.location?.origin,
    });

    // Pre-flight: verify Keycloak server is reachable before init()
    const wellKnownUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/.well-known/openid-configuration`;
    try {
      const probe = await fetch(wellKnownUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      if (!probe.ok) {
        throw new Error(`HTTP ${probe.status}`);
      }
      console.log('[Keycloak] OIDC discovery OK.');
    } catch (probeError) {
      console.error(`[Keycloak] Server NOT reachable at: ${wellKnownUrl}`, probeError);
      console.error('[Keycloak] Check:');
      console.error('  1. Keycloak is running');
      console.error('  2. hosts file has: 127.0.0.1 auth.cryptojackpot.local');
      console.error('  3. Port 30180 is accessible (kubectl port-forward or NodePort)');
      adapterReady = false;
      return false;
    }

    const initPromise = keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('[Keycloak] init() timeout after 10s')), 10000)
    );

    const authenticated = await Promise.race([initPromise, timeoutPromise]);

    adapterReady = true;
    console.log('[Keycloak] Init OK. authenticated =', authenticated);

    if (authenticated) {
      setupTokenRefresh(keycloak);
    }

    return authenticated;
  } catch (error) {
    adapterReady = false;
    console.error('[Keycloak] Init FAILED:', error);
    return false;
  }
};

const setupTokenRefresh = (keycloak: Keycloak) => {
  setInterval(async () => {
    if (keycloak.authenticated) {
      try {
        const refreshed = await keycloak.updateToken(60);
        if (refreshed) {
          console.log('[Keycloak] Token refreshed');
        }
      } catch (error) {
        console.error('[Keycloak] Token refresh failed:', error);
        keycloak.logout();
      }
    }
  }, 30000);
};

// ============================================================================
// Fallback helpers — manual OIDC redirects when adapter is unavailable
// ============================================================================

const buildRedirectUri = (redirectPath?: string): string => {
  return `${globalThis.location.origin}${redirectPath || '/user-panel'}`;
};

const buildKeycloakAuthUrl = (action: 'login' | 'register', redirectPath?: string): string => {
  const baseUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect`;
  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();

  try {
    sessionStorage.setItem('kc_state', state);
  } catch {
    // sessionStorage unavailable
  }

  const params = new URLSearchParams({
    client_id: keycloakConfig.clientId,
    response_type: 'code',
    redirect_uri: buildRedirectUri(redirectPath),
    scope: 'openid',
    state,
    nonce,
  });

  const endpoint = action === 'register' ? 'registrations' : 'auth';
  return `${baseUrl}/${endpoint}?${params.toString()}`;
};

// ============================================================================
// Public API — Login, Register, Logout with fallback guards
// ============================================================================

export const keycloakLogin = async (redirectPath?: string): Promise<void> => {
  if (globalThis.window === undefined) {
    console.error('[Keycloak] login: client-side only');
    return;
  }

  const keycloak = getKeycloakInstance();
  if (!keycloak) return;

  if (!initAttempted) {
    await initKeycloak();
  }

  // Use adapter if available
  if (adapterReady && typeof keycloak.login === 'function') {
    await keycloak.login({ redirectUri: buildRedirectUri(redirectPath) });
    return;
  }

  // Fallback: manual redirect
  console.warn('[Keycloak] Adapter unavailable. Fallback redirect for login.');
  globalThis.location.href = buildKeycloakAuthUrl('login', redirectPath);
};

export const keycloakRegister = async (redirectPath?: string): Promise<void> => {
  if (globalThis.window === undefined) {
    console.error('[Keycloak] register: client-side only');
    return;
  }

  const keycloak = getKeycloakInstance();
  if (!keycloak) return;

  if (!initAttempted) {
    await initKeycloak();
  }

  // Use adapter if available
  if (adapterReady && typeof keycloak.register === 'function') {
    await keycloak.register({ redirectUri: buildRedirectUri(redirectPath) });
    return;
  }

  // Fallback: manual redirect
  console.warn('[Keycloak] Adapter unavailable. Fallback redirect for register.');
  globalThis.location.href = buildKeycloakAuthUrl('register', redirectPath);
};

export const keycloakLogout = (redirectUri?: string): void => {
  const keycloak = getKeycloakInstance();

  if (!keycloak) {
    console.error('[Keycloak] Not available (server-side)');
    return;
  }

  if (adapterReady && typeof keycloak.logout === 'function') {
    keycloak.logout({
      redirectUri: redirectUri || `${globalThis.location.origin}/landing-page`,
    });
    return;
  }

  // Fallback: manual redirect
  console.warn('[Keycloak] Adapter unavailable. Fallback redirect for logout.');
  const logoutUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;
  const postRedirect = encodeURIComponent(redirectUri || `${globalThis.location.origin}/landing-page`);
  globalThis.location.href = `${logoutUrl}?client_id=${keycloakConfig.clientId}&post_logout_redirect_uri=${postRedirect}`;
};

// ============================================================================
// Token & User helpers
// ============================================================================

export const getAccessToken = (): string | undefined => {
  return getKeycloakInstance()?.token;
};

export const isAuthenticated = (): boolean => {
  return getKeycloakInstance()?.authenticated ?? false;
};

export const getUserInfo = (): KeycloakUserInfo | null => {
  const keycloak = getKeycloakInstance();
  if (!keycloak?.authenticated || !keycloak.tokenParsed) return null;

  const tp = keycloak.tokenParsed as KeycloakTokenParsed;
  return {
    id: keycloak.subject || '',
    email: tp.email || '',
    name: tp.name || '',
    username: tp.preferred_username || '',
    roles: tp.realm_access?.roles || [],
    emailVerified: tp.email_verified || false,
  };
};

export const hasRole = (role: string): boolean => {
  const keycloak = getKeycloakInstance();
  if (!keycloak?.authenticated || !keycloak.tokenParsed) return false;
  const tp = keycloak.tokenParsed as KeycloakTokenParsed;
  return (tp.realm_access?.roles || []).includes(role);
};

export const getUserRole = (): 'admin' | 'client' => {
  return hasRole('admin') ? 'admin' : 'client';
};

// ============================================================================
// Types
// ============================================================================

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
  realm_access?: { roles: string[] };
  [key: string]: unknown;
}

export default getKeycloakInstance;
