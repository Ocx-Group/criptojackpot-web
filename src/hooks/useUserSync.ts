'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserService } from '@/di/serviceLocator';

/**
 * Hook that syncs user profile from backend after authentication.
 * Should be called in app layout or auth provider to ensure user data is loaded.
 */
export function useUserSync() {
  const { isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const { setUser, clearUser, user, isProfileLoaded } = useUserStore();

  const hasAccessToken = !!accessToken;

  // Fetch current user profile from backend
  const {
    data: userProfile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['current-user-profile'],
    queryFn: async () => {
      // Get user profile using the access token (handled by interceptor)
      const userData = await getUserService().getCurrentUser();
      return userData;
    },
    enabled: isAuthenticated && hasAccessToken && !isProfileLoaded,
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
