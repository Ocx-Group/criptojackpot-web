'use client';

import { useCallback, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { authService } from '@/services';

export interface AuthUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  username?: string;
  roles?: string[];
  emailVerified?: boolean;
}

export function useAuth() {
  const [isLoading] = useState(false);
  const user = useUserStore(state => state.user);
  const isAuthenticated = user !== null;
  const authLogout = useAuthStore(state => state.logout);
  const clearUser = useUserStore(state => state.clearUser);

  const login = useCallback(async (redirectPath?: string) => {
    console.log('Login not implemented. Redirect to:', redirectPath);
  }, []);

  const register = useCallback(async (redirectPath?: string) => {
    console.log('Register not implemented. Redirect to:', redirectPath);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the API call fails, clear local state
    }
    clearUser();
    authLogout();
  }, [clearUser, authLogout]);

  const hasRole = useCallback(
    (role: string) => {
      if (!user?.role?.name) return false;
      return user.role.name.toLowerCase() === role.toLowerCase();
    },
    [user]
  );

  const userRole: 'admin' | 'client' = hasRole('admin') ? 'admin' : 'client';

  const mapUser = useCallback((): AuthUser | null => {
    if (!user) return null;
    return {
      id: user.id?.toString(),
      email: user.email,
      name: `${user.name || ''} ${user.lastName || ''}`.trim(),
      username: user.email,
      roles: user.role ? [user.role.name] : [],
      emailVerified: user.emailVerified ?? true,
    };
  }, [user]);

  return {
    isLoading,
    isAuthenticated,
    user: mapUser(),
    userRole,
    login,
    register,
    logout,
    hasRole,
    initError: null,
  };
}
