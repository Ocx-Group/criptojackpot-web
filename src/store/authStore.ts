import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  resetPasswordEmail: string | null;

  // Actions
  setToken: (token: string | null) => void;
  logout: () => void;
  setResetPasswordEmail: (email: string) => void;
  clearResetPasswordEmail: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      resetPasswordEmail: null,

      setToken: token => {
        set({ token });
      },

      logout: () => {
        set({
          token: null,
          resetPasswordEmail: null,
        });
        if (typeof globalThis.window !== 'undefined') {
          globalThis.location.href = '/landing-page';
        }
      },

      setResetPasswordEmail: email => {
        set({ resetPasswordEmail: email });
      },

      clearResetPasswordEmail: () => {
        set({ resetPasswordEmail: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        token: state.token,
        resetPasswordEmail: state.resetPasswordEmail,
      }),
    }
  )
);
