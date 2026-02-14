'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserService } from '@/di/serviceLocator';

/**
 * Hook that syncs user profile from backend after authentication.
 * Should be called in app layout or auth provider to ensure user data is loaded.
 * Authentication is handled via HttpOnly cookies (sent automatically by browser).
 */
export function useUserSync() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setUser, clearUser, user, isProfileLoaded } = useUserStore();

  // Fetch current user profile from backend
  const {
    data: userProfile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      const userData = await getUserService().getCurrentUser();
      return userData;
    },
    enabled: isAuthenticated && !isProfileLoaded,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update user store when profile is fetched
  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile, setUser]);

  // Clear user store on logout
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      clearUser();
    }
  }, [isAuthenticated, authLoading, clearUser]);

  return {
    user,
    isLoading: authLoading || isLoading,
    isError,
    isAuthenticated,
    isProfileLoaded,
    refetch,
  };
}
