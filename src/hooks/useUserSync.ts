'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { userService } from '@/services';

/**
 * Hook that checks the session on mount by calling GET /users/me.
 * The HttpOnly cookie is sent automatically by the browser.
 * This is the single source of truth for authentication state.
 */
export function useUserSync() {
  const { setUser, clearUser, user } = useUserStore();

  const {
    data: userProfile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: () => userService.getCurrentUser(),
    // Always enabled — on every mount/refresh we ask the server
    enabled: true,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Success: populate user store
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile, setUser]);

  // Error: no valid session or network issue — clear user and mark session check as done
  useEffect(() => {
    if (isError) {
      clearUser();
    }
  }, [isError, clearUser]);

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    refetch,
  };
}
