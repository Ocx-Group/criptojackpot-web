'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import {
  initKeycloak,
  getKeycloakInstance,
  keycloakLogin,
  keycloakLogout,
  keycloakRegister,
  getAccessToken,
  getUserInfo,
  getUserRole,
  hasRole as checkRole,
  KeycloakUserInfo,
} from '@/lib/keycloak';

interface KeycloakContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: KeycloakUserInfo | null;
  accessToken: string | null;
  userRole: 'admin' | 'client';
  login: (redirectUri?: string) => Promise<void>;
  register: (redirectUri?: string) => Promise<void>;
  logout: (redirectUri?: string) => void;
  hasRole: (role: string) => boolean;
}

const KeycloakContext = createContext<KeycloakContextType | null>(null);

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<KeycloakUserInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const authenticated = await initKeycloak();

        if (!isMounted) return;

        setIsAuthenticated(authenticated);

        if (authenticated) {
          setUser(getUserInfo());
          setAccessToken(getAccessToken() || null);
        }
      } catch (error) {
        console.error('Keycloak init error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    // Listen for token updates (only on client side)
    const keycloak = getKeycloakInstance();

    if (!keycloak) {
      // Server-side, just mark as not loading
      setIsLoading(false);
      return;
    }

    const handleTokenUpdate = () => {
      if (isMounted) {
        setAccessToken(keycloak.token || null);
        setUser(getUserInfo());
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

  const contextValue: KeycloakContextType = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      accessToken,
      userRole: getUserRole(),
      login: keycloakLogin,
      register: keycloakRegister,
      logout: keycloakLogout,
      hasRole: checkRole,
    }),
    [isAuthenticated, isLoading, user, accessToken]
  );

  return <KeycloakContext.Provider value={contextValue}>{children}</KeycloakContext.Provider>;
};

export const useKeycloak = (): KeycloakContextType => {
  const context = useContext(KeycloakContext);

  if (!context) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }

  return context;
};

export default KeycloakProvider;
