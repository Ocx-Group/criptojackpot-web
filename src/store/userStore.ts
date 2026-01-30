import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/interfaces/user';

interface UserState {
  user: User | null;
  isProfileLoaded: boolean;

  // Actions
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => void;
}

/**
 * Store for user profile data.
 * Authentication is handled by next-auth/Keycloak.
 * This store manages user profile data fetched from the backend.
 */
export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isProfileLoaded: false,

      setUser: user => {
        set({ user, isProfileLoaded: true });
      },

      updateUser: userData => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      clearUser: () => {
        set({ user: null, isProfileLoaded: false });
      },
    }),
    {
      name: 'user-profile-storage',
      partialize: state => ({
        user: state.user,
        isProfileLoaded: state.isProfileLoaded,
      }),
    }
  )
);
