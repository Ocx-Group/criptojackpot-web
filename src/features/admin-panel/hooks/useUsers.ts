import { useQuery } from '@tanstack/react-query';
import { User } from '@/interfaces/user';
import { userService } from '@/services';
import { useUserStore } from '@/store/userStore';

export function useUsers() {
  const { user } = useUserStore();
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(user?.id || 0),
  });

  return {
    users,
    isLoading,
    isError,
    error,
  };
}
