'use client';

import { useSession, signOut } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

export interface KeycloakUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  username?: string;
  roles?: string[];
}

export function useKeycloakAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  const user: KeycloakUser | null = useMemo(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      username: session.user.username,
      roles: session.user.roles,
    };
  }, [session?.user]);

  const accessToken = session?.accessToken || null;

  const userRole = useMemo(() => {
    const roles = session?.user?.roles || [];
    return roles.includes('admin') ? 'admin' : 'client';
  }, [session?.user?.roles]);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/login' });
  }, []);

  const hasRole = useCallback(
    (role: string): boolean => {
      const roles = session?.user?.roles || [];
      return roles.includes(role);
    },
    [session?.user?.roles]
  );

  return {
    session,
    user,
    accessToken,
    userRole,
    isAuthenticated,
    isLoading,
    logout,
    hasRole,
  };
}
