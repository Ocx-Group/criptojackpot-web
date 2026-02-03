import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import { useUserStore } from '@/store/userStore';
import { getUserService } from '@/di/serviceLocator';
import { AxiosError } from 'axios';

/**
 * Validates the user session and keeps user data in sync.
 * Uses keycloak-js for authentication state.
 */
export function useSessionValidator() {
  const { isAuthenticated, logout } = useKeycloakAuth();
  const { user, updateUser, clearUser } = useUserStore();
  const userId = user?.id;

  const { error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;

      const freshUserData = await getUserService().getUserById(userId);

      updateUser(freshUserData);
      return freshUserData;
    },
    enabled: isAuthenticated && !!userId,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      clearUser();
      logout('/login');
    }
  }, [error, clearUser, logout]);
}
