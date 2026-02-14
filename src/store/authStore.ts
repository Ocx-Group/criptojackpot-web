import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  rememberMe: boolean;
  resetPasswordEmail: string | null;

  // Actions
  setAuthenticated: (value: boolean) => void;
  setRememberMe: (value: boolean) => void;
  logout: () => void;
  setResetPasswordEmail: (email: string) => void;
  clearResetPasswordEmail: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      rememberMe: false,
      resetPasswordEmail: null,

      setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
      },

      setRememberMe: (value: boolean) => {
        set({ rememberMe: value });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          rememberMe: false,
          resetPasswordEmail: null,
        });
        if (typeof globalThis.window !== 'undefined') {
          localStorage.removeItem('user-profile-storage');
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
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        resetPasswordEmail: state.resetPasswordEmail,
      }),
    }
  )
);
