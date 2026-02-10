'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getKeycloakInstance,
  initKeycloak,
  isAdapterReady,
  keycloakLogin,
  keycloakLogout,
  keycloakRegister,
  getAccessToken,
  getUserInfo,
  getUserRole,
  hasRole as checkRole,
  KeycloakUserInfo,
} from '@/lib/keycloak';

export interface KeycloakUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  username?: string;
  roles?: string[];
  emailVerified?: boolean;
}

export function useKeycloakAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const authenticated = await initKeycloak();

        if (!isMounted) return;

        if (!isAdapterReady()) {
          setInitError('Keycloak server not reachable. Login/Register will use fallback redirects.');
        }

        setIsAuthenticated(authenticated);

        if (authenticated) {
          const userInfo = getUserInfo();
          setUser(userInfo ? mapUserInfo(userInfo) : null);
          setAccessToken(getAccessToken() || null);
        }
      } catch (error) {
        console.error('[useKeycloakAuth] Init error:', error);
        if (isMounted) {
          setInitError(error instanceof Error ? error.message : 'Unknown init error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    const keycloak = getKeycloakInstance();

    if (!keycloak) {
      setIsLoading(false);
      return;
    }

    const handleTokenUpdate = () => {
      if (isMounted) {
        setAccessToken(keycloak.token || null);
        const userInfo = getUserInfo();
        setUser(userInfo ? mapUserInfo(userInfo) : null);
      }
    };

    const handleAuthLogout = () => {
      if (isMounted) {
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      }
    };

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).then(handleTokenUpdate).catch(handleAuthLogout);
    };

    keycloak.onAuthRefreshSuccess = handleTokenUpdate;
    keycloak.onAuthLogout = handleAuthLogout;

    return () => {
      isMounted = false;
    };
  }, []);

  const userRole = useMemo(() => {
    return getUserRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = useCallback(async (redirectUri?: string) => {
    await keycloakLogin(redirectUri);
  }, []);

  const register = useCallback(async (redirectUri?: string) => {
    await keycloakRegister(redirectUri);
  }, []);

  const logout = useCallback((redirectUri?: string) => {
    keycloakLogout(redirectUri);
  }, []);

  const hasRole = useCallback((role: string): boolean => {
    return checkRole(role);
  }, []);

  return {
    user,
    accessToken,
    userRole,
    isAuthenticated,
    isLoading,
    initError,
    login,
    register,
    logout,
    hasRole,
  };
}

function mapUserInfo(info: KeycloakUserInfo): KeycloakUser {
  return {
    id: info.id,
    email: info.email,
    name: info.name,
    username: info.username,
    roles: info.roles,
    emailVerified: info.emailVerified,
  };
}
