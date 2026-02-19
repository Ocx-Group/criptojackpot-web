import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/userStore';
import { userService } from '@/services';
import axios from 'axios';

/**
 * Keeps user data in sync while the session is active.
 * Only runs when a user is already authenticated (after the initial check).
 * Uses HttpOnly cookies for authentication (sent automatically by browser).
 */
export function useSessionValidator() {
  const { isAuthenticated, logout } = useAuth();
  const { user, updateUser } = useUserStore();
  const userId = user?.id;

  const { error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const freshUserData = await userService.getUserById(userId);
      updateUser(freshUserData);
      return freshUserData;
    },
    enabled: isAuthenticated && !!userId,
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout();
    }
  }, [error, logout]);
}
