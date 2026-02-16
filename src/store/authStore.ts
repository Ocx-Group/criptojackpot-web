import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  rememberMe: boolean;
  resetPasswordEmail: string | null;

  // Actions
  setRememberMe: (value: boolean) => void;
  logout: (redirectTo?: string) => void;
  setResetPasswordEmail: (email: string) => void;
  clearResetPasswordEmail: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      rememberMe: false,
      resetPasswordEmail: null,

      setRememberMe: (value: boolean) => {
        set({ rememberMe: value });
      },

      logout: (redirectTo?: string) => {
        set({
          rememberMe: false,
          resetPasswordEmail: null,
        });
        if (typeof globalThis.window !== 'undefined') {
          localStorage.removeItem('user-profile-storage');
          globalThis.location.href = redirectTo || '/landing-page';
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
        rememberMe: state.rememberMe,
        resetPasswordEmail: state.resetPasswordEmail,
      }),
    }
  )
);
