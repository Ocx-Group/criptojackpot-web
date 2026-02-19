import { create } from 'zustand';
import { User } from '@/interfaces/user';

interface UserState {
  user: User | null;
  /** true while the initial session check (GET /users/me) is in flight */
  isSessionLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => void;
  setSessionLoading: (loading: boolean) => void;
}

/**
 * Store for user profile data (in-memory only, no localStorage).
 * The server (via HttpOnly cookie) is the single source of truth.
 */
export const useUserStore = create<UserState>()(set => ({
  user: null,
  isSessionLoading: true,

  setUser: user => {
    set({ user, isSessionLoading: false });
  },

  updateUser: userData => {
    set(state => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  clearUser: () => {
    set({ user: null, isSessionLoading: false });
  },

  setSessionLoading: loading => {
    set({ isSessionLoading: loading });
  },
}));
